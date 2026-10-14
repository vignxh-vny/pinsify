import { PrismaClient } from "@prisma/client";
import { memoryProfiles, userLatestProfile } from "./profile-store";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Circuit breaker state to prevent 30-second hangs on every request
// when MongoDB Atlas is unreachable or IP is not whitelisted.
let isDbHealthy = true;
let lastDbCheck = 0;
const DB_RETRY_INTERVAL_MS = 60_000; // Check DB availability at most once per minute when failing

function canAttemptDb(): boolean {
  if (isDbHealthy) return true;
  if (Date.now() - lastDbCheck > DB_RETRY_INTERVAL_MS) {
    return true;
  }
  return false;
}

function handleDbFailure(err: any, operation: string) {
  isDbHealthy = false;
  lastDbCheck = Date.now();
  const msg = err?.message || String(err);
  
  if (
    msg.includes("Server selection timeout") ||
    msg.includes("timed out") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ReplicaSetNoPrimary") ||
    err?.code === "P2010"
  ) {
    console.warn(`[DB Status] MongoDB Atlas offline or IP not whitelisted (${operation}). Switched to high-speed in-memory store.`);
  } else {
    console.warn(`[DB Status] Database error during ${operation}. Using in-memory store.`);
  }
}

function handleDbSuccess() {
  if (!isDbHealthy) {
    console.log("[DB Status] MongoDB Atlas reconnected successfully.");
  }
  isDbHealthy = true;
}

export async function getCachedProfile(cleanUsername: string, totalPins: number) {
  // 1. Check in-memory store first (0ms latency)
  const cachedMemId = userLatestProfile.get(cleanUsername);
  if (cachedMemId && memoryProfiles.has(cachedMemId)) {
    const memData = memoryProfiles.get(cachedMemId);
    const cachedPins = memData?.user?.totalPins || 0;
    if (Math.abs(totalPins - cachedPins) < 5) {
      return { profileId: cachedMemId, data: memData, source: "memory" };
    }
  }

  // 2. Check MongoDB if available
  if (canAttemptDb()) {
    try {
      const dummyEmail = `${cleanUsername}@pinsbyme.local`;
      const existingUser = await prisma.user.findUnique({
        where: { email: dummyEmail },
        include: {
          aestheticProfiles: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      handleDbSuccess();

      if (existingUser && existingUser.aestheticProfiles.length > 0) {
        const cachedProfile = existingUser.aestheticProfiles[0];
        const cachedData = cachedProfile.data as any;
        const cachedPins = cachedData?.user?.totalPins || 0;

        // Populate in-memory cache for subsequent instant hits
        memoryProfiles.set(cachedProfile.id, cachedData);
        userLatestProfile.set(cleanUsername, cachedProfile.id);

        if (Math.abs(totalPins - cachedPins) < 5) {
          return { profileId: cachedProfile.id, data: cachedData, source: "mongodb" };
        }
      }
    } catch (err) {
      handleDbFailure(err, "cache check");
    }
  }

  return null;
}

export async function saveAestheticProfile(cleanUsername: string, fullStoryData: any): Promise<string> {
  // Always create and populate in-memory representation
  const memId = `mem_${Date.now()}_${cleanUsername}`;
  memoryProfiles.set(memId, fullStoryData);
  userLatestProfile.set(cleanUsername, memId);

  // If MongoDB is reachable, save permanently
  if (canAttemptDb()) {
    try {
      const dummyEmail = `${cleanUsername}@pinsbyme.local`;
      let user = await prisma.user.findUnique({ where: { email: dummyEmail } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: dummyEmail,
            name: cleanUsername,
          },
        });
      }

      const profile = await prisma.aestheticProfile.create({
        data: {
          userId: user.id,
          data: fullStoryData,
        },
      });

      handleDbSuccess();

      // Update memory store to match MongoDB ID
      memoryProfiles.delete(memId);
      memoryProfiles.set(profile.id, fullStoryData);
      userLatestProfile.set(cleanUsername, profile.id);

      return profile.id;
    } catch (err) {
      handleDbFailure(err, "save profile");
    }
  }

  return memId;
}

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function getProfileById(id: string) {
  // 1. In-memory & disk cache check
  if (memoryProfiles.has(id)) {
    return memoryProfiles.get(id);
  }

  // Fallback: If id is formatted as mem_timestamp_username, check userLatestProfile
  if (id.startsWith("mem_")) {
    const parts = id.split("_");
    if (parts.length >= 3) {
      const username = parts.slice(2).join("_").toLowerCase();
      const latestId = userLatestProfile.get(username);
      if (latestId && memoryProfiles.has(latestId)) {
        return memoryProfiles.get(latestId);
      }
    }
  }

  // 2. MongoDB check (only for valid 24-char hex ObjectIDs)
  if (canAttemptDb() && isValidObjectId(id)) {
    try {
      const profile = await prisma.aestheticProfile.findUnique({
        where: { id },
      });

      handleDbSuccess();

      if (profile) {
        memoryProfiles.set(profile.id, profile.data);
        return profile.data;
      }
    } catch (err) {
      handleDbFailure(err, "fetch profile");
    }
  }

  return null;
}

export async function deleteProfileById(id: string): Promise<boolean> {
  memoryProfiles.delete(id);

  if (canAttemptDb() && isValidObjectId(id)) {
    try {
      await prisma.aestheticProfile.delete({
        where: { id },
      });
      handleDbSuccess();
      return true;
    } catch (err) {
      handleDbFailure(err, "delete profile");
      return false;
    }
  }

  return true;
}

export async function deleteUserById(userId: string): Promise<boolean> {
  // Clean memory profiles belonging to this user
  for (const [id, data] of memoryProfiles.entries()) {
    if (data?.user?.username === userId || id.includes(userId)) {
      memoryProfiles.delete(id);
    }
  }
  userLatestProfile.delete(userId.toLowerCase());

  if (canAttemptDb() && isValidObjectId(userId)) {
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
      handleDbSuccess();
      return true;
    } catch (err) {
      handleDbFailure(err, "delete user");
      return false;
    }
  }

  return true;
}

export async function getAllArchivedProfiles() {
  if (canAttemptDb()) {
    try {
      const profiles = await prisma.aestheticProfile.findMany({
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      handleDbSuccess();

      // Also merge any unsaved in-memory profiles
      const dbIds = new Set(profiles.map((p) => p.id));
      const memoryOnly: any[] = [];
      for (const [id, data] of memoryProfiles.entries()) {
        if (!dbIds.has(id)) {
          memoryOnly.push({
            id,
            userId: data?.user?.username || "anonymous",
            data,
            createdAt: new Date(),
            user: {
              id: data?.user?.username || "anonymous",
              name: data?.user?.displayName || data?.user?.username,
              email: `${data?.user?.username}@pinsbyme.local`,
            },
          });
        }
      }

      return [...memoryOnly, ...profiles];
    } catch (err) {
      handleDbFailure(err, "archive fetch");
    }
  }

  // Fallback to in-memory profiles
  return Array.from(memoryProfiles.entries()).map(([id, data]) => ({
    id,
    userId: data?.user?.username || "anonymous",
    data,
    createdAt: new Date(),
    user: {
      id: data?.user?.username || "anonymous",
      name: data?.user?.displayName || data?.user?.username,
      email: `${data?.user?.username}@pinsbyme.local`,
    },
  }));
}
