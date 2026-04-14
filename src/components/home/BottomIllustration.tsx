import Image from 'next/image';

export const BottomIllustration = ({ isHidden }: { isHidden: boolean }) => {
  return (
    <div className={`relative w-full max-w-md flex justify-center gap-55 items-end px-6 -mt-24 md:-mt-24 z-20 pointer-events-none animate-fade-in-up delay-500 shrink-0 ${!isHidden ? 'flex' : 'hidden'}`}>
       <div className="relative w-28 h-40 mb-3 md:w-32 md:h-44 filter drop-shadow-lg shrink-0">
          <Image src="/AnakPerempuan.png" alt="Anak Perempuan" fill className="object-contain object-bottom" />
       </div>
       <div className="relative w-34 h-50 -mr-5 md:w-40 md:h-56 filter drop-shadow-lg shrink-0">
          <Image src="/AnakLaki.png" alt="Anak Laki-laki" fill className="object-contain object-bottom" />
       </div>
    </div>
  );
};