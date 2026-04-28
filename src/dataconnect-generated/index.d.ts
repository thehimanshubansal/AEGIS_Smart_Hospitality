import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CameraInsight_Key {
  id: UUIDString;
  __typename?: 'CameraInsight_Key';
}

export interface CreateGuestData {
  guest_insert: Guest_Key;
}

export interface CreateGuestFullData {
  guest_insert: Guest_Key;
}

export interface CreateGuestFullVariables {
  name: string;
  roomNumber?: string | null;
  roomId?: UUIDString | null;
  idNumber?: string | null;
  contact?: string | null;
  address?: string | null;
  status: string;
  checkOut?: TimestampString | null;
  loginToken?: string | null;
  email?: string | null;
  loginEmail?: string | null;
  loginPassword?: string | null;
  firebaseUid?: string | null;
  qrPayload?: string | null;
  photoUrl?: string | null;
}

export interface CreateGuestVariables {
  firebaseUid?: string | null;
  email?: string | null;
  name: string;
  roomNumber?: string | null;
  status: string;
  checkOut: TimestampString;
  photoUrl?: string | null;
}

export interface CreateIncidentData {
  incident_insert: Incident_Key;
}

export interface CreateIncidentVariables {
  title: string;
  severity: string;
  roomId?: string | null;
  description?: string | null;
  status?: string | null;
}

export interface CreateRoomData {
  room_insert: Room_Key;
}

export interface CreateRoomVariables {
  number: string;
  floor: number;
  type: string;
  status: string;
}

export interface CreateSecurityProfileData {
  securityProfile_insert: SecurityProfile_Key;
}

export interface CreateSecurityProfileVariables {
  referenceId: string;
  name: string;
  role: string;
  photoUrl: string;
  facialFeatures?: string | null;
}

export interface CreateStaffData {
  staff_insert: Staff_Key;
}

export interface CreateStaffVariables {
  firebaseUid?: string | null;
  email?: string | null;
  loginPassword?: string | null;
  name: string;
  role: string;
  status: string;
  employeeId?: string | null;
  department?: string | null;
  phone?: string | null;
  emergencyContact?: string | null;
  bloodGroup?: string | null;
  joiningDate?: TimestampString | null;
  validTill?: TimestampString | null;
  photoUrl?: string | null;
}

export interface DeleteGuestData {
  guest_delete?: Guest_Key | null;
}

export interface DeleteGuestVariables {
  id: UUIDString;
}

export interface DeleteIncidentData {
  incident_delete?: Incident_Key | null;
}

export interface DeleteIncidentVariables {
  id: UUIDString;
}

export interface DeleteRoomData {
  room_delete?: Room_Key | null;
}

export interface DeleteRoomVariables {
  id: UUIDString;
}

export interface DeleteStaffData {
  staff_delete?: Staff_Key | null;
}

export interface DeleteStaffVariables {
  id: UUIDString;
}

export interface GetGuestByEmailData {
  guests: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    roomNumber?: string | null;
    status: string;
    checkIn: TimestampString;
    checkOut?: TimestampString | null;
    loginEmail?: string | null;
    loginPassword?: string | null;
    idNumber?: string | null;
    contact?: string | null;
    address?: string | null;
    loginToken?: string | null;
    qrPayload?: string | null;
    firebaseUid?: string | null;
    photoUrl?: string | null;
    createdAt: TimestampString;
  } & Guest_Key)[];
}

export interface GetGuestByEmailVariables {
  email: string;
}

export interface GetGuestByIdData {
  guest?: {
    id: UUIDString;
    name: string;
    email?: string | null;
    roomNumber?: string | null;
    status: string;
    checkIn: TimestampString;
    checkOut?: TimestampString | null;
    firebaseUid?: string | null;
    loginEmail?: string | null;
    loginPassword?: string | null;
    idNumber?: string | null;
    contact?: string | null;
    address?: string | null;
    loginToken?: string | null;
    photoUrl?: string | null;
    qrPayload?: string | null;
    roomId?: UUIDString | null;
    room?: {
      id: UUIDString;
    } & Room_Key;
  } & Guest_Key;
}

