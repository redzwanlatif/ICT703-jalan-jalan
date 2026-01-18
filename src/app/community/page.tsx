"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Community page now redirects to root - the main welcome page is at /
export default function CommunityPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
