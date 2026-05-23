import { HiddenTicket } from "../shared/HiddenTicket";

export const SuccessPopup = ({
  finalSeats,
  regId,
  childName,
  childClass,
  onClose,
}: {
  finalSeats: string[];
  regId: string;
  childName: string;
  childClass: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-[#fff8e1] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-[#8d6e63] animate-pop-in relative flex flex-col items-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-2xl font-black text-[#5d4037] mb-6">
          Pendaftaran Berhasil!
        </h2>

        {/* Ticket View with scaling to fit within the max-w-sm container */}
        <div className="w-full relative mt-2 mb-6" style={{ height: "280px" }}>
          <div className="absolute top-0 left-1/2 origin-top" style={{ transform: "translateX(-50%) scale(0.5)" }}>
            <HiddenTicket
              childName={childName}
              childClass={childClass}
              seats={finalSeats}
              regId={regId}
              isHidden={false}
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full text-white font-bold py-3 rounded-xl shadow-md transform transition active:scale-95 hover:brightness-110 cursor-pointer"
          style={{ background: "linear-gradient(to right, #8d6e63, #5d4037)" }}
        >
          Kembali ke Halaman Awal
        </button>
      </div>
    </div>
  );
};