export interface GetGuestByIdVariables {
  id: UUIDString;
}

export interface GetGuestByLoginTokenData {
  guests: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    roomNumber?: string | null;
    status: string;
    checkIn: TimestampString;
    checkOut?: TimestampString | null;
    firebaseUid?: string | null;
    loginEmail?: string | null;
    loginPassword?: string | null;
    idNumber?: string | null;
    contact?: string | null;
    address?: string | null;
    photoUrl?: string | null;
    qrPayload?: string | null;
  } & Guest_Key)[];
}

export interface GetGuestByLoginTokenVariables {
  loginToken: string;
}

export interface GetGuestByUidData {
  guests: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    roomNumber?: string | null;
    loginEmail?: string | null;
    loginPassword?: string | null;
    idNumber?: string | null;
    contact?: string | null;
    address?: string | null;
    status: string;
    checkIn: TimestampString;
    checkOut?: TimestampString | null;
    loginToken?: string | null;
    qrPayload?: string | null;
    firebaseUid?: string | null;
    photoUrl?: string | null;
    createdAt: TimestampString;
    room?: {
      id: UUIDString;
      number: string;
      floor: number;
    } & Room_Key;
  } & Guest_Key)[];
}

export interface GetGuestByUidVariables {
  uid: string;
}

export interface GetIncidentByIdData {
  incident?: {
    id: UUIDString;
    title: string;
    severity: string;
    status: string;
    timestamp: TimestampString;
    roomId?: string | null;
    description?: string | null;
  } & Incident_Key;
}

export interface GetIncidentByIdVariables {
  id: UUIDString;
}

export interface GetRoomByIdData {
  room?: {
    id: UUIDString;
    number: string;
    floor: number;
    type: string;
    status: string;
    guests_on_room: ({
      id: UUIDString;
      name: string;
      status: string;
    } & Guest_Key)[];
  } & Room_Key;
}

export interface GetRoomByIdVariables {
  id: UUIDString;
}

export interface GetStaffByEmailData {
  staffs: ({
    id: UUIDString;
    employeeId?: string | null;
    name: string;
    email?: string | null;
    firebaseUid?: string | null;
    role: string;
    department?: string | null;
    phone?: string | null;
    emergencyContact?: string | null;
    bloodGroup?: string | null;
    joiningDate: TimestampString;
    validTill?: TimestampString | null;
    photoUrl?: string | null;
    status: string;
    createdAt: TimestampString;
  } & Staff_Key)[];
}

export interface GetStaffByEmailVariables {
  email: string;
}

export interface GetStaffByEmployeeIdData {
  staffs: ({
    id: UUIDString;
    employeeId?: string | null;
    name: string;
    email?: string | null;
    loginPassword?: string | null;
    role: string;
    department?: string | null;
    phone?: string | null;
    emergencyContact?: string | null;
    bloodGroup?: string | null;
    joiningDate: TimestampString;
    validTill?: TimestampString | null;
    photoUrl?: string | null;
    status: string;
    createdAt: TimestampString;
  } & Staff_Key)[];
}

export interface GetStaffByEmployeeIdVariables {
  employeeId: string;
}

export interface GetStaffByIdData {
  staff?: {
    id: UUIDString;
    employeeId?: string | null;
    name: string;
    email?: string | null;
    firebaseUid?: string | null;
    role: string;
    department?: string | null;
    phone?: string | null;
    emergencyContact?: string | null;
    bloodGroup?: string | null;
    joiningDate: TimestampString;
    validTill?: TimestampString | null;
    photoUrl?: string | null;
    status: string;
    createdAt: TimestampString;
  } & Staff_Key;
}

export interface GetStaffByIdVariables {
  id: UUIDString;
}

