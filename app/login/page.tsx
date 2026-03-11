"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    if (isSignup && !name) {
      alert("Name harus diisi");
      return;
    }

    if (!email || !password) {
      alert("Email dan password harus diisi");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-2/3 relative">
        <Image
          src="/images/uang.jpeg"
          alt="money"
          fill
          className="object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full md:w-1/3 items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm text-center">

          {/* LOGO */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Image
              src="/images/logot.jpeg"
              alt="logo"
              width={40}
              height={40}
            />
            <span className="text-xl font-semibold">Trace.</span>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-bold mb-2 text-black">
            {isSignup
              ? "Sign Up for the Best Experience"
              : "Sign In for the Best Experience"}
          </h1>

          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Trace is a smart financial tracking app for building healthy
            financial habits. Track expenses, set budget limits, and manage
            your cash flow easily and securely.
          </p>

          {/* NAME */}
          {isSignup && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:border-black"
            />
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:border-black"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-black"
          />

          {/* MAIN BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 rounded-full mb-4 hover:bg-gray-800"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">
              {isSignup ? "Already have an account?" : "New to Trace?"}
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* SWITCH BUTTON */}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="w-full border border-gray-300 py-2 rounded-full mb-4 hover:bg-gray-50"
          >
            {isSignup ? "Sign In" : "Create Account"}
          </button>

          {/* GOOGLE */}
          <button className="w-full border border-gray-300 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50">
            <Image
              src="/images/google.png"
              alt="google"
              width={20}
              height={20}
            />
            Sign in With Google
          </button>

        </div>
      </div>
    </div>
  );
}