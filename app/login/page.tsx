"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // sementara simulasi login berhasil
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Sign In for the Best Experience</h1>

        <input type="email" placeholder="Email" className="w-full border rounded-lg px-4 py-3 mb-4" />

        <input type="password" placeholder="Password" className="w-full border rounded-lg px-4 py-3 mb-4" />

        <button onClick={handleLogin} className="w-full bg-black text-white py-3 rounded-full mb-4">
          Sign In
        </button>

        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full border py-3 rounded-full">
          Sign in With Google
        </button>
      </div>
    </div>
  );
}
