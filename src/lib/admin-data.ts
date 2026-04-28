export interface GuestLike {
  id: string;
  name: string;
  email: string | null;
  roomId: string | null;
  roomNumber: string | null;
  checkIn: Date;
  checkOut: Date | null;
  status: string;
  loginToken: string | null;
  createdAt: Date;
}

export interface StaffLike {
  id: string;
  name: string;
  email: string | null;
  employeeId?: string | null;
  role: string;
  department: string | null;
  phone?: string | null;
  emergencyContact?: string | null;
  bloodGroup?: string | null;
  joiningDate?: Date | null;
  validTill?: Date | null;
  photoUrl?: string | null;
  status: string;
  loginPassword?: string | null;
  createdAt: Date;
}

export interface IncidentLike {
  id: string;
  title: string;
  severity: string;
  status: string;
  timestamp: Date;
  roomId: string | null;
  description: string | null;
}

export interface RoomGuestLike {
  id: string;
  name: string;
  status: string;
  checkIn: Date;
  checkOut: Date | null;
  createdAt: Date;
}

export interface RoomLike {
  id: string;
  number: string;
  floor: number;
  type: string;
  status: string;
  guests?: RoomGuestLike[];
}

export interface AdminNotification {
  id: string;
  type: "info" | "warning" | "success" | "alert";
  title: string;
  message: string;
  time: string;
}

export interface AdminGuestView {
  id: string;
  name: string;
  email: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: string;
  loginToken: string;
}

export interface AdminStaffView {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: string;
  department: string;
  phone: string;
  emergencyContact: string;
  bloodGroup: string;
  joiningDate: string;
  validTill: string;
  photoUrl: string;
  sector: string;
  shift: string;
  st: string;
  loginEmail?: string;
  loginPassword?: string;
}

export interface AdminIncidentView {
  id: string;
  title: string;
  type: string;
  description: string;
  severity: string;
  status: string;
  timestamp: string;
  guestId: string;
  roomId: string | null;
  timeAgo: string;
}

export interface AdminRoomView {
  id: string;
  num: string;
  state: "vacant" | "occupied" | "cleaning" | "maintenance";
  floor: number;
  type: string;
  guestName?: string;
  guestId?: string;
  guestStatus?: string;
}

export interface PendingGuestView {
  id: string;
  name: string;
  type: string;
  nights: number;
}

