// Global in-memory & disk-backed cache for profiles across requests & server restarts
// Ensures scanning and sharing URLs work even if MongoDB Atlas is paused or dev server restarts

import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), ".profiles-cache.json");

function loadFromDisk(): { profiles: [string, any][]; latest: [string, string][] } {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to read .profiles-cache.json", err);
  }
  return { profiles: [], latest: [] };
}

let saveTimeout: NodeJS.Timeout | null = null;
function scheduleSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const data = {
        profiles: Array.from(memoryProfiles.entries()),
        latest: Array.from(userLatestProfile.entries()),
      };
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write .profiles-cache.json", err);
    }
  }, 200);
}

class PersistentMap<K, V> extends Map<K, V> {
  override set(key: K, value: V): this {
    super.set(key, value);
    scheduleSave();
    return this;
  }
  override delete(key: K): boolean {
    const res = super.delete(key);
    scheduleSave();
    return res;
  }
}

const globalForProfiles = global as unknown as {
  memoryProfiles?: Map<string, any>;
  userLatestProfile?: Map<string, string>;
};

const diskData = loadFromDisk();

export const memoryProfiles: Map<string, any> =
  globalForProfiles.memoryProfiles || new PersistentMap<string, any>(diskData.profiles);

export const userLatestProfile: Map<string, string> =
  globalForProfiles.userLatestProfile || new PersistentMap<string, string>(diskData.latest);

globalForProfiles.memoryProfiles = memoryProfiles;
globalForProfiles.userLatestProfile = userLatestProfile;
