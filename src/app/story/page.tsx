"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockStoryData } from "@/lib/mock-data";
import IDBadgeCard from "@/components/story/IDBadgeCard";
import { StoryData } from "@/types/story";

function StoryViewer() {
  const [data, setData] = useState<StoryData>(mockStoryData);
  const [isLoading, setIsLoading] = useState(true);
  const [isFail, setIsFail] = useState(false);
  
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  useEffect(() => {
    if (profileId) {
      fetch(`/api/profile?id=${profileId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data) {
            setData(json.data);
          } else {
            setIsFail(true);
          }
        })
        .catch(() => setIsFail(true))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [profileId]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05060b] relative overflow-hidden select-none">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(ellipse at 50% 40%, #11122a 0%, #05060b 62%)"
        }}
      />
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <IDBadgeCard
          data={data}
          stage={isFail ? 0 : 5}
          isLoading={isLoading}
          isFail={isFail}
          statusMessage={isFail ? "COULD NOT READ THAT ACCOUNT" : undefined}
          statusSub={isFail ? "Check the username, and make sure its saved pins are public." : undefined}
          onRetry={() => {
            window.location.href = "/";
          }}
        />
      </div>
    </main>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-[#05060b]" />}>
      <StoryViewer />
    </Suspense>
  );
}