export interface DashboardSeedData {
  guests: GuestLike[];
  staff: StaffLike[];
  incidents: IncidentLike[];
  rooms: RoomLike[];
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export function toDisplayStatus(value?: string | null): string {
  if (!value) return "Unknown";
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(capitalize)
    .join(" ");
}

export function formatRelativeTime(value?: string | Date | null): string {
  if (!value) return "Just now";

  const date = value instanceof Date ? value : new Date(value);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function getGuestStatus(guest: GuestLike): string {
  if (guest.roomId) return "In Room";
  const checkOutDate = guest.checkOut ? (guest.checkOut instanceof Date ? guest.checkOut : new Date(guest.checkOut)) : null;
  if (checkOutDate && checkOutDate.getTime() < Date.now()) return "Checked Out";

  const normalizedStatus = guest.status?.toLowerCase();
  if (normalizedStatus === "active") return "In Room";
  if (normalizedStatus === "booked") return "Booked";

  return toDisplayStatus(guest.status);
}

function getGuestType(guest: GuestLike): string {
  if (guest.roomNumber?.toUpperCase().startsWith("PH")) return "VIP";

  const nights = getGuestNights(guest);
  if (nights >= 5) return "Corporate";

  return "Standard";
}

function getGuestNights(guest: Pick<GuestLike, "checkIn" | "checkOut">): number {
  if (!guest.checkOut) return 1;

  const checkInDate = guest.checkIn instanceof Date ? guest.checkIn : new Date(guest.checkIn);
  const checkOutDate = guest.checkOut instanceof Date ? guest.checkOut : new Date(guest.checkOut);
  const diff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.max(1, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

export function mapGuestForAdmin(guest: GuestLike): AdminGuestView {
  return {
    id: guest.id,
    name: guest.name,
    email: guest.email ?? "",
    room: guest.roomNumber ?? "",
    checkIn: guest.checkIn instanceof Date ? guest.checkIn.toISOString() : guest.checkIn,
    checkOut: guest.checkOut ? (guest.checkOut instanceof Date ? guest.checkOut.toISOString() : guest.checkOut) : "",
    status: getGuestStatus(guest),
    loginToken: guest.loginToken ?? "",
  };
}

export function mapPendingGuest(guest: GuestLike): PendingGuestView {
  return {
    id: guest.id,
    name: guest.name,
    type: getGuestType(guest),
    nights: getGuestNights(guest),
  };
}

export function deriveStaffSector(staff: Pick<StaffLike, "department" | "role">): string {
  if (staff.department) return staff.department;

  const role = staff.role.toLowerCase();
  if (role.includes("concierge")) return "Lobby";
  if (role.includes("maintenance")) return "Engineering";
  if (role.includes("housekeeping")) return "Guest Floors";
  if (role.includes("security")) return "Security Grid";
  if (role.includes("admin")) return "Command Center";

  return "General Operations";
}

export function deriveStaffShift(staff: Pick<StaffLike, "role">): string {
  const role = staff.role.toLowerCase();
  if (role.includes("concierge")) return "06:00 - 14:00";
  if (role.includes("maintenance")) return "12:00 - 20:00";
  if (role.includes("housekeeping")) return "08:00 - 16:00";
  if (role.includes("security")) return "18:00 - 06:00";
  if (role.includes("admin")) return "24/7";

  return "09:00 - 17:00";
}

export function mapStaffForAdmin(staff: StaffLike): AdminStaffView {
  return {
    id: staff.id,
    name: staff.name,
    email: staff.email ?? "",
    employeeId: staff.employeeId ?? "",
    role: staff.role,
    department: staff.department ?? "",
    phone: staff.phone ?? "",
    emergencyContact: staff.emergencyContact ?? "",
    bloodGroup: staff.bloodGroup ?? "",
    joiningDate:
      staff.joiningDate instanceof Date ? staff.joiningDate.toISOString() : "",
    validTill:
      staff.validTill instanceof Date ? staff.validTill.toISOString() : "",
    photoUrl: staff.photoUrl ?? "",
    sector: deriveStaffSector(staff),
    shift: deriveStaffShift(staff),
    st: toDisplayStatus(staff.status),
    loginEmail: staff.email ? `${staff.employeeId?.toLowerCase()}@hotel.local` : undefined,
    loginPassword: staff.loginPassword ?? undefined,
  };
}

export function mapIncidentForAdmin(incident: IncidentLike): AdminIncidentView {
  return {
    id: incident.id,
    title: incident.title,
    type: incident.severity,
    description: incident.description ?? incident.title,
    severity: incident.severity,
    status: incident.status,
    timestamp: incident.timestamp instanceof Date ? incident.timestamp.toISOString() : incident.timestamp,
    guestId: incident.roomId ?? "",
    roomId: incident.roomId ?? null,
    timeAgo: formatRelativeTime(incident.timestamp),
  };
}

export function mapRoomForAdmin(room: any): AdminRoomView {
  // Support both generated SDK 'guests_on_room' and internal 'guests'
  const guests = room.guests_on_room || room.guests || [];
  const currentGuest = guests[0];
  
  const allowedStates = new Set(["vacant", "occupied", "cleaning", "maintenance"]);
  const rawStatus = (room.status || "vacant").toLowerCase();
  const state = allowedStates.has(rawStatus) ? rawStatus : "vacant";

  return {
    id: room.id,
    num: room.number,
    state: state as AdminRoomView["state"],
    floor: room.floor,
    type: room.type,
    guestName: currentGuest?.name,
    guestId: currentGuest?.id,
    guestStatus: currentGuest?.status,
  };
}

export function buildDashboardNotifications(params: {
  incidents: IncidentLike[];
  guests: GuestLike[];
  rooms: RoomLike[];
  staff: StaffLike[];
}): AdminNotification[] {
  const notifications: AdminNotification[] = [];
  const activeIncident = params.incidents.find(
    (incident) => incident.status.toLowerCase() !== "resolved"
  );

  if (activeIncident) {
    notifications.push({
      id: `incident-${activeIncident.id}`,
      type: "alert",
      title: activeIncident.title,
      message: activeIncident.description ?? "Active incident requires review.",
      time: formatRelativeTime(activeIncident.timestamp),
    });
  }

  const nextCheckout = [...params.guests]
    .filter((guest) => {
      if (!guest.checkOut) return false;
      const co = guest.checkOut instanceof Date ? guest.checkOut : new Date(guest.checkOut);
      return co.getTime() > Date.now();
    })
    .sort((left, right) => {
      const coLeft = left.checkOut instanceof Date ? left.checkOut : new Date(left.checkOut!);
      const coRight = right.checkOut instanceof Date ? right.checkOut : new Date(right.checkOut!);
      return coLeft.getTime() - coRight.getTime();
    })[0];

  if (nextCheckout) {
    notifications.push({
      id: `guest-${nextCheckout.id}`,
      type: "info",
      title: "Upcoming Check-Out",
      message: `${nextCheckout.name} is scheduled to check out from room ${
        nextCheckout.roomNumber || "unassigned"
      }.`,
      time: formatRelativeTime(nextCheckout.createdAt),
    });
  }

  const vacantRooms = params.rooms.filter((room) => room.status === "vacant").length;
  const occupiedRooms = params.rooms.filter((room) => room.status === "occupied").length;
  const activeStaff = params.staff.filter(
    (staff) => staff.status.toLowerCase() !== "inactive"
  ).length;

  notifications.push({
    id: "system-status",
    type: vacantRooms === 0 ? "warning" : "success",
    title: "System Status",
    message: `${activeStaff} staff active, ${occupiedRooms} rooms occupied, ${vacantRooms} rooms available.`,
    time: "Live",
  });

  return notifications.slice(0, 3);
}

export function formatFloorLabel(floor: number): string {
  const remainder = floor % 10;
  const suffix =
    floor % 100 >= 11 && floor % 100 <= 13
      ? "th"
      : remainder === 1
        ? "st"
        : remainder === 2
          ? "nd"
          : remainder === 3
            ? "rd"
            : "th";

  return `${floor}${suffix} Floor`;
}

export function isDemoRecord(id?: string | null) {
  return Boolean(id?.startsWith("demo-"));
}

export function getDemoSeedData(): DashboardSeedData {
  const now = Date.now();
  const guestInRoomCheckIn = new Date(now - 2 * 24 * 60 * 60 * 1000);
  const guestInRoomCheckout = new Date(now + 2 * 24 * 60 * 60 * 1000);
  const pendingGuestCheckIn = new Date(now);
  const pendingGuestCheckout = new Date(now + 5 * 24 * 60 * 60 * 1000);

  const guests: GuestLike[] = [
    {
      id: "demo-guest-1",
      name: "Marcus Webb",
      email: "marcus.webb@demo.aegis",
      roomId: "demo-room-215",
      roomNumber: "215",
      checkIn: guestInRoomCheckIn,
      checkOut: guestInRoomCheckout,
      status: "active",
      loginToken: "demo-login-marcus-webb",
      createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "demo-guest-2",
      name: "Elena Rodriguez",
      email: "elena.rodriguez@demo.aegis",
      roomId: null,
      roomNumber: null,
      checkIn: pendingGuestCheckIn,
      checkOut: pendingGuestCheckout,
      status: "booked",
      loginToken: "demo-login-elena-rodriguez",
      createdAt: new Date(now - 90 * 60 * 1000),
    },
  ];

  const staff: StaffLike[] = [
    {
      id: "demo-staff-1",
      employeeId: "AEGIS-1025",
      name: "Sarah Vance",
      email: "sarah.vance@demo.aegis",
      role: "Concierge",
      department: "Lobby",
      phone: "+91-9876543201",
      emergencyContact: "+91-9876543210",
      bloodGroup: "B+",
      joiningDate: new Date("2026-03-15T00:00:00.000Z"),
      validTill: new Date("2028-03-31T00:00:00.000Z"),
      photoUrl: "",
      status: "active",
      createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "demo-staff-2",
      employeeId: "AEGIS-1184",
      name: "Julian Ray",
      email: "julian.ray@demo.aegis",
      role: "Maintenance Tech",
      department: "Engineering",
      phone: "+91-9876543202",
      emergencyContact: "+91-9876543210",
      bloodGroup: "O+",
      joiningDate: new Date("2026-02-10T00:00:00.000Z"),
      validTill: new Date("2028-02-28T00:00:00.000Z"),
      photoUrl: "",
      status: "dispatched",
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  const incidents: IncidentLike[] = [
    {
      id: "demo-incident-1",
      title: "Security Alert",
      severity: "Urgent",
      status: "Active",
      timestamp: new Date(now - 10 * 60 * 1000),
      roomId: "215",
      description: "Smoke pattern detected near Server Room B. Manual review pending.",
    },
  ];

  const rooms: RoomLike[] = [
    {
      id: "demo-room-201",
      number: "201",
      floor: 2,
      type: "Deluxe King Suite",
      status: "vacant",
      guests: [],
    },
    {
      id: "demo-room-215",
      number: "215",
      floor: 2,
      type: "Executive Suite",
      status: "occupied",
      guests: [
        {
          id: guests[0].id,
          name: guests[0].name,
          status: guests[0].status,
          checkIn: guests[0].checkIn,
          checkOut: guests[0].checkOut,
          createdAt: guests[0].createdAt,
        },
      ],
    },
    {
      id: "demo-room-220",
      number: "220",
      floor: 2,
      type: "Deluxe Twin",
      status: "maintenance",
      guests: [],
    },
  ];

  return { guests, staff, incidents, rooms };
}

export function getDemoGuestById(id: string) {
  return getDemoSeedData().guests.find((guest) => guest.id === id) ?? null;
}
