"use client";
import { useState } from "react";
import { useAdminData, Participant } from "@/hooks/useAdminData";
import { Toast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SeatMapEditor } from "@/components/admin/SeatMapEditor";
import { ParticipantsTable } from "@/components/admin/ParticipantsTable";
import { AddParticipantModal } from "@/components/admin/AddParticipantModal";
import { EditParticipantModal } from "@/components/admin/EditParticipantModal";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<"map" | "participants">("map");
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editData, setEditData] = useState<{
    id: string;
    name: string;
    class: string;
  } | null>(null);
  const [addData, setAddData] = useState<{ name: string; class: string }>({
    name: "",
    class: "KB B1",
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    regId: string | null;
  }>({ isOpen: false, regId: null });

  const {
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
  } = useAdminData(isAuthenticated);

  const handleLogin = (e: React.FormEvent, pin: string) => {
    e.preventDefault();
    if (pin === process.env.NEXT_PUBLIC_ADMIN_PIN) {
      setIsAuthenticated(true);
      showToast("Selamat Datang!", "success");
    } else {
      showToast("PIN Salah!", "error");
    }
  };

  const filteredData = participants.filter(
    (p: Participant) =>
      p.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.child_nickname &&
        p.child_nickname.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const occupiedSeatsCount = seats.filter((s) => s.is_occupied).length;

  if (!isAuthenticated) {
    return (
      <>
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
        <AdminLogin onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#efebe9] flex font-sans text-[#3e2723]">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Hapus Peserta?"
        message="Aksi ini akan menghapus peserta dan mengosongkan kursi mereka."
        onConfirm={() =>
          executeDelete(deleteModal.regId!, () =>
            setDeleteModal({ isOpen: false, regId: null }),
          )
        }
        onCancel={() => setDeleteModal({ isOpen: false, regId: null })}
      />

      <AdminSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* GARA-GARA GUE NGAPUS "overflow-hidden" DI BAWAH INI SEMUANYA JADI HANCUR. SEKARANG UDAH GUE BALIKIN */}
      <main className="flex-1 md:ml-72 p-8 overflow-hidden">
        <div className="md:hidden mb-6 flex justify-between items-center bg-[#fff8e1] p-4 rounded-2xl shadow-md border border-[#d7ccc8]">
          <h1 className="text-xl font-black text-[#3e2723]">Admin Panel</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("map")}
              className={`p-2 rounded-lg text-xs font-black ${activeView === "map" ? "bg-[#5d4037] text-white" : "bg-[#d7ccc8] text-[#5d4037]"}`}>
              Peta
            </button>
            <button
              onClick={() => setActiveView("participants")}
              className={`p-2 rounded-lg text-xs font-black ${activeView === "participants" ? "bg-[#5d4037] text-white" : "bg-[#d7ccc8] text-[#5d4037]"}`}>
              Data
            </button>
          </div>
        </div>

        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black">
              {activeView === "map" ? "Denah Kursi 🏟️" : "Data Peserta 🧑‍🎓"}
            </h1>
            <p className="text-[#5d4037] font-bold mt-2">
              {activeView === "map"
                ? "Klik kursi putih untuk memblokir (rusak/jalur)."
                : `Total: ${participants.length} Pendaftar (${occupiedSeatsCount} Kursi Terisi)`}
            </p>
          </div>

          {activeView === "participants" && (
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Cari Nama/Panggilan..."
                className="bg-white border-2 border-[#d7ccc8] rounded-xl px-4 py-2 text-sm font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold">
                Tambah
              </button>
              <button
                onClick={() => {
                  fetchData();
                  showToast("Data berhasil direfresh!", "success");
                }}
                className="bg-[#5d4037] text-white px-4 py-2 rounded-xl text-sm font-bold">
                Refresh
              </button>
            </div>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="w-10 h-10 border-4 border-[#5d4037] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeView === "map" ? (
          <SeatMapEditor seats={seats} toggleBlock={toggleBlock} />
        ) : (
          <ParticipantsTable
            filteredParticipants={filteredData}
            onEdit={(id, n, c) => {
              setEditData({ id, name: n, class: c });
              setIsEditModalOpen(true);
            }}
            onDelete={(id) => setDeleteModal({ isOpen: true, regId: id })}
          />
        )}
      </main>

      <AddParticipantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        addData={addData}
        setAddData={setAddData}
        onAdd={() =>
          handleManualAdd(addData, () => {
            setIsAddModalOpen(false);
            setAddData({ name: "", class: "KB B1" });
          })
        }
      />

      <EditParticipantModal
        isOpen={isEditModalOpen}
        editData={editData}
        setEditData={setEditData}
        onClose={() => setIsEditModalOpen(false)}
        onSave={() =>
          handleSaveEdit(editData!, () => setIsEditModalOpen(false))
        }
      />
    </div>
  );
}
