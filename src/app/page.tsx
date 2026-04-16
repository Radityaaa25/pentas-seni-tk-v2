"use client";
import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { IntroAnimation } from "@/components/home/IntroAnimation";
import { HeaderSection } from "@/components/home/HeaderSection";
import { MainAuthForm } from "@/components/home/MainAuthForm";
import { SuccessPopup } from "@/components/home/SuccessPopup";
import { BottomIllustration } from "@/components/home/BottomIllustration";
import { HiddenTicket } from "@/components/shared/HiddenTicket";

export default function Home() {
  const ticketRef = useRef<HTMLDivElement>(null);

  const [showIntro, setShowIntro] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [finalSeats, setFinalSeats] = useState<string[]>([]);
  const [regId, setRegId] = useState<string>("");

  const [formData, setFormData] = useState({
    childName: "",
    childClass: "KB B1",
  });

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Fungsi Download Manual (Tidak ada delay, murni dari klik user)
  const downloadTicketAsImage = useCallback(async () => {
    if (!ticketRef.current) return;
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = `GOLDEN TICKET (${formData.childName || "Tiket"}).png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Gagal download:", err);
      alert("Gagal mengunduh tiket. Silakan coba lagi.");
    }
  }, [formData.childName]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/Background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}>
      <div
        className="absolute inset-0 bg-black/10 pointer-events-none"
        style={{ zIndex: -100 }}></div>

      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      {showSuccessPopup && (
        <SuccessPopup
          finalSeats={finalSeats}
          regId={regId}
          onLihatPeta={() => (window.location.href = `/ticket?id=${regId}`)}
          onDownload={downloadTicketAsImage}
        />
      )}

      {/* HiddenTicket DITAMPILKAN TERUS agar Background.png punya waktu untuk loading! */}
      <HiddenTicket
        ref={ticketRef}
        childName={formData.childName || ""}
        childClass={formData.childClass || ""}
        seats={finalSeats.length > 0 ? finalSeats : ["-"]}
        regId={regId || ""}
        baseUrl={baseUrl}
      />

      <HeaderSection isHidden={showIntro} />

      <MainAuthForm
        isHidden={showIntro}
        onSuccess={(seats, id, name, cls) => {
          setFormData({ childName: name, childClass: cls });
          setFinalSeats(seats);
          setRegId(id);
          setShowSuccessPopup(true);
        }}
      />

      <BottomIllustration isHidden={showIntro} />

      <div
        className="fixed bottom-4 text-center w-full text-[#3e2723] text-[10px] font-medium tracking-widest uppercase opacity-80 animate-fade-in-up delay-500 shrink-0"
        style={{ textShadow: "0px 0px 10px rgba(255,255,255,0.8)" }}>
        © 2026 TK Aisyiyah 21 Rawamangun
      </div>
    </div>
  );
}