export interface GetStaffByUidData {
  staffs: ({
    id: UUIDString;
    employeeId?: string | null;
    name: string;
    email?: string | null;
    firebaseUid?: string | null;
    role: string;
    department?: string | null;
    phone?: string | null;
    emergencyContact?: string | null;
    bloodGroup?: string | null;
    joiningDate: TimestampString;
    validTill?: TimestampString | null;
    photoUrl?: string | null;
    status: string;
    createdAt: TimestampString;
  } & Staff_Key)[];
}

export interface GetStaffByUidVariables {
  uid: string;
}

export interface GetUserLoginByEmailData {
  userLogins: ({
    firebaseUid: string;
    email: string;
    displayName?: string | null;
    role: string;
  } & UserLogin_Key)[];
}

export interface GetUserLoginByEmailVariables {
  email: string;
}

export interface GetUserLoginData {
  userLogin?: {
    firebaseUid: string;
    email: string;
    displayName?: string | null;
    role: string;
    lastLogin: TimestampString;
    createdAt: TimestampString;
  } & UserLogin_Key;
}

export interface GetUserLoginVariables {
  firebaseUid: string;
}

export interface Guest_Key {
  id: UUIDString;
  __typename?: 'Guest_Key';
}

export interface Incident_Key {
  id: UUIDString;
  __typename?: 'Incident_Key';
}

export interface ListActiveIncidentsData {
  incidents: ({
    id: UUIDString;
    title: string;
    severity: string;
    status: string;
    timestamp: TimestampString;
    roomId?: string | null;
    description?: string | null;
  } & Incident_Key)[];
}

export interface ListGuestsData {
  guests: ({
    id: UUIDString;
    name: string;
    email?: string | null;
    roomNumber?: string | null;
    status: string;
    checkIn: TimestampString;
    checkOut?: TimestampString | null;
    loginEmail?: string | null;
    loginPassword?: string | null;
    idNumber?: string | null;
    contact?: string | null;
    address?: string | null;
    loginToken?: string | null;
    qrPayload?: string | null;
    firebaseUid?: string | null;
    photoUrl?: string | null;
    createdAt: TimestampString;
    room?: {
      id: UUIDString;
      number: string;
    } & Room_Key;
  } & Guest_Key)[];
}

export interface ListIncidentsData {
  incidents: ({
    id: UUIDString;
    title: string;
    severity: string;
    status: string;
    timestamp: TimestampString;
    roomId?: string | null;
    description?: string | null;
  } & Incident_Key)[];
}

export interface ListRoomsData {
  rooms: ({
    id: UUIDString;
    number: string;
    floor: number;
    type: string;
    status: string;
    guests_on_room: ({
      id: UUIDString;
      name: string;
      checkIn: TimestampString;
      createdAt: TimestampString;
    } & Guest_Key)[];
  } & Room_Key)[];
}

export interface ListSecurityProfilesData {
  securityProfiles: ({
    id: UUIDString;
    referenceId?: string | null;
    name: string;
    role: string;
    photoUrl: string;
    createdAt: TimestampString;
  } & SecurityProfile_Key)[];
}

export interface ListStaffData {
  staffs: ({
    id: UUIDString;
    employeeId?: string | null;
    name: string;
    email?: string | null;
    loginPassword?: string | null;
    firebaseUid?: string | null;
    role: string;
    department?: string | null;
    phone?: string | null;
    emergencyContact?: string | null;
    bloodGroup?: string | null;
    joiningDate: TimestampString;
    validTill?: TimestampString | null;
    photoUrl?: string | null;
    status: string;
    createdAt: TimestampString;
  } & Staff_Key)[];
}

export interface ListUserLoginsData {
  userLogins: ({
    firebaseUid: string;
    email: string;
    displayName?: string | null;
    role: string;
  } & UserLogin_Key)[];
}

export interface Room_Key {
  id: UUIDString;
  __typename?: 'Room_Key';
}

export interface SecurityProfile_Key {
  id: UUIDString;
  __typename?: 'SecurityProfile_Key';
}

export interface Staff_Key {
  id: UUIDString;
  __typename?: 'Staff_Key';
}

export interface UpdateGuestData {
  guest_update?: Guest_Key | null;
}

