export const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-l-8 animate-slide-in ${type === 'success' ? 'bg-[#fff8e1] border-green-600 text-green-900' : 'bg-[#fff8e1] border-red-600 text-red-900'}`}>
    <span className="text-2xl">{type === 'success' ? '✅' : '❌'}</span>
    <div>
      <h4 className="font-black text-sm uppercase">{type === 'success' ? 'Berhasil' : 'Gagal'}</h4>
      <p className="font-bold text-sm text-[#5d4037]">{message}</p>
    </div>
    <button onClick={onClose} className="ml-4 text-[#8d6e63] hover:text-[#3e2723] font-black">✕</button>
  </div>
);