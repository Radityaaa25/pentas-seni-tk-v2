export const SuccessPopup = ({
  finalSeats,
  regId,
  onAction,
}: {
  finalSeats: string[];
  regId: string;
  onAction?: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-[#fff8e1] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-[#8d6e63] animate-pop-in relative">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-2xl font-black text-[#5d4037] mb-2">
          Pendaftaran Berhasil!
        </h2>
        <p className="text-[#8d6e63] mb-6 font-medium text-sm">
          Selamat tiket anda akan otomatis terdownload
        </p>
        <div className="bg-[#efebe9] p-6 rounded-2xl mb-6 border border-[#d7ccc8]">
          <p className="text-xs text-[#5d4037] uppercase font-bold tracking-widest mb-1">
            Nomor Kursi
          </p>
          <p className="text-4xl font-black text-[#3e2723] tracking-tighter">
            {finalSeats.join(" & ")}
          </p>
        </div>
        <button
          onClick={() =>
            onAction
              ? onAction()
              : regId
                ? (window.location.href = `/ticket?id=${regId}`)
                : alert("ID tidak ditemukan.")
          }
          className="w-full text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 hover:brightness-110 cursor-pointer"
          style={{ background: "linear-gradient(to right, #8d6e63, #5d4037)" }}>
          Simpan Tiket & Lihat Peta 🗺️
        </button>
        <p className="mt-4 text-[9px] font-bold text-[#8d6e63] uppercase tracking-widest">
          Jika di iPhone tiket tidak terdownload, klik tombol di atas.
        </p>
      </div>
    </div>
  );
};
