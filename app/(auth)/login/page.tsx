'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios, { Axios, AxiosError } from 'axios'; // <-- Tambahin axios

export default function AuthPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const mode = searchParams.get('mode');

    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Tambahan state buat nanganin loading & notif error
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (mode === 'signup') {
            setIsSignup(true);
        } else {
            setIsSignup(false);
        }
    }, [mode]);

    const handleSubmit = async () => {
        // Reset error tiap kali tombol dipencet
        setErrorMsg('');

        if (isSignup && !name) {
            setErrorMsg('Name harus diisi, bro.');
            return;
        }

        if (!email || !password) {
            setErrorMsg('Email dan password harus diisi.');
            return;
        }

        setIsLoading(true);

        try {
            if (isSignup) {
                // --- JALUR SIGN UP (REGISTER) ---
                const response = await axios.post('http://localhost:5000/auth/register', {
                    name,
                    email,
                    password,
                });

                console.log('Sukses daftar:', response.data);

                // 👇 INI YANG HARUS DIRUBAH 👇
                // Sebelumnya lu cuma nulis: router.push("/otp");
                // WAJIB diganti jadi kayak gini biar emailnya nyangkut di URL:
                router.push(`/OTP?email=${encodeURIComponent(email)}`);

                // (Catatan: Kalau nama folder halaman OTP lu bukan "otp" tapi "verify-code",
                // tinggal ganti aja jadi `/verify-code?email=${encodeURIComponent(email)}`)
            } else {
                // --- JALUR SIGN IN (LOGIN) ---
                const response = await axios.post(
                    'http://localhost:5000/auth/login',
                    {
                        email,
                        password,
                    },
                    {
                        // Wajib banget biar Express nyimpen cookie session di browser lu
                        withCredentials: true,
                    }
                );

                console.log('Sukses login:', response.data);
                // Kalau sukses login, langsung masukin ke dashboard
                router.push(`/OTP?email=${encodeURIComponent(email)}`);
            }
        } catch (err: AxiosError | any) {
            // Tangkep pesan error dari Backend
            if (err.response && err.response.data) {
                setErrorMsg(err.response.data.message);
            } else {
                setErrorMsg('Gagal nyambung ke server. Cek koneksi atau terminal backend lu.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi buat nembak ke jalur tol Google Login
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    return (
        <div className="flex min-h-screen">
            {/* LEFT IMAGE */}
            <div className="hidden md:flex w-8/12 relative">
                <Image src="/images/uang.jpeg" alt="money" fill className="object-cover" />
            </div>

            {/* RIGHT FORM */}
            <div className="flex w-full md:w-4/12 items-center justify-center bg-white px-8 sm:px-16 md:px-0">
                <div className="w-full max-w-sm text-center py-10">
                    {/* LOGO */}
                    {/* Biar error styling dari image tag ga numpuk, div-nya dikeluarin dikit */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Image src="/images/logot.jpeg" alt="logo" width={40} height={40} />
                            <span className="text-xl font-semibold">Trace.</span>
                        </div>

                        {/* TITLE */}
                        <h1
                            className="text-2xl md:text-3xl font-bold mb-6 text-black"
                            style={{ fontFamily: 'var(--font-playfair)' }}>
                            {isSignup
                                ? 'Sign Up for the Best Experience'
                                : 'Sign In for the Best Experience'}
                        </h1>

                        {/* DESCRIPTION */}
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                            Trace is a
                            <span className="font-semibold"> smart financial tracking app </span>
                            for building healthy financial habits. Track expenses, set budget
                            limits, and manage your cash flow easily and securely.
                        </p>
                    </div>

                    {/* MENAMPILKAN ERROR JIKA ADA */}
                    {errorMsg && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm text-left">
                            {errorMsg}
                        </div>
                    )}

                    {/* NAME (SIGNUP ONLY) */}
                    {isSignup && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:border-black/40 transition duration-300"
                            disabled={isLoading}
                        />
                    )}

                    {/* EMAIL */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:border-black/40 transition duration-300"
                        disabled={isLoading}
                    />

                    {/* PASSWORD */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-black/40 transition duration-300"
                        disabled={isLoading}
                    />

                    {/* MAIN BUTTON */}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-black text-white py-2 rounded-full mb-4 hover:bg-gray-800 duration-300 transition disabled:opacity-50 cursor-pointer">
                        {isLoading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
                    </button>

                    {/* DIVIDER */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-sm text-gray-500">
                            {isSignup ? 'Already have an account?' : 'New to Trace?'}
                        </span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* SWITCH BUTTON */}
                    <button
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setErrorMsg(''); // Clear error pas ganti mode
                        }}
                        disabled={isLoading}
                        className="w-full border border-gray-300 py-2 rounded-full mb-4 hover:bg-gray-100 duration-300 transition cursor-pointer">
                        {isSignup ? 'Sign In' : 'Create Account'}
                    </button>

                    {/* GOOGLE LOGIN */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full border border-gray-300 py-2 rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 duration-300 transition">
                        <Image src="/images/google.png" alt="google" width={20} height={20} />
                        Sign in With Google
                    </button>
                </div>
            </div>
        </div>
    );
}
