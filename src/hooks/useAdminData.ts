import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Seat } from "@/types";

export type Participant = {
  id: string;
  child_name: string;
  child_nickname: string | null;
  child_class: string;
  seatNumbers: string[];
  isPresent: boolean;
};

export const useAdminData = (isAuthenticated: boolean) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ show: true, message, type });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    },
    [],
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: regs, error: regError } = await supabase
        .from("registrations")
        .select("*")
        .order("child_name", { ascending: true });

      // FIX UTAMA: Tambahin urutan saat ngambil data kursi dari database
      const { data: seatData, error: seatError } = await supabase
        .from("seats")
        .select("*")
        .order("row_name", { ascending: true })
        .order("seat_number", { ascending: true });

      if (regError || seatError) throw regError || seatError;

      const formattedParticipants: Participant[] = (regs || []).map((reg) => {
        const assignedSeats =
          seatData?.filter((s) => s.assigned_to === reg.id) || [];
        const seatLabels = assignedSeats.map(
          (s) => `${s.row_name}-${s.seat_number}`,
        );

        return {
          id: reg.id,
          child_name: reg.child_name,
          child_nickname: reg.child_nickname,
          child_class: reg.child_class,
          seatNumbers: seatLabels,
          isPresent: seatLabels.length > 0,
        };
      });

      setParticipants(formattedParticipants);
      setSeats(seatData || []);
    } catch (error) {
      console.error(error);
      showToast("Gagal memuat data terbaru", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(() => {
        fetchData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchData]);

  const toggleBlock = async (seat: Seat) => {
    if (seat.is_occupied) {
      showToast("Kursi ini terisi! Hapus data siswanya dulu.", "error");
      return;
    }
    const newStatus = !seat.is_blocked;
    setSeats(
      seats.map((s) =>
        s.id === seat.id ? { ...s, is_blocked: newStatus } : s,
      ),
    );
    await supabase
      .from("seats")
      .update({ is_blocked: newStatus })
      .eq("id", seat.id);
  };

  const executeDelete = async (regId: string, onSuccess: () => void) => {
    try {
      await supabase
        .from("seats")
        .update({ is_occupied: false, assigned_to: null })
        .eq("assigned_to", regId);
      await supabase.from("registrations").delete().eq("id", regId);
      showToast("Data dihapus & Kursi kosong!", "success");
      fetchData();
      onSuccess();
    } catch (error) {
      showToast("Gagal menghapus data.", "error");
    }
  };

  const handleSaveEdit = async (
    editData: { id: string; name: string; class: string },
    onSuccess: () => void,
  ) => {
    try {
      await supabase
        .from("registrations")
        .update({ child_name: editData.name, child_class: editData.class })
        .eq("id", editData.id);
      showToast("Data diperbarui!", "success");
      fetchData();
      onSuccess();
    } catch (err) {
      showToast("Gagal update data.", "error");
    }
  };

  const handleManualAdd = async (
    addData: { name: string; class: string },
    onSuccess: () => void,
  ) => {
    if (!addData.name) {
      showToast("Nama siswa wajib diisi!", "error");
      return;
    }
    try {
      const { data: existing } = await supabase
        .from("registrations")
        .select("id")
        .ilike("child_name", addData.name)
        .eq("child_class", addData.class)
        .limit(1);
      if (existing && existing.length > 0) {
        showToast("Siswa ini sudah terdaftar!", "error");
        return;
      }

      const { data: availSeats } = await supabase
        .from("seats")
        .select("id")
        .eq("is_occupied", false)
        .eq("is_blocked", false)
        .gte("row_name", "D")
        .order("row_name")
        .order("seat_number")
        .limit(2);
      if (!availSeats || availSeats.length < 2) {
        showToast("Kursi penuh!", "error");
        return;
      }

      const { data: newRegArray } = await supabase
        .from("registrations")
        .insert([
          {
            parent_name: "-",
            child_name: addData.name,
            child_class: addData.class,
          },
        ])
        .select();

      if (newRegArray && newRegArray.length > 0) {
        const seatIds = availSeats.map((s) => s.id);
        await supabase
          .from("seats")
          .update({ is_occupied: true, assigned_to: newRegArray[0].id })
          .in("id", seatIds);
        showToast("Peserta berhasil ditambahkan!", "success");
        fetchData();
        onSuccess();
      }
    } catch (error) {
      showToast("Terjadi kesalahan sistem.", "error");
    }
  };

  return {
    participants,
    seats,
    loading,
    toast,
    setToast,
    showToast,
    fetchData,
    toggleBlock,
    executeDelete,
    handleSaveEdit,
    handleManualAdd,
  };
};
