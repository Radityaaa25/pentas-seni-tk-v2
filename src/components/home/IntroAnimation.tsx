import { useState, useEffect } from 'react';
import Image from 'next/image';

export const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [introStep, setIntroStep] = useState(0);
  const [isIntroExiting, setIsIntroExiting] = useState(false);

  useEffect(() => {
    const step1 = setTimeout(() => setIntroStep(1), 500);
    const step2 = setTimeout(() => setIntroStep(2), 2000);
    const step3 = setTimeout(() => setIntroStep(3), 3500);
    const exitTimer = setTimeout(() => setIsIntroExiting(true), 5500);
    const removeTimer = setTimeout(() => onComplete(), 6300);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fff8e1] ${isIntroExiting ? 'animate-intro-exit' : ''}`}>
       {introStep === 1 && (
         <div className="animate-fade-in-up text-center">
            <h2 className="text-[#8d6e63] font-bold text-xl md:text-3xl uppercase tracking-widest">Selamat Datang di</h2>
         </div>
       )}

       {introStep >= 2 && (
         <div className="flex flex-col items-center gap-4 animate-pop-in">
            <div className="relative w-64 h-16 md:w-100 md:h-20 filter drop-shadow-md">
               <Image src="/Teks1.png" alt="Pentas Seni" fill className="object-contain" priority/>
            </div>
            <div className="flex gap-6 items-center justify-center my-2">
               <div className="relative w-24 h-24 md:w-32 md:h-32 filter drop-shadow-md">
                  <Image src="/TKSD.png" alt="Logo TK" fill className="object-contain" priority/>
               </div>
               <div className="relative w-24 h-24 md:w-32 md:h-32 filter drop-shadow-md">
                  <Image src="/LogoKomite.png" alt="Logo Komite" fill className="object-contain" priority/>
               </div>
            </div>
            <div className="relative w-72 h-12 md:w-125 md:h-16 filter drop-shadow-md">
               <Image src="/Teks2.png" alt="Keterangan" fill className="object-contain" priority/>
            </div>

            {introStep >= 3 && (
              <div className="mt-6 flex flex-col items-center animate-fade-in-up">
                  <div className="w-10 h-10 border-4 border-[#8d6e63] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#8d6e63] text-xs font-black mt-3 tracking-widest uppercase">Memuat...</p>
              </div>
            )}
         </div>
       )}
    </div>
  );
};