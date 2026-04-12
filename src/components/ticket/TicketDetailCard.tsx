import { Seat, RegistrationData } from '@/types';
import { useRouter } from 'next/navigation';

export const TicketDetailCard = ({ 
  studentData, 
  mySeats, 
  onDownload 
}: { 
  studentData: RegistrationData | null, 
  mySeats: Seat[], 
  onDownload: () => void 
}) => {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-[#3e2723]/10 border border-[#d7ccc8] mb-16 relative z-10 animate-fade-in-up delay-200">
       <div className="absolute inset-0 bg-[#fff8e1]"></div> 
      <div className="p-6 text-center relative overflow-hidden bg-[#5d4037]">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
         <h3 className="text-[#efebe9] font-bold text-lg relative z-10">Tiket Anda</h3>
         <p className="text-[#d7ccc8] text-xs relative z-10">Silakan unduh tiket terbaru jika ada perubahan</p>
      </div>
      <div className="p-8 relative">
        <div className="flex justify-between items-center border-b border-[#d7ccc8] pb-5 mb-5">
            <div>
                <p className="text-[10px] text-[#8d6e63] font-bold uppercase tracking-wider mb-1">Nama Siswa</p>
                <p className="text-lg font-black text-[#3e2723] capitalize">{studentData?.child_name}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-[#8d6e63] font-bold uppercase tracking-wider mb-1">Kelas</p>
                <p className="text-lg font-black text-[#5d4037]">{studentData?.child_class}</p>
            </div>
        </div>
        <div className="bg-[#efebe9] p-5 rounded-2xl flex justify-between items-center mb-8 border border-[#d7ccc8]">
            <span className="font-bold text-[#5d4037] text-sm">Nomor Kursi</span>
            <span className="text-3xl font-black text-[#3e2723] tracking-tight">{mySeats.map(s => `${s.row_name}-${s.seat_number}`).join(" & ")}</span>
        </div>
        
        <div className="flex flex-col gap-3">
            <button onClick={onDownload} className="w-full py-4 bg-linear-to-r from-[#6d4c41] to-[#3e2723] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 group">
            <span className="group-hover:animate-bounce">📥</span> Download E-Ticket
            </button>

            <button 
                onClick={() => router.push('/')} 
                className="w-full py-4 bg-[#fff8e1] text-[#5d4037] font-bold rounded-xl border-2 border-[#5d4037] hover:bg-[#d7ccc8] transition-all active:scale-95"
            >
                🏠 Kembali ke Menu Utama
            </button>
        </div>
      </div>
    </div>
  );
};