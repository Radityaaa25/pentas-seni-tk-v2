import React, { useState } from "react";
import { Participant } from "@/hooks/useAdminData";

export const ParticipantsTable = ({
  filteredParticipants,
  onEdit,
  onDelete,
}: {
  filteredParticipants: Participant[];
  onEdit: (id: string, name: string, cls: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [classFilter, setClassFilter] = useState("Semua");
  const classOptions = [
    "Semua",
    "KB B1",
    "KB B2",
    "TK A1",
    "TK A2",
    "TK A3",
    "TK B1",
    "TK B2",
    "TK B3",
    "TK B4",
  ];

  // Filter berdasarkan kelas
  const displayData = filteredParticipants.filter((p) =>
    classFilter === "Semua" ? true : p.child_class === classFilter,
  );

  return (
    <div className="space-y-4">
      {/* Dropdown Filter Kelas */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-[#d7ccc8]">
        <label className="text-sm font-black text-[#5d4037]">
          FILTER KELAS:
        </label>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="bg-[#fff8e1] border-2 border-[#d7ccc8] rounded-xl px-4 py-2 text-sm font-bold text-[#3e2723] outline-none focus:border-[#5d4037]">
          {classOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="ml-auto text-xs font-bold text-[#8d6e63]">
          Menampilkan {displayData.length} Peserta
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-[#d7ccc8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#5d4037] text-[#efebe9] text-xs uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-4 w-16 text-center">No.</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Panggilan</th>
                <th className="px-6 py-4">Kelas</th>
                <th className="px-6 py-4">Kursi</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efebe9]">
              {displayData.map((p, index) => (
                <tr
                  key={p.id}
                  className="hover:bg-[#fff8e1]/50 transition-colors">
                  {/* Nomor Urut */}
                  <td className="px-6 py-4 font-black text-[#8d6e63] text-center">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4 font-bold text-[#3e2723]">
                    {p.child_name}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#5d4037]">
                    {p.child_nickname || "-"}
                  </td>
                  <td className="px-6 py-4 font-black text-[#8d6e63] text-xs">
                    {p.child_class}
                  </td>
                  <td className="px-6 py-4 font-black text-[#3e2723]">
                    {p.seatNumbers.length > 0 ? (
                      p.seatNumbers.join(", ")
                    ) : (
                      <span className="text-gray-400 font-normal italic">
                        Belum Cek Tiket
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      {/* Indikator Hadir (Hijau) / Belum (Merah) */}
                      <div
                        className={`w-3 h-3 rounded-full shadow-sm ${p.isPresent ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                        title={
                          p.isPresent
                            ? "Sudah Ambil Kursi"
                            : "Belum Ambil Kursi"
                        }
                      />

                      <button
                        onClick={() =>
                          onEdit(p.id, p.child_name, p.child_class)
                        }
                        className="text-blue-600 hover:scale-110 transition-transform">
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="text-red-600 hover:scale-110 transition-transform">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
