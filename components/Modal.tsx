"use client";

import React, { useEffect, ReactNode } from "react";

interface ModalProps {
  title: string;
  children: ReactNode;
  closeButton?: () => void;  // Function buat nutup modal
  resetButton?: () => void;  // Function buat ngereset form
  submitButton?: () => void; // Function buat submit data
}

const Modal = ({
  title,
  children,
  closeButton,
  resetButton,
  submitButton,
}: ModalProps) => {

  // Tutup modal kalau user pencet tombol ESC di keyboard
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeButton) {
        closeButton();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeButton]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs"
      onClick={closeButton} // Klik area gelap otomatis nutup modal
    >
      <div
        className="border bg-white border-[#D2D2D2] w-11/12  md:w-5/12 rounded-xl "
        onClick={(e) => e.stopPropagation()} // Biar pas klik area putih, modal nggak nutup
      >
        {/* --- HEADER --- */}
        <div className="border-b  rounded-sm border-[#D2D2D2] py-3 px-5 flex items-center justify-between">
          <h2 className="font-semibold text-lg">{title}</h2>
          
          {/* Tombol X pojok kanan atas */}
          {closeButton && (
            <button onClick={closeButton} className="hover:opacity-60 duration-200">
              <svg className="size-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.19994 12L-6.10352e-05 10.8L4.79994 6L-6.10352e-05 1.2L1.19994 0L5.99994 4.8L10.7999 0L11.9999 1.2L7.19994 6L11.9999 10.8L10.7999 12L5.99994 7.2L1.19994 12Z" fill="black" />
              </svg>
            </button>
          )}
        </div>

        {/* --- BODY / CHILDREN --- */}
        {/* Tempat naro inputan form lu */}
        <div className="pt-4 px-5 max-h-[52vh] overflow-y-auto">
          {children}
        </div>

        {/* --- FOOTER / ACTIONS --- */}
        {(resetButton || submitButton) && (
          <div className="mt-5 flex justify-end gap-3 px-5 py-2 border-t border-[#D2D2D2]">
            {resetButton && (
              <button
                onClick={resetButton}
                className="px-6 py-1.5 text-sm rounded-lg font-medium border border-[#D2D2D2] text-gray-700 hover:bg-gray-100 duration-200"
              >
                Reset
              </button>
            )}
            
            {submitButton && (
              <button
                onClick={submitButton}
                className="px-6 py-1.5 text-sm rounded-lg font-medium text-white bg-black hover:bg-black/80 cursor-pointer duration-200"
              >
                Submit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;