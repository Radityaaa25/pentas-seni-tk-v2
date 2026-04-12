import Image from 'next/image';

export const AdminSidebar = ({ activeView, setActiveView, onLogout }: { activeView: string, setActiveView: (view: 'map' | 'participants') => void, onLogout: () => void }) => {
  return (
    <aside className="w-72 bg-[#5d4037] border-r border-[#3e2723] fixed h-full hidden md:block z-10 shadow-2xl">
      <div className="p-8 border-b border-[#8d6e63]/30 flex flex-col items-center text-center">
        <div className="relative w-20 h-20 mb-3 filter drop-shadow-md bg-[#fff8e1] rounded-full p-2">
           <Image src="/TKSD.png" alt="Logo" fill className="object-contain p-2"/>
        </div>
        <h2 className="text-2xl font-black text-[#fff8e1]">ADMIN TK</h2>
        <p className="text-[#d7ccc8] text-xs font-bold uppercase tracking-widest mt-1">Panel Kontrol</p>
      </div>
      <nav className="p-4 space-y-3 mt-4">
        <button onClick={() => setActiveView('map')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all ${activeView === 'map' ? 'bg-[#fff8e1] text-[#5d4037] shadow-lg' : 'text-[#d7ccc8] hover:bg-[#8d6e63] hover:text-[#fff8e1]'}`}>
          <span>🗺️</span> Manajemen Peta
        </button>
        <button onClick={() => setActiveView('participants')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all ${activeView === 'participants' ? 'bg-[#fff8e1] text-[#5d4037] shadow-lg' : 'text-[#d7ccc8] hover:bg-[#8d6e63] hover:text-[#fff8e1]'}`}>
          <span>📋</span> Data Peserta
        </button>
      </nav>
      <div className="absolute bottom-0 w-full p-6 border-t border-[#8d6e63]/30">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-[#3e2723] text-[#fff8e1] font-black py-4 rounded-2xl hover:bg-[#2d1b15] transition-colors border border-[#8d6e63]">
          <span>🚪</span> Keluar
        </button>
      </div>
    </aside>
  );
};