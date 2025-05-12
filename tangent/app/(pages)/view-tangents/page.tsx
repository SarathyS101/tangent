// app/view-tangents/page.tsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import  auth  from "@/utils/authorization";
import { useRouter } from "next/navigation";
import TangentList from "@/components/TangentList";
import Navbar from "@/components/Navbar";

export default function ViewTangentsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser]    = useState<null | {}>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        router.replace("/");   // send back to login
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (!user)    return null; // already redirecting

  return (
    <div className="p-4">
      <Navbar />
      <TangentList />
    </div>
  );
}
