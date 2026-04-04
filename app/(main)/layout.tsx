'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import Home from '@/components/icons/Home';
import Category from '@/components/icons/Category';
import Image from 'next/image';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [isLogout, setIsLogout] = useState(false);
    const [openTrans, setOpenTrans] = useState(true);

    const handleLogout = async () => {
        setIsLogout(true);

        try {
            await axios.get('http://localhost:5000/auth/logout', {
                withCredentials: true,
            });

            router.push('/login?mode=signin');
        } catch (err: any) {
            console.log(err);
        } finally {
            setIsLogout(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">

            {/* SIDEBAR */}
            <aside className="w-2/12 relative">
                <div className="bg-[#252525] h-screen w-2/12 fixed text-white">

                    {/* LOGO */}
                    <div className="border-b border-[#3e3e3e]">
                        <div className="flex py-5 px-3 items-center gap-3">
                            <Image
                                src="/images/white_logo.png"
                                alt="Logo"
                                className="size-12"
                                width={36}
                                height={36}
                            />
                            <div>
                                <h1 className="font-semibold text-xl">Trace.</h1>
                                <p className="text-[#AAAFB2] text-xs">Know Where It Goes</p>
                            </div>
                        </div>
                    </div>

                    {/* MENU */}
                    <div className="mx-3 mt-5">
                        <h1 className="font-semibold text-[#AAAFB2] text-sm ml-2 mb-3">
                            MENU
                        </h1>

                        <div className="flex flex-col gap-1 text-[#AAAFB2]">

                            {/* DASHBOARD */}
                            <div
                                onClick={() => router.push('/dashboard')}
                                className={`flex items-center gap-2 px-3 py-3 mr-2 rounded-md cursor-pointer transition duration-200
                                    ${pathname === '/dashboard'
                                        ? 'bg-[#3e3e3e]'
                                        : 'hover:bg-[#3e3e3e]'}
                                `}
                            >
                                <Home className="size-5" />
                                <p className="text-sm">Dashboard</p>
                            </div>

                            {/* TRANSACTIONS */}
                            <div>

                                {/* PARENT */}
                                <div
                                    onClick={() => setOpenTrans(!openTrans)}
                                    className="flex items-center justify-between px-3 py-3 mr-2 rounded-md cursor-pointer hover:bg-[#3e3e3e] transition"
                                >
                                    <div className="flex items-center gap-2">
                                        <Category className="size-5" />
                                        <p className="text-sm">Finance</p>
                                    </div>
                                    <span className="text-xs">
                                        {openTrans ? '▾' : '▸'}
                                    </span>
                                </div>

                                {/* CHILD */}
                                {openTrans && (
                                    <div className="ml-5 flex flex-col gap-1 mt-1">

                                        <div
                                            onClick={() => router.push('/Finance/transactions')}
                                            className={`text-sm px-3 py-2 rounded-md cursor-pointer transition
                                                ${pathname === '/Finance/transactions'
                                                    ? 'bg-[#3e3e3e]'
                                                    : 'hover:bg-[#3e3e3e]'}
                                            `}
                                        >
                                            Transactions
                                        </div>

                                        <div
                                            onClick={() => router.push('/Finance/wishlist')}
                                            className={`text-sm px-3 py-2 rounded-md cursor-pointer transition
                                                ${pathname === '/Finance/wishlist'
                                                    ? 'bg-[#3e3e3e]'
                                                    : 'hover:bg-[#3e3e3e]'}
                                            `}
                                        >
                                            Wishlist
                                        </div>

                                        <div
                                            onClick={() => router.push('/Finance/history')}
                                            className={`text-sm px-3 py-2 rounded-md cursor-pointer transition
                                                ${pathname === '/Finance/history'
                                                    ? 'bg-[#3e3e3e]'
                                                    : 'hover:bg-[#3e3e3e]'}
                                            `}
                                        >
                                            History
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* LOGOUT (optional) */}
                    {/* 
                    <div className="absolute bottom-5 w-full px-3">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 py-2 rounded-md text-sm"
                        >
                            Logout
                        </button>
                    </div>
                    */}

                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}