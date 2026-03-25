"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isLogout, setIsLogout] = useState(false);

    const handleLogout = async () => {
        setIsLogout(true);

        try {
            await axios.get("http://localhost:5000/auth/logout", {
                withCredentials: true,
            });

            console.log("Logout Berhasil");
            router.push("/login?mode=signin");
        } catch (err: any) {
            console.log(err);
        } finally {
            setIsLogout(false);
        }
    }


  return (
    <div className="flex min-h-screen bg-[#EDEDED]">
        <aside className="w-2/12 relative mr-2">
            <div className="w-full bg-[#252525] h-[98vh] absolute top-2 left-2 rounded-xl text-white">
                <div className="m-3">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </aside>
      <main className="w-10/12 mx-4 h-[97.3vh] mt-2.5 rounded-xl bg-white">
        {/* Konten dari dashboard/page.tsx bakal dirender di dalem sini */}
        {children} 
      </main>

    </div>
  );
}