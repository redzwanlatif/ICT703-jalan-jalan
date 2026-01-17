"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InformaticsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/informatics/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">
        Redirecting to dashboard...
      </div>
    </div>
  );
}
