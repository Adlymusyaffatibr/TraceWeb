'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyCodePage() {

  const router = useRouter();

  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handleSubmit = () => {
    const finalCode = code.join("");

    if (finalCode.length < 6) {
      alert("Masukkan 6 digit kode");
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-8/12 relative">
        <Image
          src="/images/uang.jpeg"
          alt="money"
          fill
          className="object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full md:w-4/12 items-center justify-center bg-white px-8">
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
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Enter the code
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Enter the 6-digit code sent to your phone number
          </p>

          {/* OTP INPUT */}
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:border-black"
              />
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 rounded-md mb-4 hover:bg-gray-800"
          >
            Confirm and proceed
          </button>

          {/* RESEND */}
          <button className="text-sm text-gray-500 hover:underline">
            Resend Code
          </button>

        </div>
      </div>

    </div>
  );
}