"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/?view=admin");
  }, [router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Redirecting to admin...</p>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <AdminRedirect />
    </Suspense>
  );
}
