"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get email from URL params (e.g. /otp?email=user@gmail.com)
  const emailFromUrl = searchParams.get("email");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Redirect to signup if no email param is present in the URL
  useEffect(() => {
    if (!emailFromUrl) {
      router.push("/login?mode=signup");
    }
  }, [emailFromUrl, router]);

  // Handle countdown timer & persistence
  useEffect(() => {
    // Check if a cooldown is still active from a previous session
    const savedTime = localStorage.getItem(`otp_resend_time_${emailFromUrl}`);
    if (savedTime) {
      const remaining = Math.floor((Number(savedTime) - Date.now()) / 1000);
      if (remaining > 0) {
        setCountdown(remaining);
        setIsResendDisabled(true);
      } else {
        localStorage.removeItem(`otp_resend_time_${emailFromUrl}`);
      }
    }
  }, [emailFromUrl]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            localStorage.removeItem(`otp_resend_time_${emailFromUrl}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdown, emailFromUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle digit input
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // Numbers only

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input when filled
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  // Handle backspace to move focus to the previous input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  // --- VERIFY OTP ---
  const handleSubmit = async () => {
    const finalCode = code.join("");
    setErrorMsg("");
    setSuccessMsg("");

    if (finalCode.length < 6) {
      setErrorMsg("Please enter the complete 6-digit code.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/auth/verify-otp", {
        email: emailFromUrl,
        code: finalCode,
      }, {
        withCredentials: true
      });


      const user = response.data.user;

      // Set role cookie for middleware (7 days)
      document.cookie = `user_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;

      if (user.role === "admin") {
        router.push("/category");
      } else {
        router.push("/Finance");
      }

    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Failed to connect to the server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- RESEND OTP ---
  const handleResend = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/auth/resend-otp", {
        email: emailFromUrl,
      });


      setSuccessMsg("Your OTP code has been sent!");
      
      // Apply 3-minute cooldown (180 seconds)
      const expiryTime = Date.now() + 180 * 1000;
      localStorage.setItem(`otp_resend_time_${emailFromUrl}`, expiryTime.toString());
      setCountdown(180);
      setIsResendDisabled(true);

      // Clear the OTP inputs
      setCode(["", "", "", "", "", ""]);
      document.getElementById("code-0")?.focus();
      
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Failed to resend OTP.");
      }
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex flex-col items-center justify-center mb-6">
             <div className="flex items-center gap-2 mb-6">
                <Image
                  src="/images/logot.jpeg"
                  alt="logo"
                  width={40}
                  height={40}
                />
                <span className="text-xl font-semibold">Trace.</span>
              </div>
          </div>

          {/* TITLE */}
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Enter the code
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            Enter the 6-digit code sent to your email <br/>
            <span className="font-semibold text-black">{emailFromUrl}</span>
          </p>

          {/* ERROR / SUCCESS NOTIFICATION */}
          {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm text-left">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative mb-4 text-sm text-left">
              {successMsg}
            </div>
          )}

          {/* OTP INPUT */}
          <div className="flex justify-center gap-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={isLoading}
                className="w-12 h-12 border border-gray-300 rounded-md text-center text-lg font-bold focus:outline-none focus:border-black disabled:bg-gray-100"
              />
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded-md mb-4 hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {isLoading ? "Processing..." : "Confirm and proceed"}
          </button>

          {/* RESEND */}
          <button 
            onClick={handleResend}
            disabled={isLoading || isResendDisabled}
            className={`text-sm text-gray-500 transition ${
              isLoading || isResendDisabled 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:text-black hover:underline"
            }`}
          >
            {isResendDisabled ? `Resend Code (${formatTime(countdown)})` : "Resend Code"}
          </button>

        </div>
      </div>

    </div>
  );
}