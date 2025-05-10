// components/Login.tsx
"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "@/utils/authorization";
import { useRouter } from "next/navigation";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace("/view-tangents");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-6">Sign in with Google</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <button
        onClick={handleGoogleLogin}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
      >
        Sign in with Google
      </button>
    </div>
  );
}
