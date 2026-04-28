"use client";

import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AdminSidebar } from "@/components/AdminSidebar";
import { BiometricScanner } from "@/components/BiometricScanner";
type RoomState = "vacant" | "occupied" | "cleaning" | "maintenance";

type Room = {
  id: string;
  num: string;
  state: RoomState;
  guestName?: string;
  guestId?: string;
  floor: number;
  type: string;
};

type BookingForm = {
  guestName: string;
  email: string;
  idNumber: string;
  age: string;
  contactNumber: string;
  address: string;
  nights: string;
  password?: string;
  photoUrl?: string;
};

type BookingResult = {
  id: string;
  name: string;
  roomNumber: string;
  loginToken: string;
  loginId: string;
  password: string;
  email: string;
  qrPayload: string;
  idNumber: string | null;
  contact: string | null;
  address: string | null;
  checkOut: string | null;
};

const DEFAULT_FORM: BookingForm = {
  guestName: "",
  email: "",
  idNumber: "",
  age: "",
  contactNumber: "",
  address: "",
  nights: "1",
  password: "",
  photoUrl: "",
};

function getStatusColor(state: RoomState) {
  switch (state) {
    case "vacant":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "occupied":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "cleaning":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "maintenance":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  }
}

export default function AdminRooms() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyRoomId, setBusyRoomId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>(DEFAULT_FORM);
  const [showBiometricScanner, setShowBiometricScanner] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  const floors = useMemo(
    () => [...new Set(rooms.map((room) => room.floor))].sort((left, right) => left - right),
    [rooms]
  );
  const floorRooms = rooms.filter((room) => room.floor === selectedFloor);
  const vacantCount = floorRooms.filter((room) => room.state === "vacant").length;
  const occupiedCount = floorRooms.filter((room) => room.state === "occupied").length;

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const res = await fetch(`/api/admin/rooms?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setRooms([]);
        setErrorMessage(data.error || "Failed to load room allocation.");
        return;
      }

      const nextRooms = (data.rooms || []) as Room[];
      setRooms(nextRooms);

      if (nextRooms.length > 0) {
        const nextFloors = [...new Set(nextRooms.map((room) => room.floor))].sort(
          (left, right) => left - right
        );
        setSelectedFloor((currentFloor) =>
          nextFloors.includes(currentFloor) ? currentFloor : nextFloors[0]
        );

        if (selectedRoom) {
          const latestSelection =
            nextRooms.find((room) => room.id === selectedRoom.id) ?? null;
          setSelectedRoom(latestSelection);
        }
      } else {
        setSelectedRoom(null);
      }
    } catch (error) {
      console.error("Failed to load rooms:", error);
      setRooms([]);
      setErrorMessage("Failed to load room allocation.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRooms();
  }, []);

  const resetBookingForm = () => {
    setBookingForm(DEFAULT_FORM);
    setIsAssigning(false);
  };

  const updateRoomStatus = async (roomId: string, status: RoomState) => {
    try {
      setBusyRoomId(roomId);
      setFeedback(null);
      setErrorMessage(null);

      const res = await fetch("/api/admin/rooms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateStatus",
          roomId,
          status,
        }),
      });

      // OPTIMISTIC UPDATE: Update local status immediately
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, state: status } : r));

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to update room status.");
        return;
      }

      setFeedback("Room status updated.");
      await fetchRooms();
    } catch (error) {
      console.error("Failed to update room status:", error);
      setErrorMessage("Failed to update room status.");
    } finally {
      setBusyRoomId(null);
    }
  };

  const assignGuest = async () => {
    if (!selectedRoom) return;

    try {
      setIsAssigning(true);
      setErrorMessage(null);
      setFeedback(null);

      const res = await fetch("/api/admin/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          roomNumber: selectedRoom.num,
          guestName: bookingForm.guestName,
          email: bookingForm.email,
          idNumber: bookingForm.idNumber,
          age: bookingForm.age ? parseInt(bookingForm.age) : undefined,
          contactNumber: bookingForm.contactNumber,
          address: bookingForm.address,
          nights: bookingForm.nights,
          password: bookingForm.password || undefined,
          photoUrl: bookingForm.photoUrl || undefined,
        }),
      });

      // OPTIMISTIC UPDATE: Set room to occupied instantly
      setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...r, state: "occupied", guestName: bookingForm.guestName } : r));

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.details || data.error || "Failed to create booking.");
        return;
      }

      const nextBooking = data.booking as BookingResult;
      const qrValue = nextBooking.qrPayload || JSON.stringify({
        type: "aegis-guest-access",
        token: nextBooking.loginToken,
        loginId: nextBooking.loginId,
        password: nextBooking.password,
        email: nextBooking.email,
        guestName: nextBooking.name,
        roomNumber: nextBooking.roomNumber,
        idNumber: nextBooking.idNumber,
        contact: nextBooking.contact,
        address: nextBooking.address,
      });
      const qrDataUrl = await QRCode.toDataURL(qrValue, {
        errorCorrectionLevel: "H",
        margin: 1,
        color: { dark: "#0A1020", light: "#FFFFFF" },
        width: 240,
      });

      setQrCodeUrl(qrDataUrl);
      setBookingResult(nextBooking);
      setShowAssignModal(false);
      setShowSuccessModal(true);
      resetBookingForm();
      setFeedback("Guest allocated and credentials generated.");
      await fetchRooms();
    } catch (error) {
      console.error("Failed to assign guest:", error);
      setErrorMessage("Failed to assign guest.");
    } finally {
      setIsAssigning(false);
    }
  };

  const printGuestPass = () => {
    if (!bookingResult || !qrCodeUrl) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Guest Access - ${bookingResult.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
            .title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
            .meta { color: #16a34a; font-size: 14px; margin-bottom: 20px; }
            .qr-wrapper { text-align: center; margin: 24px 0; }
            .card { background: #f3f4f6; padding: 20px; border-radius: 12px; margin-top: 20px; }
            .row { margin-bottom: 12px; }
            .label { font-size: 11px; text-transform: uppercase; color: #6b7280; }
            .value { font-size: 15px; font-weight: 700; margin-top: 4px; word-break: break-word; }
          </style>
        </head>
        <body>
          <div class="title">Guest Access Provisioned</div>
          <div class="meta">Room ${bookingResult.roomNumber} | Booking ${bookingResult.id}</div>
          <div class="qr-wrapper">
            <img src="${qrCodeUrl}" alt="Guest QR Code" width="220" height="220" />
          </div>
          <div class="card">
            <div class="row"><div class="label">Guest Name</div><div class="value">${bookingResult.name}</div></div>
            <div class="row"><div class="label">Guest Email / Login ID</div><div class="value">${bookingResult.loginId}</div></div>
            <div class="row"><div class="label">Guest Password</div><div class="value">${bookingResult.password}</div></div>
            <div class="row"><div class="label">ID Number</div><div class="value">${bookingResult.idNumber ?? "-"}</div></div>
            <div class="row"><div class="label">Contact</div><div class="value">${bookingResult.contact ?? "-"}</div></div>
            <div class="row"><div class="label">Address</div><div class="value">${bookingResult.address ?? "-"}</div></div>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-[#fafafa] dark:bg-[#0a0a0a] text-[#09090b] dark:text-[#e5e2e1] min-h-screen flex flex-col font-['Sora']">
      <DashboardHeader
        title="Room Allocation"
        userName="Administrator"
        role="Director of Operations"
        onMenuClick={() => setSidebarMobileOpen(!sidebarMobileOpen)}
      />

      <div className="flex flex-1 overflow-hidden pt-16">
        <AdminSidebar
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          sidebarMobileOpen={sidebarMobileOpen}
          setSidebarMobileOpen={setSidebarMobileOpen}
        />

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Room Allocation</h1>
                <p className="text-sm text-[#71717a] dark:text-[#a1a1aa] mt-1">
                  Assign guests with real DB-backed credentials, QR access, and saved personal details.
                </p>
              </div>
              <Link
                href="/admin/manage-rooms"
                className="inline-flex items-center gap-2 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#0f0f0f] px-4 py-2 text-sm font-medium hover:bg-[#f4f4f5] dark:hover:bg-[#18181b] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">settings</span>
                Manage Rooms
              </Link>
            </div>

            {feedback && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300">
                {feedback}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-[#0f0f0f] border border-[#e4e4e7] dark:border-[#27272a] rounded-xl p-4">
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider">Total Rooms</p>
                <p className="text-2xl font-semibold mt-2">{rooms.length}</p>
              </div>
              <div className="bg-white dark:bg-[#0f0f0f] border border-[#e4e4e7] dark:border-[#27272a] rounded-xl p-4">
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider">Vacant</p>
                <p className="text-2xl font-semibold mt-2 text-green-600 dark:text-green-400">{vacantCount}</p>
              </div>
              <div className="bg-white dark:bg-[#0f0f0f] border border-[#e4e4e7] dark:border-[#27272a] rounded-xl p-4">
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider">Occupied</p>
                <p className="text-2xl font-semibold mt-2 text-red-600 dark:text-red-400">{occupiedCount}</p>
              </div>
              <div className="bg-white dark:bg-[#0f0f0f] border border-[#e4e4e7] dark:border-[#27272a] rounded-xl p-4">
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wider">Current Floor</p>
                <p className="text-2xl font-semibold mt-2">{selectedFloor}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-6">
              <div className="bg-white dark:bg-[#0f0f0f] border border-[#e4e4e7] dark:border-[#27272a] rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-4">Floors</h3>
                <div className="space-y-2">
                  {floors.map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setSelectedFloor(floor)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedFloor === floor ? "bg-[#175ead] text-white" : "hover:bg-[#f4f4f5] dark:hover:bg-[#18181b]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Floor {floor}</span>
                        <span className="text-xs opacity-75">
                          {rooms.filter((room) => room.floor === floor).length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#0f0f0f] border border-[#e4e4e7] dark:border-[#27272a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Floor {selectedFloor} Rooms</h3>
                  <button
                    onClick={() => void fetchRooms()}
                    className="rounded-lg border border-[#e4e4e7] dark:border-[#27272a] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#fafafa] dark:hover:bg-[#18181b] transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                {isLoading ? (
                  <div className="text-center py-12 text-[#71717a] dark:text-[#a1a1aa]">Loading...</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {floorRooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedRoom?.id === room.id
                            ? "border-[#175ead] bg-[#175ead]/5"
                            : `border-transparent ${getStatusColor(room.state)}`
                        }`}
                      >
                        <div className="text-2xl font-bold mb-1">{room.num}</div>
                        <div className="text-xs uppercase tracking-wider opacity-75">{room.state}</div>
                        {room.guestName && (
                          <div className="text-xs mt-2 truncate font-medium">{room.guestName}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-[#0f0f0f] border border-[#e4e4e7] dark:border-[#27272a] rounded-xl p-4">
                {selectedRoom ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Room {selectedRoom.num}</h3>
                      <p className="text-sm text-[#71717a] dark:text-[#a1a1aa]">{selectedRoom.type}</p>
                    </div>
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedRoom.state)}`}>
                      {selectedRoom.state.toUpperCase()}
                    </div>
                    {selectedRoom.guestName && (
                      <div className="p-3 bg-[#f4f4f5] dark:bg-[#18181b] rounded-lg">
                        <p className="text-xs text-[#71717a] dark:text-[#a1a1aa]">Guest</p>
                        <p className="font-medium mt-1">{selectedRoom.guestName}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa]">Actions</p>
                      {selectedRoom.state === "vacant" && (
                        <button
                          onClick={() => {
                            resetBookingForm();
                            setShowAssignModal(true);
                          }}
                          className="w-full px-4 py-2 bg-[#175ead] text-white rounded-lg text-sm font-medium hover:bg-[#175ead]/90 transition-colors"
                        >
                          Allocate Guest
                        </button>
                      )}
                      {selectedRoom.state === "occupied" && (
                        <button
                          onClick={() => void updateRoomStatus(selectedRoom.id, "cleaning")}
                          disabled={busyRoomId === selectedRoom.id}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                          Check Out
                        </button>
                      )}
                      {selectedRoom.state === "cleaning" && (
                        <button
                          onClick={() => void updateRoomStatus(selectedRoom.id, "vacant")}
                          disabled={busyRoomId === selectedRoom.id}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
                        >
                          Mark Clean
                        </button>
                      )}
                      {selectedRoom.state !== "maintenance" && (
                        <button
                          onClick={() => void updateRoomStatus(selectedRoom.id, "maintenance")}
                          disabled={busyRoomId === selectedRoom.id}
                          className="w-full px-4 py-2 border border-[#e4e4e7] dark:border-[#27272a] rounded-lg text-sm font-medium hover:bg-[#f4f4f5] dark:hover:bg-[#18181b] transition-colors disabled:opacity-60"
                        >
                          Maintenance
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#71717a] dark:text-[#a1a1aa] text-sm">
                    Select a room to allocate a guest or manage room state.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {showAssignModal && selectedRoom && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-white dark:bg-[#0f0f0f] border border-[#e4e4e7] dark:border-[#27272a] shadow-2xl relative">
            <div className="flex items-start justify-between p-6 border-b border-[#e4e4e7] dark:border-[#27272a] bg-gradient-to-r from-white to-[#fafafa] dark:from-[#0f0f0f] dark:to-[#111111]">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Allocate Guest to Room {selectedRoom.num}</h3>
                <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] mt-1">Fill in guest details. Login credentials and QR access will be auto-generated.</p>
              </div>
              <button onClick={() => { setShowAssignModal(false); resetBookingForm(); }} className="rounded-full border border-[#e4e4e7] dark:border-[#27272a] p-2 text-[#71717a] hover:bg-[#f4f4f5] dark:hover:bg-[#1a1a1a] hover:text-[#09090b] dark:hover:text-white transition-all duration-200">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); void assignGuest(); }} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name *", key: "guestName", placeholder: "Guest full name", type: "text", required: true },
                  { label: "Email *", key: "email", placeholder: "guest@example.com", type: "email", required: true },
                  { label: "Govt. ID Number *", key: "idNumber", placeholder: "Passport / Aadhaar / Driving License", type: "text", required: true },
                  { label: "Age", key: "age", placeholder: "Guest age", type: "number", required: false },
                  { label: "Phone Number", key: "contactNumber", placeholder: "+91 98765 43210", type: "text", required: false },
                  { label: "Stay Duration (nights) *", key: "nights", placeholder: "1", type: "number", required: true },
                  { label: "Portal Password (Optional)", key: "password", placeholder: "Leave blank to auto-generate", type: "text", required: false },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.24em]">{field.label}</label>
                    <input
                      required={field.required} type={field.type}
                      value={bookingForm[field.key as keyof typeof bookingForm]}
                      onChange={e => setBookingForm(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      min={field.type === "number" ? "1" : undefined}
                      className="mt-2 w-full rounded-xl bg-[#fafafa] dark:bg-[#1a1a1a] border border-transparent focus:border-[#09090b] dark:focus:border-white px-4 py-3 text-sm outline-none transition-all duration-200 hover:bg-white dark:hover:bg-[#222]"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.24em]">Guest Biometrics / Face Scan</label>
                <div className="mt-3 flex items-center gap-4">
                  <div 
                    className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#1a1a1a] overflow-hidden flex items-center justify-center shrink-0"
                    style={bookingForm.photoUrl ? { backgroundImage: `url(${bookingForm.photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderStyle: 'solid' } : {}}
                  >
                    {!bookingForm.photoUrl && <span className="material-symbols-outlined text-[#a1a1aa] text-3xl">face</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBiometricScanner(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-600/10 text-violet-700 dark:text-violet-400 border border-violet-600/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-violet-600/20 transition-all font-mono"
                    >
                      <span className="material-symbols-outlined text-sm">fluid_meditaion</span>
                      Initialize Biometric Scan
                    </button>
                    <p className="text-[9px] text-[#71717a] dark:text-[#a1a1aa] italic">Scanning is mandatory for the "Eye of Aegis" security protocol.</p>
                  </div>
                </div>
              </div>

              {showBiometricScanner && (
                <BiometricScanner 
                  title="Guest Biometric Enrollment"
                  onCapture={(dataUrl) => setBookingForm(f => ({ ...f, photoUrl: dataUrl }))}
                  onClose={() => setShowBiometricScanner(false)}
                />
              )}
              
              <div>
                <label className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.24em]">Address</label>
                <textarea 
                  value={bookingForm.address} 
                  onChange={e => setBookingForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Guest home address" 
                  rows={2}
                  className="mt-2 w-full rounded-xl bg-[#fafafa] dark:bg-[#1a1a1a] border border-transparent focus:border-[#09090b] dark:focus:border-white px-4 py-3 text-sm outline-none transition-all duration-200 resize-none hover:bg-white dark:hover:bg-[#222]" 
                />
              </div>

              <div className="rounded-xl border border-dashed border-[#e4e4e7] dark:border-[#27272a] bg-gradient-to-r from-[#fafafa] to-white dark:from-[#111111] dark:to-[#0f0f0f] p-4 text-xs text-[#71717a] dark:text-[#a1a1aa] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] mt-0.5 text-[#a1a1aa]">info</span>
                A unique login ID and password will be auto-generated for the guest portal.
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isAssigning}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#09090b] to-[#1a1a1a] dark:from-white dark:to-slate-100 text-white dark:text-[#09090b] font-bold py-3 text-xs uppercase tracking-[0.2em] disabled:opacity-60 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5 transition-all duration-200">
                  {isAssigning ? "Allocating..." : "Save Booking & Generate QR"}
                </button>
                <button type="button" onClick={() => { setShowAssignModal(false); resetBookingForm(); }}
                  className="rounded-xl border border-[#e4e4e7] dark:border-[#27272a] px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#fafafa] dark:hover:bg-[#18181b] transition-all duration-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && bookingResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-[#0a1628] to-[#050d1a] rounded-2xl max-w-md w-full p-8 border border-green-500/20">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-green-400">check_circle</span>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center text-white mb-2">Guest Access Ready</h3>
            <p className="text-center text-green-400 text-sm mb-6">
              Room {bookingResult.roomNumber} | Booking {bookingResult.id}
            </p>
            <div className="bg-white rounded-xl p-4 mb-6 flex justify-center">
              {qrCodeUrl && (
                <Image
                  src={qrCodeUrl}
                  alt="Guest QR Code"
                  width={240}
                  height={240}
                  className="rounded-lg"
                />
              )}
            </div>
            <div className="space-y-3 mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Guest Name</p>
                <p className="text-white font-semibold">{bookingResult.name}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Guest Email / Login ID</p>
                <p className="text-white font-semibold text-sm break-all">{bookingResult.loginId}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Guest Password</p>
                <p className="text-white font-semibold">{bookingResult.password}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Stored Personal Details</p>
                <p className="text-white text-sm leading-6">
                  Email: {bookingResult.email}<br />
                  ID: {bookingResult.idNumber ?? "-"}<br />
                  Contact: {bookingResult.contact ?? "-"}<br />
                  Address: {bookingResult.address ?? "-"}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={printGuestPass}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">print</span>
                Print Guest Pass
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(bookingResult.qrPayload)}
                className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-white/20"
              >
                <span className="material-symbols-outlined text-lg">content_copy</span>
                Copy QR Payload
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Return to Command Center
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
