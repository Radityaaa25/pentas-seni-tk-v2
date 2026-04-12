"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Seat, RegistrationData, GroupedParticipant } from '@/types';
import { Toast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SeatMapEditor } from '@/components/admin/SeatMapEditor';
import { ParticipantsTable } from '@/components/admin/ParticipantsTable';
import { AddParticipantModal } from '@/components/admin/AddParticipantModal';
import { EditParticipantModal } from '@/components/admin/EditParticipantModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'participants'>('map');
  const [searchTerm, setSearchTerm] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  
  const [editData, setEditData] = useState<{ id: string; name: string; class: string } | null>(null);
  const [addData, setAddData] = useState<{ name: string; class: string }>({ name: '', class: 'KB B1' });

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, regId: string | null }>({ isOpen: false, regId: null });
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const fetchSeats = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('seats')
      .select(`*, registrations (id, child_name, child_class)`)
      .order('row_name', { ascending: true })
      .order('seat_number', { ascending: true });
    
    if (data) {
      const formattedData = data.map((item) => {
        const reg = Array.isArray(item.registrations) ? item.registrations[0] : item.registrations;
        return { ...item, registrations: reg as RegistrationData | null };
      });
      setSeats(formattedData as Seat[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchSeats();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent, pin: string) => {
    e.preventDefault();
    const secretPin = process.env.NEXT_PUBLIC_ADMIN_PIN;
    if (pin === secretPin) {
      setIsAuthenticated(true);
      showToast("Selamat Datang, Admin!", "success");
    } else {
      showToast("PIN Salah! Coba lagi.", "error");
    }
  };

  const toggleBlock = async (seat: Seat) => {
    if (seat.is_occupied) {
      showToast("Kursi ini terisi! Hapus data siswanya dulu.", "error");
      return;
    }
    const newStatus = !seat.is_blocked;
    setSeats(seats.map(s => s.id === seat.id ? { ...s, is_blocked: newStatus } : s));
    const { error } = await supabase.from('seats').update({ is_blocked: newStatus }).eq('id', seat.id);
    if (error) {
        showToast("Gagal update status kursi", "error");
        fetchSeats();
    }
  };

  const executeDelete = async () => {
    if (!deleteModal.regId) return;
    try {
      await supabase.from('seats').update({ is_occupied: false, assigned_to: null }).eq('assigned_to', deleteModal.regId);
      await supabase.from('registrations').delete().eq('id', deleteModal.regId);
      
      showToast("Data dihapus & Kursi kosong!", "success");
      setDeleteModal({ isOpen: false, regId: null });
      fetchSeats(); 
    } catch (error) {
      console.error(error);
      showToast("Gagal menghapus data.", "error");
    }
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ child_name: editData.name, child_class: editData.class })
        .eq('id', editData.id);

      if (error) throw error;
      showToast("Data siswa diperbarui!", "success");
      setIsEditModalOpen(false);
      fetchSeats(); 
    } catch (err) {
      console.error(err);
      showToast("Gagal update data.", "error");
    }
  };

  const handleManualAdd = async () => {
    if (!addData.name) {
      showToast("Nama siswa wajib diisi!", "error");
      return;
    }

    try {
      const { data: existingUsers } = await supabase
        .from('registrations')
        .select('id')
        .ilike('child_name', addData.name)
        .eq('child_class', addData.class)
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        showToast("Siswa ini sudah terdaftar!", "error");
        return;
      }

      const { data: availableSeats } = await supabase
        .from('seats')
        .select('id')
        .eq('is_occupied', false)
        .eq('is_blocked', false)
        .gte('row_name', 'D') 
        .order('row_name', { ascending: true })
        .order('seat_number', { ascending: true })
        .limit(2);

      if (!availableSeats || availableSeats.length < 2) {
        showToast("Kursi penuh! Tidak bisa tambah.", "error");
        return;
      }

      const { data: newRegArray, error: regError } = await supabase
        .from('registrations')
        .insert([{ parent_name: 'Admin Manual', child_name: addData.name, child_class: addData.class }])
        .select();

      if (regError) throw regError;
      if (!newRegArray || newRegArray.length === 0) throw new Error("Gagal insert data.");

      const registration = newRegArray[0];
      const seatIds = availableSeats.map(s => s.id);
      await supabase.from('seats').update({ is_occupied: true, assigned_to: registration.id }).in('id', seatIds);

      showToast("Peserta berhasil ditambahkan!", "success");
      setIsAddModalOpen(false);
      setAddData({ name: '', class: 'KB B1' }); 
      fetchSeats();

    } catch (error) {
      console.error(error);
      showToast("Terjadi kesalahan sistem.", "error");
    }
  };

  const occupiedSeats = seats.filter(s => s.is_occupied && s.registrations);
  const mapReg = new Map<string, GroupedParticipant>();

  occupiedSeats.forEach(seat => {
    if (!seat.registrations) return;
    const regId = seat.registrations.id;
    const seatLabel = `${seat.row_name}-${seat.seat_number}`;

    if (!mapReg.has(regId)) {
      mapReg.set(regId, {
        regId: regId,
        childName: seat.registrations.child_name,
        childClass: seat.registrations.child_class,
        seatNumbers: []
      });
    }
    mapReg.get(regId)?.seatNumbers.push(seatLabel);
  });

  const allGroupedList = Array.from(mapReg.values());
  const filteredParticipants = allGroupedList.filter(p => 
    p.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.seatNumbers.join('').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <>
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
        <AdminLogin onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#efebe9] flex font-sans text-[#3e2723]">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Hapus Data Peserta?"
        message="Hati-hati! Data akan hilang permanen dan kursi akan dikosongkan."
        onConfirm={executeDelete}
        onCancel={() => setDeleteModal({ isOpen: false, regId: null })}
      />

      <AdminSidebar activeView={activeView} setActiveView={setActiveView} onLogout={() => setIsAuthenticated(false)} />

      <main className="flex-1 md:ml-72 p-8 overflow-hidden">
        <div className="md:hidden mb-6 flex justify-between items-center bg-[#fff8e1] p-4 rounded-2xl shadow-md border border-[#d7ccc8]">
          <h1 className="text-xl font-black text-[#3e2723]">Admin Panel</h1>
          <div className="flex gap-2">
             <button onClick={() => setActiveView('map')} className={`p-2 rounded-lg text-xs font-black ${activeView === 'map' ? 'bg-[#5d4037] text-white' : 'bg-[#d7ccc8] text-[#5d4037]'}`}>Peta</button>
             <button onClick={() => setActiveView('participants')} className={`p-2 rounded-lg text-xs font-black ${activeView === 'participants' ? 'bg-[#5d4037] text-white' : 'bg-[#d7ccc8] text-[#5d4037]'}`}>Data</button>
          </div>
        </div>

        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-black text-[#3e2723] tracking-tight" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.5)' }}>
                {activeView === 'map' ? 'Denah Kursi 🏟️' : 'Data Peserta 🧑‍🎓'}
              </h1>
            </div>
            <p className="text-[#5d4037] font-bold">
              {activeView === 'map' ? 'Klik kursi putih untuk memblokir (rusak/jalur).' : `Total: ${allGroupedList.length} Pendaftar (${occupiedSeats.length} Kursi Terisi)`}
            </p>
          </div>
          
          {activeView === 'participants' && (
             <div className="flex gap-3 w-full md:w-auto">
                <div className="bg-[#fff8e1] px-4 py-3 rounded-2xl border-2 border-[#d7ccc8] shadow-sm flex items-center gap-3 w-full">
                    <span className="text-[#8d6e63] font-bold">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Cari Nama..." 
                      className="outline-none text-sm font-bold w-full text-[#3e2723] bg-transparent placeholder-[#bcaaa4]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-green-700 hover:bg-green-800 text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-green-700/30 whitespace-nowrap flex items-center gap-2 transition-transform active:scale-95"
                >Tambah</button>
                <button 
                  onClick={() => { fetchSeats(); showToast("Data berhasil direfresh!", "success"); }}
                  className="bg-[#5d4037] hover:bg-[#3e2723] text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-[#3e2723]/30 whitespace-nowrap flex items-center gap-2 transition-transform active:scale-95"
                >Refresh</button>
             </div>
          )}
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#8d6e63]">
              <div className="w-12 h-12 border-4 border-[#5d4037] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-black text-lg">Memuat Data...</p>
          </div>
        ) : (
          <>
            {activeView === 'map' && <SeatMapEditor seats={seats} toggleBlock={toggleBlock} />}
            {activeView === 'participants' && (
              <ParticipantsTable 
                filteredParticipants={filteredParticipants} 
                onEdit={(id, name, cls) => { setEditData({ id, name, class: cls }); setIsEditModalOpen(true); }}
                onDelete={(id) => setDeleteModal({ isOpen: true, regId: id })}
              />
            )}
          </>
        )}
      </main>

      <AddParticipantModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} addData={addData} setAddData={setAddData} onAdd={handleManualAdd} />
      
      <EditParticipantModal isOpen={isEditModalOpen} editData={editData} setEditData={setEditData} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveEdit} />
    </div>
  );
}