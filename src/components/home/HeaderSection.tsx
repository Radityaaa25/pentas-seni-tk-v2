import Image from 'next/image';

export const HeaderSection = ({ isHidden }: { isHidden: boolean }) => {
  return (
    <div className={`relative z-40 flex flex-col items-center gap-1 md:gap-2 -mb-8 md:mb-2 animate-fade-in-up ${!isHidden ? 'flex' : 'hidden'}`}>
       <div className="relative w-85 h-25 md:w-150 md:h-28 filter drop-shadow-md">
          <Image src="/Teks1.png" alt="Pentas Seni" fill className="object-contain" />
       </div>
       <div className="flex gap-4 md:gap-6 items-center justify-center my-1">
          <div className="relative w-16 h-16 md:w-24 md:h-24 filter drop-shadow-md">
             <Image src="/TKSD.png" alt="Logo TK" fill className="object-contain" />
          </div>
          <div className="relative w-16 h-16 md:w-24 md:h-24 filter drop-shadow-md">
             <Image src="/LogoKomite.png" alt="Logo Komite" fill className="object-contain" />
          </div>
       </div>
       <div className="relative w-90 h-16 md:w-162.5 md:h-24 filter drop-shadow-md">
          <Image src="/Teks2.png" alt="Keterangan" fill className="object-contain" />
       </div>
    </div>
  );
};