export interface UpdateGuestPasswordData {
  guest_update?: Guest_Key | null;
}

export interface UpdateGuestPasswordVariables {
  id: UUIDString;
  loginPassword?: string | null;
}

export interface UpdateGuestVariables {
  id: UUIDString;
  name?: string | null;
  email?: string | null;
  firebaseUid?: string | null;
  status?: string | null;
  roomNumber?: string | null;
  loginToken?: string | null;
  roomId?: UUIDString | null;
  qrPayload?: string | null;
  idNumber?: string | null;
  contact?: string | null;
  address?: string | null;
  checkOut?: TimestampString | null;
  loginEmail?: string | null;
  loginPassword?: string | null;
  photoUrl?: string | null;
}

export interface UpdateIncidentData {
  incident_update?: Incident_Key | null;
}

export interface UpdateIncidentVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateRoomData {
  room_update?: Room_Key | null;
}

export interface UpdateRoomVariables {
  id: UUIDString;
  number?: string | null;
  floor?: number | null;
  type?: string | null;
  status?: string | null;
}

export interface UpdateStaffData {
  staff_update?: Staff_Key | null;
}

export interface UpdateStaffPasswordData {
  staff_update?: Staff_Key | null;
}

export interface UpdateStaffPasswordVariables {
  id: UUIDString;
  loginPassword?: string | null;
}

export interface UpdateStaffVariables {
  id: UUIDString;
  name?: string | null;
  email?: string | null;
  firebaseUid?: string | null;
  role?: string | null;
  department?: string | null;
  status?: string | null;
  phone?: string | null;
  emergencyContact?: string | null;
  bloodGroup?: string | null;
  joiningDate?: TimestampString | null;
  validTill?: TimestampString | null;
  photoUrl?: string | null;
  employeeId?: string | null;
}

export interface UpsertUserLoginData {
  userLogin_upsert: UserLogin_Key;
}

export interface UpsertUserLoginVariables {
  firebaseUid: string;
  email: string;
  displayName?: string | null;
  role: string;
}

export interface UserLogin_Key {
  firebaseUid: string;
  __typename?: 'UserLogin_Key';
}

interface UpsertUserLoginRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserLoginVariables): MutationRef<UpsertUserLoginData, UpsertUserLoginVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserLoginVariables): MutationRef<UpsertUserLoginData, UpsertUserLoginVariables>;
  operationName: string;
}
export const upsertUserLoginRef: UpsertUserLoginRef;

export function upsertUserLogin(vars: UpsertUserLoginVariables): MutationPromise<UpsertUserLoginData, UpsertUserLoginVariables>;
export function upsertUserLogin(dc: DataConnect, vars: UpsertUserLoginVariables): MutationPromise<UpsertUserLoginData, UpsertUserLoginVariables>;

interface CreateGuestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGuestVariables): MutationRef<CreateGuestData, CreateGuestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateGuestVariables): MutationRef<CreateGuestData, CreateGuestVariables>;
  operationName: string;
}
export const createGuestRef: CreateGuestRef;

export function createGuest(vars: CreateGuestVariables): MutationPromise<CreateGuestData, CreateGuestVariables>;
export function createGuest(dc: DataConnect, vars: CreateGuestVariables): MutationPromise<CreateGuestData, CreateGuestVariables>;

interface UpdateGuestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGuestVariables): MutationRef<UpdateGuestData, UpdateGuestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateGuestVariables): MutationRef<UpdateGuestData, UpdateGuestVariables>;
  operationName: string;
}
export const updateGuestRef: UpdateGuestRef;

export function updateGuest(vars: UpdateGuestVariables): MutationPromise<UpdateGuestData, UpdateGuestVariables>;
export function updateGuest(dc: DataConnect, vars: UpdateGuestVariables): MutationPromise<UpdateGuestData, UpdateGuestVariables>;

interface CreateStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStaffVariables): MutationRef<CreateStaffData, CreateStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateStaffVariables): MutationRef<CreateStaffData, CreateStaffVariables>;
  operationName: string;
}
export const createStaffRef: CreateStaffRef;

