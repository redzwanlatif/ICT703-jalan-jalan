"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Community stories page now redirects to root - the main welcome page shows stories
export default function CommunityStoriesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
