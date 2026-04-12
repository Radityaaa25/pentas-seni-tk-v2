export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#fff8e1] rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100 border-4 border-[#8d6e63]">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-black text-[#3e2723] mb-2">{title}</h3>
        <p className="text-[#5d4037] font-semibold text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-[#d7ccc8] text-[#5d4037] font-bold rounded-xl hover:bg-[#bcaaa4] transition-colors">Batal</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-700 text-white font-bold rounded-xl hover:bg-red-800 transition-colors shadow-lg shadow-red-700/30">Ya, Hapus</button>
        </div>
      </div>
    </div>
  );
};