export function createStaff(vars: CreateStaffVariables): MutationPromise<CreateStaffData, CreateStaffVariables>;
export function createStaff(dc: DataConnect, vars: CreateStaffVariables): MutationPromise<CreateStaffData, CreateStaffVariables>;

interface UpdateStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffVariables): MutationRef<UpdateStaffData, UpdateStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStaffVariables): MutationRef<UpdateStaffData, UpdateStaffVariables>;
  operationName: string;
}
export const updateStaffRef: UpdateStaffRef;

export function updateStaff(vars: UpdateStaffVariables): MutationPromise<UpdateStaffData, UpdateStaffVariables>;
export function updateStaff(dc: DataConnect, vars: UpdateStaffVariables): MutationPromise<UpdateStaffData, UpdateStaffVariables>;

interface CreateIncidentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIncidentVariables): MutationRef<CreateIncidentData, CreateIncidentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateIncidentVariables): MutationRef<CreateIncidentData, CreateIncidentVariables>;
  operationName: string;
}
export const createIncidentRef: CreateIncidentRef;

export function createIncident(vars: CreateIncidentVariables): MutationPromise<CreateIncidentData, CreateIncidentVariables>;
export function createIncident(dc: DataConnect, vars: CreateIncidentVariables): MutationPromise<CreateIncidentData, CreateIncidentVariables>;

interface UpdateIncidentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateIncidentVariables): MutationRef<UpdateIncidentData, UpdateIncidentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateIncidentVariables): MutationRef<UpdateIncidentData, UpdateIncidentVariables>;
  operationName: string;
}
export const updateIncidentRef: UpdateIncidentRef;

export function updateIncident(vars: UpdateIncidentVariables): MutationPromise<UpdateIncidentData, UpdateIncidentVariables>;
export function updateIncident(dc: DataConnect, vars: UpdateIncidentVariables): MutationPromise<UpdateIncidentData, UpdateIncidentVariables>;

interface CreateRoomRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRoomVariables): MutationRef<CreateRoomData, CreateRoomVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateRoomVariables): MutationRef<CreateRoomData, CreateRoomVariables>;
  operationName: string;
}
export const createRoomRef: CreateRoomRef;

export function createRoom(vars: CreateRoomVariables): MutationPromise<CreateRoomData, CreateRoomVariables>;
export function createRoom(dc: DataConnect, vars: CreateRoomVariables): MutationPromise<CreateRoomData, CreateRoomVariables>;

interface UpdateRoomRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRoomVariables): MutationRef<UpdateRoomData, UpdateRoomVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateRoomVariables): MutationRef<UpdateRoomData, UpdateRoomVariables>;
  operationName: string;
}
export const updateRoomRef: UpdateRoomRef;

export function updateRoom(vars: UpdateRoomVariables): MutationPromise<UpdateRoomData, UpdateRoomVariables>;
export function updateRoom(dc: DataConnect, vars: UpdateRoomVariables): MutationPromise<UpdateRoomData, UpdateRoomVariables>;

interface DeleteRoomRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteRoomVariables): MutationRef<DeleteRoomData, DeleteRoomVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteRoomVariables): MutationRef<DeleteRoomData, DeleteRoomVariables>;
  operationName: string;
}
export const deleteRoomRef: DeleteRoomRef;

export function deleteRoom(vars: DeleteRoomVariables): MutationPromise<DeleteRoomData, DeleteRoomVariables>;
export function deleteRoom(dc: DataConnect, vars: DeleteRoomVariables): MutationPromise<DeleteRoomData, DeleteRoomVariables>;

interface DeleteGuestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGuestVariables): MutationRef<DeleteGuestData, DeleteGuestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteGuestVariables): MutationRef<DeleteGuestData, DeleteGuestVariables>;
  operationName: string;
}
export const deleteGuestRef: DeleteGuestRef;

