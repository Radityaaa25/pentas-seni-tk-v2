import { Seat } from '@/types';

export const TicketMap = ({ allSeats, regId }: { allSeats: Seat[], regId: string | null }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  const getSeatColorClass = (row: string, isMine: boolean, isTaken: boolean) => {
    if (isMine) return 'bg-[#5d4037] text-white shadow-lg shadow-[#3e2723]/40 z-10 scale-110 ring-2 ring-offset-2 ring-[#a1887f] border-none'; 
    if (isTaken) return 'bg-[#d7ccc8] text-[#a1887f] cursor-not-allowed border border-[#bcaaa4]'; 
    if (row === 'A') return 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'; 
    if (row === 'B' || row === 'C') return 'bg-pink-100 text-pink-800 border border-pink-300 hover:bg-pink-200'; 
    return 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'; 
  };

  return (
    <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl bg-[#fff8e1]/90 backdrop-blur-sm border border-[#d7ccc8] shadow-xl mb-12 relative z-10 animate-fade-in-up delay-100">
      <div className="md:hidden bg-[#d7ccc8] text-[#5d4037] text-[10px] font-bold text-center py-2 flex items-center justify-center gap-2">
         <span>↔️</span> Geser ke samping untuk melihat posisi
      </div>
      <div className="overflow-x-auto p-0 md:p-10 custom-scrollbar relative">
        <div style={{ minWidth: 'max-content' }} className="text-center mx-auto p-6">
          <div className="mb-10 md:mb-14 relative mx-auto md:w-2/3!" style={{ width: '600px' }}>
             <div className="absolute inset-0 bg-[#8d6e63]/20 blur-3xl rounded-full"></div>
             <div className="h-12 md:h-16 rounded-b-[80px] md:rounded-b-[100px] shadow-xl shadow-[#3e2723]/20 flex items-center justify-center relative z-10 border-t-4 border-[#a1887f]" style={{ background: 'linear-gradient(to bottom, #8d6e63, #5d4037)' }}>
                <span className="text-[10px] font-black tracking-[0.4em] text-[#efebe9] uppercase mt-2">Panggung Utama</span>
             </div>
          </div>
          <div className="space-y-3 md:space-y-4">
            {rows.map((rowName) => {
              const seatsInRow = allSeats.filter(s => s.row_name === rowName);
              const halfIndex = Math.floor(seatsInRow.length / 2);
              return (
                <div key={rowName} className="flex justify-center items-center gap-2 md:gap-3">
                  <div className="sticky left-0 z-20 bg-[#fff8e1]/95 backdrop-blur px-2 md:px-3 py-1 rounded-r-lg shadow-sm border-r border-[#d7ccc8] font-black text-[#a1887f] text-xs md:text-sm w-8 md:w-10 shrink-0">{rowName}</div>
                  {seatsInRow.map((seat, index) => {
                    const isMine = seat.assigned_to === regId;
                    const isTaken = seat.is_occupied && !isMine;
                    const isAisle = index === halfIndex; 
                    const colorClass = getSeatColorClass(rowName, isMine, isTaken);
                    return (
                      <div key={seat.id} className={`${isAisle ? 'ml-12 md:ml-20' : ''} w-8 h-8 md:w-10 md:h-10 text-[9px] md:text-xs shrink-0 flex items-center justify-center font-bold transition-all duration-300 rounded-lg md:rounded-xl shadow-sm ${colorClass}`}>
                        {seat.seat_number}
                      </div>
                    );
                  })}
                  <div className="sticky right-0 z-20 bg-[#fff8e1]/95 backdrop-blur px-2 md:px-3 py-1 rounded-l-lg shadow-sm border-l border-[#d7ccc8] font-black text-[#a1887f] text-xs md:text-sm w-8 md:w-10 shrink-0">{rowName}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};