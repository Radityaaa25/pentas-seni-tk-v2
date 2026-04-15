"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Participant = {
  id: string;
  child_name: string;
  child_nickname: string | null;
  child_class: string;
};

export const MainAuthForm = ({
  isHidden,
  onSuccess,
}: {
  isHidden: boolean;
  onSuccess: (seats: string[], id: string, name: string, cls: string) => void;
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // State untuk Pop-up (Sekarang HANYA dipakai untuk klik Box Kelas)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const classOptions = [
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

  useEffect(() => {
    const fetchParticipants = async () => {
      const { data } = await supabase
        .from("registrations")
        .select("*")
        .order("child_name");
      if (data) setParticipants(data);
    };
    fetchParticipants();
  }, []);

  // Filter logika
  const filteredParticipants = participants.filter((p) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.child_name.toLowerCase().includes(term) ||
        (p.child_nickname && p.child_nickname.toLowerCase().includes(term))
      );
    } else if (selectedClass) {
      return p.child_class === selectedClass;
    }
    return false;
  });

  const handleStudentClick = async (student: Participant) => {
    setLoading(true);
    setStatus(null);

    try {
      const { data: existingSeats, error: checkError } = await supabase
        .from("seats")
        .select("row_name, seat_number")
        .eq("assigned_to", student.id);

      if (checkError) throw checkError;

      if (existingSeats && existingSeats.length > 0) {
        const readableSeatNames = existingSeats.map(
          (seat) => `${seat.row_name}-${seat.seat_number}`,
        );
        onSuccess(
          readableSeatNames,
          student.id,
          student.child_name,
          student.child_class,
        );
        setLoading(false);
        setIsModalOpen(false);
        setSearchTerm(""); // Tutup dropdown
        return;
      }

      const { data: availableSeats, error: searchError } = await supabase
        .from("seats")
        .select("id, row_name, seat_number")
        .eq("is_occupied", false)
        .eq("is_blocked", false)
        .gte("row_name", "D")
        .order("row_name", { ascending: true })
        .order("seat_number", { ascending: true })
        .limit(2);

      if (searchError) throw searchError;

      if (!availableSeats || availableSeats.length === 0) {
        setStatus("Mohon maaf, kursi umum (Row D-L) sudah penuh! 😭");
        setLoading(false);
        return;
      }

      const seatIds = availableSeats.map((seat) => seat.id);
      const readableSeatNames = availableSeats.map(
        (seat) => `${seat.row_name}-${seat.seat_number}`,
      );

      const { error: updateError } = await supabase
        .from("seats")
        .update({ is_occupied: true, assigned_to: student.id })
        .in("id", seatIds);
      if (updateError) throw updateError;

      onSuccess(
        readableSeatNames,
        student.id,
        student.child_name,
        student.child_class,
      );
      setLoading(false);
      setIsModalOpen(false);
      setSearchTerm(""); // Tutup dropdown
    } catch (error) {
      console.error(error);
      setStatus(`Terjadi Kesalahan Sistem saat memproses tiket.`);
      setLoading(false);
    }
  };

  const handleClassClick = (c: string) => {
    setSelectedClass(c);
    setSearchTerm("");
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className={`w-full max-w-md px-6 pt-36 md:pt-40 pb-6 min-h-[500px] -mt-24 md:-mt-28 relative z-10 mx-auto flex flex-col justify-start ${!isHidden ? "animate-page-enter" : "opacity-0"}`}
        style={{
          backgroundImage: "url('/ConForm.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.25))",
        }}>
        <div className="absolute top-14 -mt-3 md:top-8 left-1/2 -translate-x-1/2 w-28 md:w-36 rotate-6 z-50 pointer-events-none filter drop-shadow-xl">
          <div className="relative w-full shine-effect rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/GoldenT.png"
              alt="Golden Ticket"
              className="w-full h-auto block"
            />
          </div>
        </div>

        <div className="flex items-center justify-center w-full mt-5 md:mt-4 animate-fade-in-up delay-100 shrink-0">
          <div className="bg-[#fff8e1]/80 backdrop-blur-sm border border-[#d7ccc8] text-[#5d4037] px-5 py-2 rounded-full text-xs md:text-sm font-black tracking-wide shadow-sm flex items-center gap-1.5">
            <span>📍</span> 31 Mei 2026, Gd. i3L Pulomas
          </div>
        </div>

        {/* Search Bar dengan Dropdown */}
        <div className="mt-4 shrink-0 px-2 relative z-50">
          <input
            type="text"
            placeholder="🔍 Cari Nama / Panggilan..."
            className="w-full p-4 bg-[#fff8e1]/90 border-2 border-[#d7ccc8] focus:bg-white focus:border-[#8d6e63] focus:ring-4 focus:ring-[#8d6e63]/20 rounded-2xl outline-none text-[#3e2723] font-bold transition-all text-sm shadow-inner relative z-20"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedClass(null);
              setIsModalOpen(false); // Pastikan modal ketutup saat ngetik
            }}
          />

          {/* DROPDOWN HASIL PENCARIAN (Muncul Otomatis saat Ngetik) */}
          {searchTerm && (
            <div className="absolute left-2 right-2 top-full mt-2 bg-white border-2 border-[#d7ccc8] rounded-2xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar z-50 overflow-hidden animate-fade-in-up">
              {loading ? (
                <div className="text-center text-[#8d6e63] font-bold text-sm py-6 animate-pulse">
                  Memproses Tiket...
                </div>
              ) : filteredParticipants.length > 0 ? (
                <div className="p-2 space-y-1">
                  {filteredParticipants.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleStudentClick(p)}
                      className="w-full text-left p-3 hover:bg-[#fff8e1] rounded-xl transition-all flex flex-col group border border-transparent hover:border-[#d7ccc8] active:scale-[0.98]">
                      <span className="font-black text-[#3e2723] text-sm group-hover:text-[#5d4037] truncate">
                        {p.child_name}
                      </span>
                      <div className="flex justify-between items-center w-full mt-1">
                        <span className="text-[10px] font-bold text-[#8d6e63]">
                          &quot;{p.child_nickname}&quot;
                        </span>
                        <span className="text-[9px] bg-[#efebe9] px-2 py-0.5 rounded-md font-black text-[#5d4037]">
                          {p.child_class}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[#8d6e63] font-bold text-sm py-6">
                  Nama tidak ditemukan.
                </div>
              )}
            </div>
          )}
        </div>

        {status && (
          <div className="mt-4 mx-2 p-3 rounded-xl text-center text-xs font-bold bg-red-100 text-red-800 border border-red-200 shrink-0 animate-pulse relative z-10">
            {status}
          </div>
        )}

        <div className="mt-4 shrink-0 px-2 flex-1 pb-4 relative z-10">
          <p className="text-[#5d4037] text-[10px] font-black uppercase tracking-widest mb-2 ml-1 text-center">
            Atau Pilih Kelas
          </p>
          <div className="grid grid-cols-3 gap-2">
            {classOptions.map((c) => (
              <button
                key={c}
                onClick={() => handleClassClick(c)}
                className={`py-3 px-1 rounded-xl text-xs font-bold transition-all border-2 bg-[#fff8e1]/80 text-[#5d4037] border-[#d7ccc8] hover:bg-[#d7ccc8]/50 hover:scale-105 active:scale-95`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL / POP-UP (Sekarang HANYA untuk Daftar Kelas) */}
      {isModalOpen && !searchTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-[#efebe9] w-full max-w-md rounded-3xl shadow-2xl border-4 border-[#a1887f] overflow-hidden flex flex-col animate-scale-up"
            style={{ maxHeight: "80vh" }}>
            <div className="bg-[#8d6e63] p-4 flex justify-between items-center text-[#fff8e1] shrink-0 border-b-4 border-[#5d4037]">
              <h3 className="font-black text-lg tracking-wider">
                {`Daftar Kelas ${selectedClass}`}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                }}
                className="bg-[#5d4037] hover:bg-[#3e2723] rounded-full w-8 h-8 flex items-center justify-center font-black transition-colors">
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-[#efebe9] space-y-3">
              {loading ? (
                <div className="text-center text-[#8d6e63] font-bold text-sm py-10 animate-pulse">
                  Memproses Tiket...
                </div>
              ) : filteredParticipants.length > 0 ? (
                filteredParticipants.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleStudentClick(p)}
                    className="w-full text-left p-4 bg-white hover:bg-[#fff8e1] border-2 border-[#d7ccc8] hover:border-[#8d6e63] rounded-2xl transition-all shadow-sm group relative overflow-hidden active:scale-[0.98]">
                    <div className="font-black text-[#3e2723] group-hover:text-[#5d4037] text-sm md:text-base truncate relative z-10">
                      {p.child_name}
                    </div>
                    <div className="flex justify-between items-center mt-2 relative z-10">
                      <span className="text-xs font-bold text-[#8d6e63]">
                        &quot;{p.child_nickname}&quot;
                      </span>
                      <span className="text-[10px] bg-[#d7ccc8] px-2 py-1 rounded-md font-black text-[#5d4037]">
                        {p.child_class}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center text-[#8d6e63] font-bold text-sm py-10 bg-white rounded-2xl border border-[#d7ccc8]">
                  Tidak ada data yang cocok.
                </div>
              )}
            </div>

            <div className="bg-[#d7ccc8] p-3 text-center text-[10px] font-black text-[#5d4037] uppercase tracking-widest shrink-0">
              Klik Nama Untuk Cetak Tiket
            </div>
          </div>
        </div>
      )}
    </>
  );
};