export function deleteGuest(vars: DeleteGuestVariables): MutationPromise<DeleteGuestData, DeleteGuestVariables>;
export function deleteGuest(dc: DataConnect, vars: DeleteGuestVariables): MutationPromise<DeleteGuestData, DeleteGuestVariables>;

interface DeleteStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStaffVariables): MutationRef<DeleteStaffData, DeleteStaffVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteStaffVariables): MutationRef<DeleteStaffData, DeleteStaffVariables>;
  operationName: string;
}
export const deleteStaffRef: DeleteStaffRef;

export function deleteStaff(vars: DeleteStaffVariables): MutationPromise<DeleteStaffData, DeleteStaffVariables>;
export function deleteStaff(dc: DataConnect, vars: DeleteStaffVariables): MutationPromise<DeleteStaffData, DeleteStaffVariables>;

interface DeleteIncidentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIncidentVariables): MutationRef<DeleteIncidentData, DeleteIncidentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteIncidentVariables): MutationRef<DeleteIncidentData, DeleteIncidentVariables>;
  operationName: string;
}
export const deleteIncidentRef: DeleteIncidentRef;

export function deleteIncident(vars: DeleteIncidentVariables): MutationPromise<DeleteIncidentData, DeleteIncidentVariables>;
export function deleteIncident(dc: DataConnect, vars: DeleteIncidentVariables): MutationPromise<DeleteIncidentData, DeleteIncidentVariables>;

interface UpdateGuestPasswordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGuestPasswordVariables): MutationRef<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateGuestPasswordVariables): MutationRef<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;
  operationName: string;
}
export const updateGuestPasswordRef: UpdateGuestPasswordRef;

export function updateGuestPassword(vars: UpdateGuestPasswordVariables): MutationPromise<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;
export function updateGuestPassword(dc: DataConnect, vars: UpdateGuestPasswordVariables): MutationPromise<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;

interface UpdateStaffPasswordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffPasswordVariables): MutationRef<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStaffPasswordVariables): MutationRef<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;
  operationName: string;
}
export const updateStaffPasswordRef: UpdateStaffPasswordRef;

export function updateStaffPassword(vars: UpdateStaffPasswordVariables): MutationPromise<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;
export function updateStaffPassword(dc: DataConnect, vars: UpdateStaffPasswordVariables): MutationPromise<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;

interface CreateGuestFullRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGuestFullVariables): MutationRef<CreateGuestFullData, CreateGuestFullVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateGuestFullVariables): MutationRef<CreateGuestFullData, CreateGuestFullVariables>;
  operationName: string;
}
export const createGuestFullRef: CreateGuestFullRef;

export function createGuestFull(vars: CreateGuestFullVariables): MutationPromise<CreateGuestFullData, CreateGuestFullVariables>;
export function createGuestFull(dc: DataConnect, vars: CreateGuestFullVariables): MutationPromise<CreateGuestFullData, CreateGuestFullVariables>;

interface CreateSecurityProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSecurityProfileVariables): MutationRef<CreateSecurityProfileData, CreateSecurityProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSecurityProfileVariables): MutationRef<CreateSecurityProfileData, CreateSecurityProfileVariables>;
  operationName: string;
}
export const createSecurityProfileRef: CreateSecurityProfileRef;

export function createSecurityProfile(vars: CreateSecurityProfileVariables): MutationPromise<CreateSecurityProfileData, CreateSecurityProfileVariables>;
export function createSecurityProfile(dc: DataConnect, vars: CreateSecurityProfileVariables): MutationPromise<CreateSecurityProfileData, CreateSecurityProfileVariables>;

interface GetUserLoginRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserLoginVariables): QueryRef<GetUserLoginData, GetUserLoginVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserLoginVariables): QueryRef<GetUserLoginData, GetUserLoginVariables>;
  operationName: string;
}
export const getUserLoginRef: GetUserLoginRef;

