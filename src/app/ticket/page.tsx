"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toPng } from "html-to-image";
import { Seat, RegistrationData } from "@/types";
import { TicketMap } from "@/components/ticket/TicketMap";
import { TicketDetailCard } from "@/components/ticket/TicketDetailCard";
import { HiddenTicket } from "@/components/shared/HiddenTicket";

export default function TicketPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fff8e1] text-[#5d4037] font-bold">
          Sedang Memuat Tiket...
        </div>
      }>
      <TicketContent />
    </Suspense>
  );
}

function TicketContent() {
  const searchParams = useSearchParams();
  const regId = searchParams.get("id");
  const ticketRef = useRef<HTMLDivElement>(null);

  const [mySeats, setMySeats] = useState<Seat[]>([]);
  const [allSeats, setAllSeats] = useState<Seat[]>([]);
  const [studentData, setStudentData] = useState<RegistrationData | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    const fetchData = async () => {
      if (regId) {
        const { data: reg } = await supabase
          .from("registrations")
          .select("*")
          .eq("id", regId)
          .maybeSingle();
        if (reg) setStudentData(reg);

        const { data: mySeat } = await supabase
          .from("seats")
          .select("*")
          .eq("assigned_to", regId)
          .order("row_name")
          .order("seat_number");
        if (mySeat) setMySeats(mySeat);
      }

      const { data: all } = await supabase
        .from("seats")
        .select("*")
        .order("row_name")
        .order("seat_number");
      if (all) setAllSeats(all);
    };
    fetchData();
  }, [regId]);

  const downloadUpdatedTicket = async () => {
    if (!ticketRef.current) return;
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = `GOLDEN TICKET (${studentData?.child_name || "Event"}).png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Gagal download:", err);
    }
  };

  return (
    <div
      className="min-h-screen text-[#3e2723] p-4 md:p-6 pb-40 font-sans relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/Background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}>
      <div className="absolute inset-0 bg-[#3e2723]/5 pointer-events-none"></div>

      {/* HEADER & LEGEND */}
      <div className="text-center mb-8 pt-4 relative z-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fff8e1] text-[#5d4037] rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-[#d7ccc8] shadow-sm">
          <span>📍</span> Denah Lokasi
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#3e2723] tracking-tight drop-shadow-sm">
          TK Aisyiyah 21
        </h1>
        <p className="text-[#5d4037] font-medium text-xs md:text-sm mt-1">
          Rawamangun • Pentas Seni 2026
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6 relative z-10 animate-fade-in-up delay-100">
        <div className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full shadow-sm">
          <div className="w-3 h-3 bg-green-200 border border-green-400 rounded-full"></div>
          <span className="text-[10px] font-bold text-green-800 uppercase">
            VIP (A)
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full shadow-sm">
          <div className="w-3 h-3 bg-pink-200 border border-pink-400 rounded-full"></div>
          <span className="text-[10px] font-bold text-pink-800 uppercase">
            Panitia (B-C)
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full shadow-sm">
          <div className="w-3 h-3 bg-blue-100 border border-blue-400 rounded-full"></div>
          <span className="text-[10px] font-bold text-blue-800 uppercase">
            Umum (D-L)
          </span>
        </div>
      </div>

      <TicketMap allSeats={allSeats} regId={regId} />

      {regId && (
        <TicketDetailCard
          studentData={studentData}
          mySeats={mySeats}
          onDownload={downloadUpdatedTicket}
        />
      )}

      {/* LEGEND BOTTOM */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#fff8e1]/95 backdrop-blur-md px-4 md:px-6 py-3 rounded-full flex items-center gap-4 md:gap-6 border border-[#d7ccc8] shadow-2xl z-50 w-max max-w-[90%] justify-center animate-fade-in-up delay-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#5d4037] rounded-full shadow-sm"></div>
          <span className="text-[10px] font-bold text-[#5d4037] uppercase">
            Kamu
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#d7ccc8] rounded-full"></div>
          <span className="text-[10px] font-bold text-[#a1887f] uppercase">
            Terisi
          </span>
        </div>
      </div>

      {/* HIDDEN TICKET (Untuk Download - Reusable Component) */}
      {regId && studentData && (
        <HiddenTicket
          ref={ticketRef}
          childName={studentData.child_name}
          childClass={studentData.child_class}
          seats={mySeats.map((s) => `${s.row_name}-${s.seat_number}`)}
          regId={regId}
          baseUrl={baseUrl}
        />
      )}
    </div>
  );
}
