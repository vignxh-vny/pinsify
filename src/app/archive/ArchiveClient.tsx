"use client";

import { useState } from "react";
import { Folder, FolderOpen, User as UserIcon, Calendar, Hash } from "lucide-react";
import { StoryData } from "@/types/story";
import IDBadgeCard from "@/components/story/IDBadgeCard";

type ProfileGroup = {
  user: any;
  profiles: any[];
};

export default function ArchiveClient({ userGroups }: { userGroups: ProfileGroup[] }) {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {userGroups.map((group) => {
        const isExpanded = expandedUserId === group.user.id;
        const latestProfile = group.profiles[0];

        return (
          <div 
            key={group.user.id}
            className={`border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${isExpanded ? 'md:col-span-2 xl:col-span-3' : ''}`}
          >
            {/* Folder Header - Clickable */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
              onClick={() => setExpandedUserId(isExpanded ? null : group.user.id)}
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <FolderOpen size={32} /> : <Folder size={32} />}
                <div>
                  <h2 className="text-xl font-black uppercase tracking-widest">{group.user.name || group.user.email}</h2>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                    <Hash size={12} /> ID: {group.user.id}
                  </p>
                </div>
              </div>
              <div className="bg-[#E60023] text-white px-3 py-1 font-black text-sm shadow-md">
                {group.profiles.length} FILES
              </div>
            </div>

            {/* Expanded Content Area */}
            {isExpanded && (
              <div className="border-t-4 border-black p-6 bg-[#f4f4f4]">
                <h3 className="font-black uppercase tracking-widest text-lg mb-6 flex items-center gap-2">
                  <Calendar size={20} /> Generation History
                </h3>
                
                <div className="flex gap-8 overflow-x-auto pb-4 snap-x">
                  {group.profiles.map((profile, idx) => {
                    const data = profile.data as StoryData;
                    const date = new Date(profile.createdAt).toLocaleDateString();
                    const time = new Date(profile.createdAt).toLocaleTimeString();
                    
                    return (
                      <div key={profile.id} className="snap-start flex-none w-[360px] flex flex-col">
                        <div className="bg-black text-white p-3 font-bold text-xs uppercase tracking-widest flex justify-between">
                          <span>{idx === 0 ? "LATEST" : `v${group.profiles.length - idx}`}</span>
                          <span>{date} {time}</span>
                        </div>
                        <div className="bg-white border-x-4 border-b-4 border-black p-4 relative" style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "117.6%", height: "900px" }}>
                           {/* Render the actual ID Badge Card but scaled down slightly to fit nicely */}
                           <div className="pointer-events-none">
                             <IDBadgeCard data={data} />
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