export function getUserLogin(vars: GetUserLoginVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLoginData, GetUserLoginVariables>;
export function getUserLogin(dc: DataConnect, vars: GetUserLoginVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLoginData, GetUserLoginVariables>;

interface ListUserLoginsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserLoginsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUserLoginsData, undefined>;
  operationName: string;
}
export const listUserLoginsRef: ListUserLoginsRef;

export function listUserLogins(options?: ExecuteQueryOptions): QueryPromise<ListUserLoginsData, undefined>;
export function listUserLogins(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserLoginsData, undefined>;

interface GetUserLoginByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserLoginByEmailVariables): QueryRef<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserLoginByEmailVariables): QueryRef<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;
  operationName: string;
}
export const getUserLoginByEmailRef: GetUserLoginByEmailRef;

export function getUserLoginByEmail(vars: GetUserLoginByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;
export function getUserLoginByEmail(dc: DataConnect, vars: GetUserLoginByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;

interface GetGuestByUidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGuestByUidVariables): QueryRef<GetGuestByUidData, GetGuestByUidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetGuestByUidVariables): QueryRef<GetGuestByUidData, GetGuestByUidVariables>;
  operationName: string;
}
export const getGuestByUidRef: GetGuestByUidRef;

export function getGuestByUid(vars: GetGuestByUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByUidData, GetGuestByUidVariables>;
export function getGuestByUid(dc: DataConnect, vars: GetGuestByUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByUidData, GetGuestByUidVariables>;

interface GetGuestByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGuestByEmailVariables): QueryRef<GetGuestByEmailData, GetGuestByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetGuestByEmailVariables): QueryRef<GetGuestByEmailData, GetGuestByEmailVariables>;
  operationName: string;
}
export const getGuestByEmailRef: GetGuestByEmailRef;

export function getGuestByEmail(vars: GetGuestByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByEmailData, GetGuestByEmailVariables>;
export function getGuestByEmail(dc: DataConnect, vars: GetGuestByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByEmailData, GetGuestByEmailVariables>;

interface GetStaffByUidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByUidVariables): QueryRef<GetStaffByUidData, GetStaffByUidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStaffByUidVariables): QueryRef<GetStaffByUidData, GetStaffByUidVariables>;
  operationName: string;
}
export const getStaffByUidRef: GetStaffByUidRef;

export function getStaffByUid(vars: GetStaffByUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByUidData, GetStaffByUidVariables>;
export function getStaffByUid(dc: DataConnect, vars: GetStaffByUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByUidData, GetStaffByUidVariables>;

interface GetStaffByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByEmailVariables): QueryRef<GetStaffByEmailData, GetStaffByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStaffByEmailVariables): QueryRef<GetStaffByEmailData, GetStaffByEmailVariables>;
  operationName: string;
}
export const getStaffByEmailRef: GetStaffByEmailRef;

export function getStaffByEmail(vars: GetStaffByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByEmailData, GetStaffByEmailVariables>;
export function getStaffByEmail(dc: DataConnect, vars: GetStaffByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByEmailData, GetStaffByEmailVariables>;

interface ListActiveIncidentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListActiveIncidentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListActiveIncidentsData, undefined>;
  operationName: string;
}
export const listActiveIncidentsRef: ListActiveIncidentsRef;

export function listActiveIncidents(options?: ExecuteQueryOptions): QueryPromise<ListActiveIncidentsData, undefined>;
export function listActiveIncidents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListActiveIncidentsData, undefined>;

interface ListIncidentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListIncidentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListIncidentsData, undefined>;
  operationName: string;
}
export const listIncidentsRef: ListIncidentsRef;

export function listIncidents(options?: ExecuteQueryOptions): QueryPromise<ListIncidentsData, undefined>;
export function listIncidents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListIncidentsData, undefined>;

interface ListRoomsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRoomsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListRoomsData, undefined>;
  operationName: string;
}
export const listRoomsRef: ListRoomsRef;

export function listRooms(options?: ExecuteQueryOptions): QueryPromise<ListRoomsData, undefined>;
export function listRooms(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRoomsData, undefined>;

interface ListGuestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListGuestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListGuestsData, undefined>;
  operationName: string;
}
export const listGuestsRef: ListGuestsRef;

