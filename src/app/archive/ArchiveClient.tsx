"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Folder, FolderOpen, User as UserIcon, Calendar, Hash, Copy, Check, Trash2 } from "lucide-react";
import { StoryData } from "@/types/story";
import IDBadgeCard from "@/components/story/IDBadgeCard";

type ProfileGroup = {
  user: any;
  profiles: any[];
};

export default function ArchiveClient({ userGroups }: { userGroups: ProfileGroup[] }) {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDeleteUser = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this user and all their generated profiles? This action cannot be undone.")) return;
    
    setIsDeleting(userId);
    try {
      const res = await fetch(`/api/user?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      alert("Error deleting user.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteProfile = async (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this specific ID generation? This action cannot be undone.")) return;
    
    setIsDeleting(profileId);
    try {
      const res = await fetch(`/api/profile?id=${profileId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete profile.");
      }
    } catch (err) {
      alert("Error deleting profile.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {userGroups.map((group) => {
        const isExpanded = expandedUserId === group.user.id;
        const latestProfile = group.profiles[0];
        const latestData = latestProfile?.data as StoryData;
        const displayName = latestData?.user?.displayName || group.user.name || group.user.email;

        return (
          <div 
            key={group.user.id}
            className={`border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col ${isExpanded ? 'md:col-span-2 xl:col-span-3' : 'h-full'}`}
          >
            {/* Folder Header - Clickable */}
            <div 
              className={`p-4 cursor-pointer hover:bg-gray-100 flex flex-col justify-between min-h-[140px] ${isExpanded ? '' : 'flex-1'}`}
              onClick={() => setExpandedUserId(isExpanded ? null : group.user.id)}
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex-shrink-0 text-black">
                  {isExpanded ? <FolderOpen size={40} /> : <Folder size={40} />}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button 
                    onClick={(e) => handleCopy(e, group.user.email?.split('@')[0] || '', group.user.id)}
                    className="p-1.5 hover:bg-gray-200 rounded transition-colors text-gray-500 hover:text-black"
                    title="Copy Username"
                  >
                    {copiedId === group.user.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                  <button 
                    onClick={(e) => handleDeleteUser(e, group.user.id)}
                    disabled={isDeleting === group.user.id}
                    className="p-1.5 hover:bg-red-100 rounded transition-colors text-gray-500 hover:text-red-600 disabled:opacity-50"
                    title="Delete User & Data"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="w-full mt-auto pt-4">
                <h2 className="font-black text-sm sm:text-base md:text-lg uppercase tracking-widest break-all leading-tight">
                  @{group.user.email?.split('@')[0] || 'USER'}
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1 truncate">
                  <Hash size={10} className="flex-shrink-0" /> <span className="truncate">ID: {group.user.id}</span>
                </p>
              </div>
            </div>

            {/* Expanded Content Area */}
            {isExpanded && (
              <div className="border-t-4 border-black p-6 bg-[#f4f4f4]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black uppercase tracking-widest text-lg flex items-center gap-2">
                    <Calendar size={20} /> Generation History
                  </h3>
                  <div className="bg-[#E60023] text-white px-3 py-1 font-black text-xs sm:text-sm shadow-md">
                    {group.profiles.length} FILE{group.profiles.length !== 1 ? 'S' : ''}
                  </div>
                </div>
                
                <div className="flex gap-8 overflow-x-auto pb-4 snap-x">
                  {group.profiles.map((profile, idx) => {
                    const data = profile.data as StoryData;
                    const date = new Date(profile.createdAt).toLocaleDateString();
                    const time = new Date(profile.createdAt).toLocaleTimeString();
                    
                    return (
                      <div key={profile.id} className="snap-start flex-none w-[360px] flex flex-col">
                        <div className="bg-black text-white p-3 font-bold text-xs uppercase tracking-widest flex justify-between items-center">
                          <span>{idx === 0 ? "LATEST" : `v${group.profiles.length - idx}`}</span>
                          <div className="flex items-center gap-3">
                            <span>{date} {time}</span>
                            <button
                              onClick={(e) => handleDeleteProfile(e, profile.id)}
                              disabled={isDeleting === profile.id}
                              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                              title="Delete this generation"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="bg-[#f4f4f4] border-x-4 border-b-4 border-black relative overflow-hidden flex justify-center items-start" style={{ height: "600px" }}>
                           {/* Render the actual ID Badge Card but scaled down slightly to fit nicely */}
                           <div className="pointer-events-none w-full flex justify-center origin-top" style={{ transform: "scale(0.75)", marginTop: "-10px" }}>
                             <IDBadgeCard data={data} isArchive={true} />
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
