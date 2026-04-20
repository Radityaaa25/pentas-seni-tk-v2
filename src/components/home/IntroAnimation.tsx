import { useState, useEffect } from "react";

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
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fff8e1] ${isIntroExiting ? "animate-intro-exit" : ""}`}>
      {introStep === 1 && (
        <div className="animate-fade-in-up text-center">
          <h2 className="text-[#8d6e63] font-bold text-xl md:text-3xl uppercase tracking-widest">
            Selamat Datang di
          </h2>
        </div>
      )}

      {introStep >= 2 && (
        <div className="flex flex-col items-center gap-4 animate-pop-in">
          <div className="relative w-full max-w-50 md:max-w-100 filter drop-shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/TeksRev.png"
              alt="Pentas Seni"
              className="w-full h-auto object-contain"
            />
          </div>

          {introStep >= 3 && (
            <div className="mt-6 flex flex-col items-center animate-fade-in-up">
              <div className="w-10 h-10 border-4 border-[#8d6e63] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#8d6e63] text-xs font-black mt-3 tracking-widest uppercase">
                Memuat...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
