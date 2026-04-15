export const HeaderSection = ({ isHidden }: { isHidden: boolean }) => {
  return (
    <div
      className={`relative z-40 flex flex-col items-center gap-1 -mt-32 mb-14 md:gap-2 md:mt-4 animate-fade-in-up ${!isHidden ? "flex" : "hidden"}`}>
      <div className="relative w-85 h-25 mt-32 -mb-4 md:mt-7 md:w-150 md:h-28 filter drop-shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Teks1.png"
          alt="Pentas Seni"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex gap-4 md:gap-6 items-center justify-center my-1">
        <div className="relative w-16 h-16 md:w-24 md:h-24 filter drop-shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/TKSD.png"
            alt="Logo TK"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="relative w-16 h-16 md:w-24 md:h-24 filter drop-shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/LogoKomite.png"
            alt="Logo Komite"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="relative w-90 h-16 -mt-3 md:mb-7 md:w-162.5 md:h-24 filter drop-shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Teks2.png"
          alt="Keterangan"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};