export function listGuests(options?: ExecuteQueryOptions): QueryPromise<ListGuestsData, undefined>;
export function listGuests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListGuestsData, undefined>;

interface ListStaffRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStaffData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListStaffData, undefined>;
  operationName: string;
}
export const listStaffRef: ListStaffRef;

export function listStaff(options?: ExecuteQueryOptions): QueryPromise<ListStaffData, undefined>;
export function listStaff(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListStaffData, undefined>;

interface GetStaffByEmployeeIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByEmployeeIdVariables): QueryRef<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStaffByEmployeeIdVariables): QueryRef<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;
  operationName: string;
}
export const getStaffByEmployeeIdRef: GetStaffByEmployeeIdRef;

export function getStaffByEmployeeId(vars: GetStaffByEmployeeIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;
export function getStaffByEmployeeId(dc: DataConnect, vars: GetStaffByEmployeeIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;

interface GetGuestByLoginTokenRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGuestByLoginTokenVariables): QueryRef<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetGuestByLoginTokenVariables): QueryRef<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;
  operationName: string;
}
export const getGuestByLoginTokenRef: GetGuestByLoginTokenRef;

export function getGuestByLoginToken(vars: GetGuestByLoginTokenVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;
export function getGuestByLoginToken(dc: DataConnect, vars: GetGuestByLoginTokenVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;

interface GetGuestByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGuestByIdVariables): QueryRef<GetGuestByIdData, GetGuestByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetGuestByIdVariables): QueryRef<GetGuestByIdData, GetGuestByIdVariables>;
  operationName: string;
}
export const getGuestByIdRef: GetGuestByIdRef;

export function getGuestById(vars: GetGuestByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByIdData, GetGuestByIdVariables>;
export function getGuestById(dc: DataConnect, vars: GetGuestByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByIdData, GetGuestByIdVariables>;

interface GetRoomByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRoomByIdVariables): QueryRef<GetRoomByIdData, GetRoomByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRoomByIdVariables): QueryRef<GetRoomByIdData, GetRoomByIdVariables>;
  operationName: string;
}
export const getRoomByIdRef: GetRoomByIdRef;

export function getRoomById(vars: GetRoomByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetRoomByIdData, GetRoomByIdVariables>;
export function getRoomById(dc: DataConnect, vars: GetRoomByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetRoomByIdData, GetRoomByIdVariables>;

interface GetIncidentByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetIncidentByIdVariables): QueryRef<GetIncidentByIdData, GetIncidentByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetIncidentByIdVariables): QueryRef<GetIncidentByIdData, GetIncidentByIdVariables>;
  operationName: string;
}
export const getIncidentByIdRef: GetIncidentByIdRef;

export function getIncidentById(vars: GetIncidentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetIncidentByIdData, GetIncidentByIdVariables>;
export function getIncidentById(dc: DataConnect, vars: GetIncidentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetIncidentByIdData, GetIncidentByIdVariables>;

interface GetStaffByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByIdVariables): QueryRef<GetStaffByIdData, GetStaffByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStaffByIdVariables): QueryRef<GetStaffByIdData, GetStaffByIdVariables>;
  operationName: string;
}
export const getStaffByIdRef: GetStaffByIdRef;

export function getStaffById(vars: GetStaffByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByIdData, GetStaffByIdVariables>;
export function getStaffById(dc: DataConnect, vars: GetStaffByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByIdData, GetStaffByIdVariables>;

interface ListSecurityProfilesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSecurityProfilesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListSecurityProfilesData, undefined>;
  operationName: string;
}
export const listSecurityProfilesRef: ListSecurityProfilesRef;

export function listSecurityProfiles(options?: ExecuteQueryOptions): QueryPromise<ListSecurityProfilesData, undefined>;
export function listSecurityProfiles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSecurityProfilesData, undefined>;

