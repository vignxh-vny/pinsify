"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockStoryData } from "@/lib/mock-data";
import IDBadgeCard from "@/components/story/IDBadgeCard";

function StoryViewer() {
  const [data, setData] = useState(mockStoryData);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  useEffect(() => {
    if (profileId) {
      fetch(`/api/profile?id=${profileId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data) {
            setData(json.data);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [profileId]);

  if (isLoading) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background ambient glow based on user's aura */}
      <div 
        className="absolute inset-0 opacity-20 filter blur-[100px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, var(--accent-violet) 0%, transparent 70%)`
        }}
      />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <IDBadgeCard data={data} />
      </div>
    </main>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={<main className="min-h-dvh flex items-center justify-center bg-[var(--bg-primary)]"></main>}>
      <StoryViewer />
    </Suspense>
  );
}
