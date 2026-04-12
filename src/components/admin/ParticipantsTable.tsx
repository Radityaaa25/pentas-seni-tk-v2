import { GroupedParticipant } from '@/types';

export const ParticipantsTable = ({ 
  filteredParticipants, 
  onEdit, 
  onDelete 
}: { 
  filteredParticipants: GroupedParticipant[],
  onEdit: (id: string, name: string, cls: string) => void,
  onDelete: (id: string) => void
}) => {
  return (
    <div className="bg-[#fff8e1] rounded-3xl shadow-xl border-4 border-[#8d6e63] overflow-hidden">
      <div className="max-h-150 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#5d4037] text-[#fff8e1] uppercase tracking-wider font-black text-xs border-b-4 border-[#3e2723] sticky top-0 z-10">
            <tr>
              <th className="p-5 pl-8">No Kursi</th>
              <th className="p-5">Nama Siswa</th>
              <th className="p-5">Kelas</th>
              <th className="p-5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d7ccc8]">
            {filteredParticipants.map((participant) => (
              <tr key={participant.regId} className="hover:bg-[#d7ccc8]/30 transition-colors group">
                <td className="p-5 pl-8 font-black text-[#3e2723] text-lg">
                    {participant.seatNumbers.join(" & ")}
                </td>
                <td className="p-5 font-bold text-[#5d4037] capitalize text-base">{participant.childName}</td>
                <td className="p-5">
                  <span className="bg-[#efebe9] text-[#5d4037] px-4 py-1.5 rounded-full font-black text-xs border border-[#bcaaa4]">
                    {participant.childClass}
                  </span>
                </td>
                <td className="p-5 flex justify-center gap-3">
                  <button 
                    onClick={() => onEdit(participant.regId, participant.childName, participant.childClass)}
                    className="bg-[#ffe082] text-[#e65100] p-2.5 rounded-xl hover:bg-[#ffd54f] font-bold transition-colors border border-[#ffca28]"
                    title="Edit Data"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => onDelete(participant.regId)}
                    className="bg-red-100 text-red-800 p-2.5 rounded-xl hover:bg-red-200 font-bold transition-colors border border-red-200"
                    title="Hapus Data"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {filteredParticipants.length === 0 && (
              <tr><td colSpan={4} className="p-12 text-center text-[#8d6e63] font-bold text-lg">Data tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};