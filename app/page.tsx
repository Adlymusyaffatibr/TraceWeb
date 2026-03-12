"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col overflow-hidden">

      {/* NAVBAR */}
      <div className="relative flex items-center justify-end px-10 py-4 z-20">

        {/* CENTER LOGO */}
        <div className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
          Trace.
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/login?mode=signup")}
            className="border border-black px-4 py-1 rounded-md text-sm hover:bg-gray-200"
          >
            Sign Up
          </button>

          <button
            onClick={() => router.push("/login?mode=signin")}
            className="bg-black text-white px-4 py-1 rounded-md text-sm hover:bg-gray-800"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="relative flex flex-col items-center justify-center text-center flex-1">

        {/* BACKGROUND ICON */}
        <div className="absolute left-[5%] top-[35%] -translate-y-1/2 opacity-20 z-0">
          <Image
            src="/images/logot.jpeg"
            alt="background"
            width={550}
            height={550}
            className="max-w-none"
          />
        </div>

        {/* HERO TEXT */}
        <h1
          className="relative z-10 text-[110px] md:text-[170px] font-bold leading-[0.9]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          KNOW <br />
          WHERE IT <br />
          GOE$.
        </h1>

        {/* DESCRIPTION */}
        <p className="relative z-10 max-w-xl mt-8 text-gray-600 text-sm md:text-base">
          Trace is a <span className="font-semibold">smart financial tracking app</span>
          for building healthy financial habits. Track expenses, set budget
          limits, and manage your cash flow easily and securely.
        </p>

      </div>
    </div>
  );
}