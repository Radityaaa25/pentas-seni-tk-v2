export const SuccessPopup = ({
  finalSeats,
  regId,
  onLihatPeta,
  onDownload,
}: {
  finalSeats: string[];
  regId: string;
  onLihatPeta?: () => void;
  onDownload?: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-[#fff8e1] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-[#8d6e63] animate-pop-in relative">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-2xl font-black text-[#5d4037] mb-2">
          Pendaftaran Berhasil!
        </h2>

        <div className="bg-[#efebe9] p-6 rounded-2xl mb-6 mt-4 border border-[#d7ccc8]">
          <p className="text-xs text-[#5d4037] uppercase font-bold tracking-widest mb-1">
            Nomor Kursi
          </p>
          <p className="text-4xl font-black text-[#3e2723] tracking-tighter">
            {finalSeats.join(" & ")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Tombol Download Manual */}
          <button
            onClick={onDownload}
            className="w-full text-white font-bold py-3 rounded-xl shadow-md transform transition active:scale-95 hover:brightness-110 cursor-pointer bg-green-600">
            ⬇️ Unduh Tiket (Manual)
          </button>

          <button
            onClick={() =>
              onLihatPeta
                ? onLihatPeta()
                : regId
                  ? (window.location.href = `/ticket?id=${regId}`)
                  : alert("ID tidak ditemukan.")
            }
            className="w-full text-white font-bold py-3 rounded-xl shadow-md transform transition active:scale-95 hover:brightness-110 cursor-pointer"
            style={{
              background: "linear-gradient(to right, #8d6e63, #5d4037)",
            }}>
            Lihat Peta Lokasi 🗺️
          </button>
        </div>
      </div>
    </div>
  );
};
