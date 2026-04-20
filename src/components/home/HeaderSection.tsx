export const HeaderSection = ({ isHidden }: { isHidden: boolean }) => {
  return (
    <div
      className={`relative z-40 flex flex-col items-center gap-1 -mt-32 mb-14 md:gap-2 md:mt-4 animate-fade-in-up ${!isHidden ? "flex" : "hidden"}`}>
      <div className="relative w-full max-w-50 mt-36 md:max-w-100 md:-mt-1 md:mb-10 lg:max-w-96 filter drop-shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/TeksRev.png"
          alt="Pentas Seni"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};
