import { getAllArchivedProfiles } from "@/lib/db";
import ArchiveClient from "./ArchiveClient";

// Disable caching for the archive page so it always shows the latest generations
export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  // Fetch all profiles and their associated users, ordered by newest first (with in-memory fallback)
  const profiles = await getAllArchivedProfiles();

  // Group profiles by user
  const groupedProfiles = profiles.reduce((acc, profile) => {
    const userId = profile.user?.id || profile.userId || "anonymous";
    if (!acc[userId]) {
      acc[userId] = {
        user: profile.user,
        profiles: [],
      };
    }
    acc[userId].profiles.push(profile);
    return acc;
  }, {} as Record<string, any>);

  // Convert to array
  const userGroups = Object.values(groupedProfiles) as any;

  return (
    <main className="min-h-screen bg-[#f4f4f4] font-mono text-black">
      {/* Brutalist Header */}
      <header className="border-b-4 border-black p-6 bg-white sticky top-0 z-50 shadow-md flex justify-between items-end">
        <div>
          <h1
            className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            ARCHIVE
          </h1>
          <p className="text-sm font-bold tracking-widest uppercase mt-2 text-[#E60023]">
            // SECURE DATABASE TERMINAL //
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase">Total Users: {userGroups.length}</p>
          <p className="text-xs font-bold uppercase">Total Generations: {profiles.length}</p>
        </div>
      </header>

      <div className="p-6">
        <ArchiveClient userGroups={userGroups} />
      </div>
    </main>
  );
}
