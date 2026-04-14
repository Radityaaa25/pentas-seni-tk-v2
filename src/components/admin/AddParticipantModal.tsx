export const AddParticipantModal = ({
  isOpen,
  onClose,
  addData,
  setAddData,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  addData: { name: string; nickname: string; class: string };
  setAddData: (data: { name: string; nickname: string; class: string }) => void;
  onAdd: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#fff8e1] p-8 rounded-3xl w-full max-w-md shadow-2xl transform transition-all scale-100 border-4 border-[#5d4037]">
        <h3 className="text-2xl font-black text-[#3e2723] mb-6">
          Tambah Peserta Manual ➕
        </h3>
        <p className="text-[#5d4037] font-semibold mb-4 text-sm bg-[#efebe9] p-3 rounded-lg border border-[#d7ccc8]">
          Sistem akan otomatis mencarikan 2 kursi kosong berurutan di area UMUM
          (Baris D ke atas).
        </p>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-black text-[#8d6e63] uppercase mb-2 tracking-wider">
              Nama Lengkap Siswa
            </label>
            <input
              type="text"
              value={addData.name}
              onChange={(e) => setAddData({ ...addData, name: e.target.value })}
              className="w-full p-4 border-2 border-[#d7ccc8] rounded-xl outline-none focus:border-[#5d4037] font-bold text-[#3e2723] bg-white focus:bg-white transition-all"
              placeholder="Masukkan Nama Lengkap..."
            />
          </div>
          <div>
            <label className="block text-xs font-black text-[#8d6e63] uppercase mb-2 tracking-wider">
              Nama Panggilan
            </label>
            <input
              type="text"
              value={addData.nickname}
              onChange={(e) =>
                setAddData({ ...addData, nickname: e.target.value })
              }
              className="w-full p-4 border-2 border-[#d7ccc8] rounded-xl outline-none focus:border-[#5d4037] font-bold text-[#3e2723] bg-white focus:bg-white transition-all"
              placeholder="Masukkan Panggilan..."
            />
          </div>
          <div>
            <label className="block text-xs font-black text-[#8d6e63] uppercase mb-2 tracking-wider">
              Kelas
            </label>
            <div className="relative">
              <select
                value={addData.class}
                onChange={(e) =>
                  setAddData({ ...addData, class: e.target.value })
                }
                className="w-full p-4 border-2 border-[#d7ccc8] rounded-xl outline-none focus:border-[#5d4037] bg-white font-bold text-[#3e2723] appearance-none">
                {[
                  "KB B1",
                  "KB B2",
                  "TK A1",
                  "TK A2",
                  "TK A3",
                  "TK B1",
                  "TK B2",
                  "TK B3",
                  "TK B4",
                ].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8d6e63]">
                ▼
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-[#d7ccc8] text-[#5d4037] font-bold rounded-xl hover:bg-[#bcaaa4] transition-colors">
              Batal
            </button>
            <button
              onClick={onAdd}
              className="flex-1 py-4 bg-green-700 text-white font-black rounded-xl hover:bg-green-800 shadow-lg shadow-green-700/30 transition-colors">
              Simpan & Daftar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};