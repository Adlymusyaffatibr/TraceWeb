"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Nangkep email dari URL (misal: /otp?email=vedric@gmail.com)
  const emailFromUrl = searchParams.get("email");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Kalau user iseng buka halaman /otp tapi nggak bawa email di URL, tendang balik ke registrasi
  useEffect(() => {
    if (!emailFromUrl) {
      router.push("/login?mode=signup"); // Sesuaikan sama path login lu
    }
  }, [emailFromUrl, router]);

  // Handle pas user ngetik angka
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // Cuma boleh angka

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Otomatis pindah ke kotak selanjutnya kalau udah diisi
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  // Handle pas user pencet backspace (biar mundur ke kotak sebelumnya)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  // --- LOGIC VERIFY OTP ---
  const handleSubmit = async () => {
    const finalCode = code.join("");
    setErrorMsg("");
    setSuccessMsg("");

    if (finalCode.length < 6) {
      setErrorMsg("Masukkan 6 digit kode dengan lengkap bro.");
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

      console.log("Sukses Verifikasi:", response.data);
      const user = response.data.user;

      if (user.role === "admin") {
        router.push("/category");
      } else {
        router.push("/Finance");
      }

    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Gagal nyambung ke server bro.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIC RESEND OTP ---
  const handleResend = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/auth/resend-otp", {
        email: emailFromUrl,
      });

      console.log("Sukses Resend:", response.data);
      setSuccessMsg("Kode OTP baru udah dikirim ke email lu!");
      
      // Kosongin inputan lagi biar bersih
      setCode(["", "", "", "", "", ""]);
      document.getElementById("code-0")?.focus();
      
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Gagal ngirim ulang OTP.");
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

          {/* NOTIFIKASI ERROR / SUKSES */}
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
            {isLoading ? "Memproses..." : "Confirm and proceed"}
          </button>

          {/* RESEND */}
          <button 
            onClick={handleResend}
            disabled={isLoading}
            className="text-sm text-gray-500 hover:text-black hover:underline disabled:opacity-50 transition"
          >
            Resend Code
          </button>

        </div>
      </div>

    </div>
  );
}