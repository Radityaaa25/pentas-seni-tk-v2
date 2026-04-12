import { Seat } from '@/types';

export const SeatMapEditor = ({ seats, toggleBlock }: { seats: Seat[], toggleBlock: (seat: Seat) => void }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  return (
    <div className="w-full overflow-x-auto rounded-3xl shadow-xl border-4 border-[#8d6e63] bg-[#fff8e1]">
      <div style={{ minWidth: '950px' }} className="p-8"> 
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 text-sm bg-[#efebe9] p-4 rounded-xl mx-auto w-max border-2 border-[#d7ccc8]">
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-white border-2 border-[#d7ccc8] rounded-lg"></div> <span className="font-black text-[#5d4037]">Umum</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#fff8e1] border-2 border-[#fcd34d] rounded-lg"></div> <span className="font-black text-[#d97706]">VIP (A)</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#f3e8ff] border-2 border-[#d8b4fe] rounded-lg"></div> <span className="font-black text-[#7e22ce]">Panitia (B & C)</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-red-800 rounded-lg border-2 border-red-900"></div> <span className="font-black text-[#5d4037]">Blokir</span></div>
          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#5d4037] rounded-lg border-2 border-[#3e2723]"></div> <span className="font-black text-[#5d4037]">Terisi</span></div>
        </div>

        <div className="space-y-3">
          {rows.map((rowName) => {
            const seatsInRow = seats.filter(s => s.row_name === rowName);
            const halfIndex = Math.floor(seatsInRow.length / 2);
            const rowLabel = rowName === 'A' ? 'A (VIP)' : (rowName === 'B' || rowName === 'C') ? `${rowName} (Pan)` : rowName;

            return (
              <div key={rowName} className="flex justify-center items-center gap-2">
                <div className="w-16 text-right font-black text-[#8d6e63] text-sm pr-2">{rowLabel}</div>
                {seatsInRow.map((seat, index) => {
                  const isAisle = index === halfIndex;
                  let emptyBgClass = 'bg-white text-[#5d4037] border-[#d7ccc8] hover:bg-[#efebe9] hover:border-[#8d6e63]';
                  if (seat.row_name === 'A') {
                      emptyBgClass = 'bg-[#fff8e1] text-[#d97706] border-[#fcd34d] hover:bg-[#fef3c7] hover:border-[#fbbf24]'; 
                  } else if (seat.row_name === 'B' || seat.row_name === 'C') {
                      emptyBgClass = 'bg-[#f3e8ff] text-[#7e22ce] border-[#d8b4fe] hover:bg-[#e9d5ff] hover:border-[#c084fc]';
                  }

                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleBlock(seat)}
                      title={seat.registrations ? `${seat.registrations.child_name}` : 'Kosong'}
                      className={`
                        ${isAisle ? 'ml-14' : ''}
                        w-10 h-10 rounded-xl text-xs font-black transition-all border-2
                        ${seat.is_occupied ? 'bg-[#5d4037] text-white border-[#3e2723] cursor-not-allowed opacity-100 shadow-md' : ''}
                        ${seat.is_blocked ? 'bg-red-800 text-white border-red-900 hover:bg-red-700 shadow-md' : ''}
                        ${!seat.is_occupied && !seat.is_blocked ? `${emptyBgClass} hover:scale-110` : ''}
                      `}
                    >
                      {seat.seat_number}
                    </button>
                  );
                })}
                <div className="w-16 text-left font-black text-[#8d6e63] text-sm pl-2">{rowLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};