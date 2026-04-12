import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const MainAuthForm = ({ 
  isHidden, 
  formData, 
  setFormData, 
  onSuccess 
}: { 
  isHidden: boolean, 
  formData: { childName: string, childClass: string },
  setFormData: (data: { childName: string, childClass: string }) => void,
  onSuccess: (seats: string[], id: string) => void
}) => {
  const [activeTab, setActiveTab] = useState<'daftar' | 'cek'>('daftar');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchData, setSearchData] = useState({ childName: '', childClass: 'KB B1' });

  const classOptions = ["KB B1", "TK A1", "TK A2", "TK A3", "TK A4", "TK B1", "TK B2", "TK B3", "TK B4"];

  const handleAutoAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (!formData.childName || formData.childName.trim() === '') {
        setStatus("Nama anak wajib diisi!");
        setLoading(false);
        return;
    }

    try {
      const { data: existingUsers } = await supabase
        .from('registrations')
        .select('id')
        .ilike('child_name', formData.childName.trim())
        .eq('child_class', formData.childClass)
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        setStatus("Nama & Kelas ini sudah terdaftar! Gunakan menu 'Cek Tiket'.");
        setLoading(false);
        return; 
      }

      const { data: availableSeats, error: searchError } = await supabase
        .from('seats')
        .select('id, row_name, seat_number')
        .eq('is_occupied', false)
        .eq('is_blocked', false)
        .gte('row_name', 'D') 
        .order('row_name', { ascending: true }) 
        .order('seat_number', { ascending: true }) 
        .limit(2);

      if (searchError) throw searchError;

      if (!availableSeats || availableSeats.length === 0) {
        setStatus("Mohon maaf, kursi umum (Row D-L) sudah penuh! 😭");
        setLoading(false);
        return;
      }

      const { data: newRegArray, error: regError } = await supabase
        .from('registrations')
        .insert([{ parent_name: '-', child_name: formData.childName.trim(), child_class: formData.childClass }])
        .select();

      if (regError) throw regError;
      if (!newRegArray || newRegArray.length === 0) throw new Error("Gagal menyimpan data.");

      const registration = newRegArray[0];

      const seatIds = availableSeats.map(seat => seat.id);
      const readableSeatNames = availableSeats.map(seat => `${seat.row_name}-${seat.seat_number}`);

      const { error: updateError } = await supabase.from('seats').update({ is_occupied: true, assigned_to: registration.id }).in('id', seatIds);
      if (updateError) throw updateError;

      onSuccess(readableSeatNames, registration.id);
      setLoading(false);
      
    } catch (error) {
       console.error(error);
       setStatus(`Terjadi Kesalahan Sistem`);
       setLoading(false);
    }
  };

  const handleCheckTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    if (!searchData.childName.trim()) {
        setStatus("Masukkan nama yang ingin dicari.");
        setLoading(false);
        return;
    }

    const namaClean = searchData.childName.trim();
    
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id, child_name')
        .ilike('child_name', `%${namaClean}%`)
        .eq('child_class', searchData.childClass)
        .limit(1);

      if (error) {
        setStatus("Gagal menghubungi server.");
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setStatus("Data tidak ditemukan. Cek ejaan nama.");
        setLoading(false);
        return;
      }

      window.location.href = `/ticket?id=${data[0].id}`;

    } catch (error) { 
      console.error(error);
      setStatus("Gagal mencari data.");
      setLoading(false);
    }
  };

  return (
    <div 
      className={`w-full max-w-md px-8 pt-50 md:pt-55 h-165 md:h-180 -mt-7.5 md:-mt-10 relative z-10 mx-auto flex flex-col justify-start ${!isHidden ? 'animate-page-enter' : 'opacity-0'}`}
      style={{ 
        backgroundImage: "url('/ConForm.png')",
        backgroundSize: '100% 100%', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.25))' 
      }}
    >
      <div className="absolute top-19 md:top-20 left-1/2 -translate-x-1/2 w-28 md:w-36 rotate-6 z-50 pointer-events-none filter drop-shadow-xl">
         <div className="relative w-full shine-effect rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/GoldenT.png" alt="Golden Ticket" className="w-full h-auto block" />
         </div>
      </div>

      <div className="flex items-center justify-center w-full mt-4 -mb-1 md:mt-6 animate-fade-in-up delay-100 shrink-0">
         <div className="bg-[#fff8e1]/80 backdrop-blur-sm border border-[#d7ccc8] text-[#5d4037] px-5 py-2 rounded-full text-xs md:text-sm font-black tracking-wide shadow-sm flex items-center gap-1.5">
            <span>📍</span> 31 Mei 2026, Gd. i3L Pulomas
         </div>
      </div>
      
      <div className="flex bg-[#d7ccc8]/50 p-1.5 rounded-2xl mb-4 mt-4 backdrop-blur-sm border border-[#a1887f]/30 shrink-0">
        <button 
          onClick={() => { setActiveTab('daftar'); setStatus(null); }} 
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'daftar' 
            ? 'bg-[#5d4037] text-white shadow-md transform scale-100' 
            : 'text-[#5d4037] hover:bg-[#a1887f]/20 hover:scale-95'
          }`}
        >
          Daftar Baru
        </button>
        <button 
          onClick={() => { setActiveTab('cek'); setStatus(null); }} 
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'cek' 
            ? 'bg-[#5d4037] text-white shadow-md transform scale-100' 
            : 'text-[#5d4037] hover:bg-[#a1887f]/20 hover:scale-95'
          }`}
        >
          Cek Tiket
        </button>
      </div>

      {status && (
        <div className={`p-4 mb-6 rounded-xl text-center text-sm font-bold animate-pulse shrink-0 ${
          status.includes('maaf') || status.includes('terdaftar') || status.includes('tidak ditemukan') || status.includes('Gagal') || status.includes('penuh') || status.includes('Kesalahan')
          ? 'bg-red-100 text-red-800 border border-red-200' 
          : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {status}
        </div>
      )}

      <div className="flex-1 w-full flex flex-col justify-start">
        {activeTab === 'daftar' ? (
          <form onSubmit={handleAutoAssign} className="space-y-5 w-full">
            <div className="group">
              <label className="block text-[#5d4037] text-[10px] font-black uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-[#8d6e63]">Nama Lengkap Anak</label>
              <input 
                type="text" 
                required 
                className="w-full p-4 bg-[#fff8e1]/80 border-2 border-[#d7ccc8] focus:bg-white focus:border-[#8d6e63] focus:ring-4 focus:ring-[#8d6e63]/20 rounded-2xl outline-none text-[#3e2723] font-bold transition-all duration-300 placeholder:text-[#a1887f]" 
                placeholder="Contoh: Budi Santoso" 
                value={formData.childName} 
                onChange={(e) => setFormData({...formData, childName: e.target.value})} 
              />
            </div>
            <div className="relative group">
              <label className="block text-[#5d4037] text-[10px] font-black uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-[#8d6e63]">Pilih Kelas</label>
              <button 
                type="button" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="w-full p-4 bg-[#fff8e1]/80 border-2 border-[#d7ccc8] focus:bg-white focus:border-[#8d6e63] focus:ring-4 focus:ring-[#8d6e63]/20 rounded-2xl text-left flex justify-between items-center outline-none transition-all duration-300 text-[#3e2723]"
              >
                <span className="font-bold">{formData.childClass}</span>
                <span className={`text-[#8d6e63] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[#fff8e1] border border-[#d7ccc8] rounded-2xl shadow-xl z-20 overflow-hidden p-2 max-h-56 overflow-y-auto custom-scrollbar animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                    {classOptions.map((option) => (
                      <div 
                        key={option} 
                        onClick={() => { setFormData({ ...formData, childClass: option }); setIsDropdownOpen(false); }} 
                        className={`p-3 rounded-xl cursor-pointer font-bold text-sm mb-1 transition-colors ${
                          formData.childClass === option 
                          ? 'bg-[#5d4037] text-white' 
                          : 'text-[#5d4037] hover:bg-[#d7ccc8]'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#3e2723]/20 mt-4 flex justify-center items-center gap-3 text-lg transform transition-all duration-300 active:scale-95 hover:brightness-110 hover:shadow-2xl group" 
              style={{ background: 'linear-gradient(to right, #6d4c41, #3e2723)' }}
            >
              {loading ? (
                <span className="animate-pulse">Sedang Memproses...</span>
              ) : (
                <>
                  <span>Dapatkan Kursi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#d7ccc8] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94c-.924-.499-1.5-1.466-1.5-2.56 0-1.094.576-2.06 1.5-2.56V9c-.924-.499-1.5-1.466-1.5-2.56 0-1.094.576-2.06 1.5-2.56V3.75a.75.75 0 00-.75-.75H3.75a.75.75 0 00-.75.75v1.94c.924.499 1.5 1.466 1.5 2.56 0 1.094-.576 2.06-1.5 2.56z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCheckTicket} className="space-y-4 w-full">
            <div className="bg-[#a1887f]/10 p-2 rounded-2xl border border-[#a1887f]/30 text-sm text-[#3e2723] font-medium mb-1 -mt-3">
              Lupa nomor bangku? Cari data berdasarkan Nama & Kelas.
            </div>
            <div className="group">
              <label className="block text-[#5d4037] text-[10px] font-black uppercase tracking-widest mb-2 ml-1 -mt-0.5 transition-colors group-focus-within:text-[#8d6e63]">Cari Nama Anak</label>
              <input 
                type="text" 
                required 
                className="w-full p-4 bg-[#fff8e1]/80 border-2 border-[#d7ccc8] focus:bg-white focus:border-[#8d6e63] focus:ring-4 focus:ring-[#8d6e63]/20 rounded-2xl outline-none text-[#3e2723] font-bold transition-all duration-300 placeholder:text-[#a1887f]" 
                placeholder="Nama..." 
                value={searchData.childName} 
                onChange={(e) => setSearchData({...searchData, childName: e.target.value})} 
              />
            </div>
            <div className="relative group">
              <label className="block text-[#5d4037] text-[10px] font-black uppercase tracking-widest mb-2 ml-1 -mt-0.5 transition-colors group-focus-within:text-[#8d6e63]">Cari Kelas</label>
              <button 
                type="button" 
                onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)} 
                className="w-full p-4 bg-[#fff8e1]/80 border-2 border-[#d7ccc8] focus:bg-white focus:border-[#8d6e63] focus:ring-4 focus:ring-[#8d6e63]/20 rounded-2xl text-left flex justify-between items-center outline-none transition-all duration-300 text-[#3e2723]"
              >
                <span className="font-bold">{searchData.childClass}</span>
                <span className={`text-[#8d6e63] transition-transform duration-300 ${isSearchDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {isSearchDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSearchDropdownOpen(false)}></div>
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[#fff8e1] border border-[#d7ccc8] rounded-2xl shadow-xl z-20 overflow-hidden p-2 max-h-56 overflow-y-auto custom-scrollbar animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                    {classOptions.map((option) => (
                      <div 
                        key={option} 
                        onClick={() => { setSearchData({ ...searchData, childClass: option }); setIsSearchDropdownOpen(false); }} 
                        className={`p-3 rounded-xl cursor-pointer font-bold text-sm mb-1 transition-colors ${
                          searchData.childClass === option 
                          ? 'bg-[#5d4037] text-white' 
                          : 'text-[#5d4037] hover:bg-[#d7ccc8]'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#3e2723]/20 mt-4 flex justify-center items-center gap-3 transform transition-all duration-300 active:scale-95 hover:brightness-110 hover:shadow-2xl group" 
              style={{ background: 'linear-gradient(to right, #8d6e63, #6d4c41)' }}
            >
              {loading ? (
                <span>Mencari...</span>
              ) : (
                <>
                  <span>Cek Tiket Saya</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#efebe9] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};