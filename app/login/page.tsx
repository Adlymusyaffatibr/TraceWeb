"use client";

import Image from "next/image";
import { useState } from "react";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 relative">
        <Image src="/images/uang.jpeg" alt="money" fill className="object-cover" />
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-full max-w-sm p-8 text-center">
          {/* LOGO */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image src="/images/logot.jpeg" alt="logo" width={55} height={55} />
            <span className="text-lg font-semibold">Trace.</span>
          </div>

          {/* TITLE */}
          <h1 className="text-xl font-bold mb-2 text-black font-playfair">{isSignup ? "Sign Up for the Best Experience" : "Sign In for the Best Experience"}</h1>

          <p className="text-sm text-gray-500 mb-6">Trace is a smart financial tracking app for building healthy financial habits. Track expenses, set budget limits, and manage your cash flow easily and securely.</p>

          {/* NAME (ONLY SIGN UP) */}
          {isSignup && <input type="text" placeholder="Name" className="w-full border rounded-lg px-4 py-3 mb-4" />}

          {/* EMAIL */}
          <input type="email" placeholder="Email" className="w-full border rounded-lg px-4 py-3 mb-4" />

          {/* PASSWORD */}
          <input type="password" placeholder="Password" className="w-full border rounded-lg px-4 py-3 mb-4" />

          {/* MAIN BUTTON */}
          <button className="w-full bg-black text-white py-3 rounded-full mb-4">{isSignup ? "Sign Up" : "Sign In"}</button>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t"></div>
            <span className="px-3 text-sm text-gray-500">{isSignup ? "Already have an account?" : "New to Trace?"}</span>
            <div className="flex-1 border-t"></div>
          </div>

          {/* SWITCH BUTTON */}
          <button onClick={() => setIsSignup(!isSignup)} className="w-full border py-3 rounded-full mb-4">
            {isSignup ? "Sign In" : "Create Account"}
          </button>

          {/* GOOGLE */}
          <button className="w-full border py-3 rounded-full flex items-center justify-center gap-2">
            <Image src="/images/google.png" alt="google" width={20} height={20} />
            Sign in With Google
          </button>
        </div>
      </div>
    </div>
  );
}
