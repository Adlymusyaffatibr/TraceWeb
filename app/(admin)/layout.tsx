'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Home from '@/components/icons/Home';
import Category from '@/components/icons/Category';
import Image from 'next/image';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLogout, setIsLogout] = useState(false);

    const handleLogout = async () => {
        setIsLogout(true);

        try {
            await axios.get('http://localhost:5000/auth/logout', {
                withCredentials: true,
            });

            // Clear role cookie on logout
            document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

            router.push('/login?mode=signin');
        } catch (err: any) {
        } finally {
            setIsLogout(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            <aside className="w-2/12 relative">
                <div className=" bg-[#252525] h-screen w-2/12 fixed text-white">
                    <div className="">
                        <div className=" border-b border-[#3e3e3e] ">
                            <div className='flex py-5 px-3 items-center gap-3'>
                                <div className=''>
                                    <Image
                                        src="/images/white_logo.png"
                                        alt="Logo"
                                        className="size-12"
                                        width={36}
                                        height={36}
                                    />
                                </div>
                                <div>
                                    <h1 className="font-semibold text-xl">Trace.</h1>
                                    <p className="text-[#AAAFB2] text-xs">Know Where It Goes</p>
                                </div>
                            </div>
                        </div>
                        <div className="mx-3">
                            <div className='mt-5'>
                                <h1 className='font-semibold text-[#AAAFB2] text-sm ml-2 mb-3'>MENU</h1>
                                <div className='flex flex-col gap-1'>
                                <div className='flex items-center gap-2 hover:bg-[#3e3e3e] transition duration-300 rounded-md px-3 mr-2 py-3 cursor-pointer'
                                onClick={() => router.push('/category')}
                                >
                                    <Home className='size-5' />
                                    <p className='text-sm text-[#AAAFB2]'>Dashboard</p>
                                </div>
                                <div className='flex items-center gap-2 hover:bg-[#3e3e3e] rounded-md transition duration-300 px-3 mr-2 py-3 cursor-pointer'
                                onClick={() => router.push('/category')}
                                >
                                    <Category className='size-5' />
                                    <p className='text-sm text-[#AAAFB2]'>Categories</p>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-5 w-full px-3 pr-6">
                            <button
                                onClick={handleLogout}
                                disabled={isLogout}
                                className="w-full bg-[#3e3e3e] hover:bg-red-500/80 text-[#AAAFB2] hover:text-white py-3 rounded-md text-sm font-medium transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <span>{isLogout ? 'Logging out...' : 'Logout'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="w-10/12">
                {/* Main content from dashboard/page.tsx is rendered here */}
                {children}
            </main>
        </div>
    );
}
