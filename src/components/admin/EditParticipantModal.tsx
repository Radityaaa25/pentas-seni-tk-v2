export const EditParticipantModal = ({ 
  isOpen, 
  editData, 
  setEditData, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean, 
  editData: { id: string; name: string; class: string } | null,
  setEditData: (data: { id: string; name: string; class: string }) => void,
  onClose: () => void, 
  onSave: () => void 
}) => {
  if (!isOpen || !editData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#fff8e1] p-8 rounded-3xl w-full max-w-md shadow-2xl transform transition-all scale-100 border-4 border-[#8d6e63]">
        <h3 className="text-2xl font-black text-[#3e2723] mb-6">Edit Data Siswa ✏️</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-black text-[#8d6e63] uppercase mb-2 tracking-wider">Nama Siswa</label>
            <input 
              type="text" 
              value={editData.name} 
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              className="w-full p-4 border-2 border-[#d7ccc8] rounded-xl outline-none focus:border-[#5d4037] font-bold text-[#3e2723] bg-white focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-[#8d6e63] uppercase mb-2 tracking-wider">Kelas</label>
            <div className="relative">
              <select 
                value={editData.class}
                onChange={(e) => setEditData({...editData, class: e.target.value})}
                className="w-full p-4 border-2 border-[#d7ccc8] rounded-xl outline-none focus:border-[#5d4037] bg-white font-bold text-[#3e2723] appearance-none"
              >
                {["KB B1", "TK A1", "TK A2", "TK A3", "TK A4", "TK B1", "TK B2", "TK B3", "TK B4"].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8d6e63]">▼</div>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={onClose} className="flex-1 py-4 bg-[#d7ccc8] text-[#5d4037] font-bold rounded-xl hover:bg-[#bcaaa4] transition-colors">Batal</button>
            <button onClick={onSave} className="flex-1 py-4 bg-[#5d4037] text-white font-black rounded-xl hover:bg-[#3e2723] shadow-lg shadow-[#3e2723]/30 transition-colors">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    </div>
  );
};