import { useState } from 'react';
import Image from 'next/image';

export const AdminLogin = ({ onLogin }: { onLogin: (e: React.FormEvent, pin: string) => void }) => {
  const [pin, setPin] = useState('');

  return (
    <div className="min-h-screen bg-[#2d1b15] flex items-center justify-center p-4 relative font-sans">
      <form onSubmit={(e) => onLogin(e, pin)} className="bg-[#fff8e1] p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center relative overflow-hidden border-4 border-[#5d4037]">
        <div className="absolute top-0 left-0 w-full h-3" style={{ background: 'linear-gradient(to right, #8d6e63, #3e2723)' }}></div>
        <div className="flex flex-col items-center justify-center mb-4 mt-4">
           <div className="relative w-24 h-24 mb-2 filter drop-shadow-md">
              <Image src="/TKSD.png" alt="Logo TK" fill className="object-contain"/>
           </div>
           <h1 className="text-3xl font-black text-[#3e2723] mb-1">ADMIN PANEL</h1>
           <p className="text-[#8d6e63] font-bold text-xs uppercase tracking-widest">TK Aisyiyah 21</p>
        </div>
        <p className="text-[#5d4037] font-bold text-sm mb-6">Masukkan PIN keamanan</p>
        <input 
          type="password" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} 
          placeholder="PIN" 
          className="w-full p-4 border-2 border-[#d7ccc8] bg-[#efebe9] rounded-xl mb-6 text-center text-3xl tracking-[0.5em] font-black text-[#3e2723] focus:border-[#5d4037] outline-none transition-all placeholder:font-normal placeholder:tracking-normal" 
        />
        <button type="submit" className="w-full text-white font-black py-4 rounded-xl transition-transform active:scale-95 shadow-lg shadow-[#3e2723]/30" style={{ background: 'linear-gradient(to right, #6d4c41, #3e2723)' }}>MASUK DASHBOARD</button>
      </form>
    </div>
  );
};