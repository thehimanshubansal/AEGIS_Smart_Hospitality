import { UpsertUserLoginData, UpsertUserLoginVariables, CreateGuestData, CreateGuestVariables, UpdateGuestData, UpdateGuestVariables, CreateStaffData, CreateStaffVariables, UpdateStaffData, UpdateStaffVariables, CreateIncidentData, CreateIncidentVariables, UpdateIncidentData, UpdateIncidentVariables, CreateRoomData, CreateRoomVariables, UpdateRoomData, UpdateRoomVariables, DeleteRoomData, DeleteRoomVariables, DeleteGuestData, DeleteGuestVariables, DeleteStaffData, DeleteStaffVariables, DeleteIncidentData, DeleteIncidentVariables, UpdateGuestPasswordData, UpdateGuestPasswordVariables, UpdateStaffPasswordData, UpdateStaffPasswordVariables, CreateGuestFullData, CreateGuestFullVariables, CreateSecurityProfileData, CreateSecurityProfileVariables, GetUserLoginData, GetUserLoginVariables, ListUserLoginsData, GetUserLoginByEmailData, GetUserLoginByEmailVariables, GetGuestByUidData, GetGuestByUidVariables, GetGuestByEmailData, GetGuestByEmailVariables, GetStaffByUidData, GetStaffByUidVariables, GetStaffByEmailData, GetStaffByEmailVariables, ListActiveIncidentsData, ListIncidentsData, ListRoomsData, ListGuestsData, ListStaffData, GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables, GetGuestByLoginTokenData, GetGuestByLoginTokenVariables, GetGuestByIdData, GetGuestByIdVariables, GetRoomByIdData, GetRoomByIdVariables, GetIncidentByIdData, GetIncidentByIdVariables, GetStaffByIdData, GetStaffByIdVariables, ListSecurityProfilesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useUpsertUserLogin(options?: useDataConnectMutationOptions<UpsertUserLoginData, FirebaseError, UpsertUserLoginVariables>): UseDataConnectMutationResult<UpsertUserLoginData, UpsertUserLoginVariables>;
export function useUpsertUserLogin(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserLoginData, FirebaseError, UpsertUserLoginVariables>): UseDataConnectMutationResult<UpsertUserLoginData, UpsertUserLoginVariables>;

export function useCreateGuest(options?: useDataConnectMutationOptions<CreateGuestData, FirebaseError, CreateGuestVariables>): UseDataConnectMutationResult<CreateGuestData, CreateGuestVariables>;
export function useCreateGuest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateGuestData, FirebaseError, CreateGuestVariables>): UseDataConnectMutationResult<CreateGuestData, CreateGuestVariables>;

export function useUpdateGuest(options?: useDataConnectMutationOptions<UpdateGuestData, FirebaseError, UpdateGuestVariables>): UseDataConnectMutationResult<UpdateGuestData, UpdateGuestVariables>;
export function useUpdateGuest(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateGuestData, FirebaseError, UpdateGuestVariables>): UseDataConnectMutationResult<UpdateGuestData, UpdateGuestVariables>;

export function useCreateStaff(options?: useDataConnectMutationOptions<CreateStaffData, FirebaseError, CreateStaffVariables>): UseDataConnectMutationResult<CreateStaffData, CreateStaffVariables>;
export function useCreateStaff(dc: DataConnect, options?: useDataConnectMutationOptions<CreateStaffData, FirebaseError, CreateStaffVariables>): UseDataConnectMutationResult<CreateStaffData, CreateStaffVariables>;

export function useUpdateStaff(options?: useDataConnectMutationOptions<UpdateStaffData, FirebaseError, UpdateStaffVariables>): UseDataConnectMutationResult<UpdateStaffData, UpdateStaffVariables>;
export function useUpdateStaff(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateStaffData, FirebaseError, UpdateStaffVariables>): UseDataConnectMutationResult<UpdateStaffData, UpdateStaffVariables>;

export function useCreateIncident(options?: useDataConnectMutationOptions<CreateIncidentData, FirebaseError, CreateIncidentVariables>): UseDataConnectMutationResult<CreateIncidentData, CreateIncidentVariables>;
export function useCreateIncident(dc: DataConnect, options?: useDataConnectMutationOptions<CreateIncidentData, FirebaseError, CreateIncidentVariables>): UseDataConnectMutationResult<CreateIncidentData, CreateIncidentVariables>;

export function useUpdateIncident(options?: useDataConnectMutationOptions<UpdateIncidentData, FirebaseError, UpdateIncidentVariables>): UseDataConnectMutationResult<UpdateIncidentData, UpdateIncidentVariables>;
export function useUpdateIncident(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateIncidentData, FirebaseError, UpdateIncidentVariables>): UseDataConnectMutationResult<UpdateIncidentData, UpdateIncidentVariables>;

export function useCreateRoom(options?: useDataConnectMutationOptions<CreateRoomData, FirebaseError, CreateRoomVariables>): UseDataConnectMutationResult<CreateRoomData, CreateRoomVariables>;
export function useCreateRoom(dc: DataConnect, options?: useDataConnectMutationOptions<CreateRoomData, FirebaseError, CreateRoomVariables>): UseDataConnectMutationResult<CreateRoomData, CreateRoomVariables>;

export function useUpdateRoom(options?: useDataConnectMutationOptions<UpdateRoomData, FirebaseError, UpdateRoomVariables>): UseDataConnectMutationResult<UpdateRoomData, UpdateRoomVariables>;
export function useUpdateRoom(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateRoomData, FirebaseError, UpdateRoomVariables>): UseDataConnectMutationResult<UpdateRoomData, UpdateRoomVariables>;

export function useDeleteRoom(options?: useDataConnectMutationOptions<DeleteRoomData, FirebaseError, DeleteRoomVariables>): UseDataConnectMutationResult<DeleteRoomData, DeleteRoomVariables>;
export function useDeleteRoom(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteRoomData, FirebaseError, DeleteRoomVariables>): UseDataConnectMutationResult<DeleteRoomData, DeleteRoomVariables>;

export function useDeleteGuest(options?: useDataConnectMutationOptions<DeleteGuestData, FirebaseError, DeleteGuestVariables>): UseDataConnectMutationResult<DeleteGuestData, DeleteGuestVariables>;
export function useDeleteGuest(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteGuestData, FirebaseError, DeleteGuestVariables>): UseDataConnectMutationResult<DeleteGuestData, DeleteGuestVariables>;

export function useDeleteStaff(options?: useDataConnectMutationOptions<DeleteStaffData, FirebaseError, DeleteStaffVariables>): UseDataConnectMutationResult<DeleteStaffData, DeleteStaffVariables>;
export function useDeleteStaff(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteStaffData, FirebaseError, DeleteStaffVariables>): UseDataConnectMutationResult<DeleteStaffData, DeleteStaffVariables>;

export function useDeleteIncident(options?: useDataConnectMutationOptions<DeleteIncidentData, FirebaseError, DeleteIncidentVariables>): UseDataConnectMutationResult<DeleteIncidentData, DeleteIncidentVariables>;
export function useDeleteIncident(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteIncidentData, FirebaseError, DeleteIncidentVariables>): UseDataConnectMutationResult<DeleteIncidentData, DeleteIncidentVariables>;

export function useUpdateGuestPassword(options?: useDataConnectMutationOptions<UpdateGuestPasswordData, FirebaseError, UpdateGuestPasswordVariables>): UseDataConnectMutationResult<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;
export function useUpdateGuestPassword(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateGuestPasswordData, FirebaseError, UpdateGuestPasswordVariables>): UseDataConnectMutationResult<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;

export function useUpdateStaffPassword(options?: useDataConnectMutationOptions<UpdateStaffPasswordData, FirebaseError, UpdateStaffPasswordVariables>): UseDataConnectMutationResult<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;
export function useUpdateStaffPassword(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateStaffPasswordData, FirebaseError, UpdateStaffPasswordVariables>): UseDataConnectMutationResult<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;

export function useCreateGuestFull(options?: useDataConnectMutationOptions<CreateGuestFullData, FirebaseError, CreateGuestFullVariables>): UseDataConnectMutationResult<CreateGuestFullData, CreateGuestFullVariables>;
export function useCreateGuestFull(dc: DataConnect, options?: useDataConnectMutationOptions<CreateGuestFullData, FirebaseError, CreateGuestFullVariables>): UseDataConnectMutationResult<CreateGuestFullData, CreateGuestFullVariables>;

export function useCreateSecurityProfile(options?: useDataConnectMutationOptions<CreateSecurityProfileData, FirebaseError, CreateSecurityProfileVariables>): UseDataConnectMutationResult<CreateSecurityProfileData, CreateSecurityProfileVariables>;
export function useCreateSecurityProfile(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSecurityProfileData, FirebaseError, CreateSecurityProfileVariables>): UseDataConnectMutationResult<CreateSecurityProfileData, CreateSecurityProfileVariables>;

export function useGetUserLogin(vars: GetUserLoginVariables, options?: useDataConnectQueryOptions<GetUserLoginData>): UseDataConnectQueryResult<GetUserLoginData, GetUserLoginVariables>;
export function useGetUserLogin(dc: DataConnect, vars: GetUserLoginVariables, options?: useDataConnectQueryOptions<GetUserLoginData>): UseDataConnectQueryResult<GetUserLoginData, GetUserLoginVariables>;

export function useListUserLogins(options?: useDataConnectQueryOptions<ListUserLoginsData>): UseDataConnectQueryResult<ListUserLoginsData, undefined>;
export function useListUserLogins(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserLoginsData>): UseDataConnectQueryResult<ListUserLoginsData, undefined>;

export function useGetUserLoginByEmail(vars: GetUserLoginByEmailVariables, options?: useDataConnectQueryOptions<GetUserLoginByEmailData>): UseDataConnectQueryResult<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;
export function useGetUserLoginByEmail(dc: DataConnect, vars: GetUserLoginByEmailVariables, options?: useDataConnectQueryOptions<GetUserLoginByEmailData>): UseDataConnectQueryResult<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;

export function useGetGuestByUid(vars: GetGuestByUidVariables, options?: useDataConnectQueryOptions<GetGuestByUidData>): UseDataConnectQueryResult<GetGuestByUidData, GetGuestByUidVariables>;
export function useGetGuestByUid(dc: DataConnect, vars: GetGuestByUidVariables, options?: useDataConnectQueryOptions<GetGuestByUidData>): UseDataConnectQueryResult<GetGuestByUidData, GetGuestByUidVariables>;

export function useGetGuestByEmail(vars: GetGuestByEmailVariables, options?: useDataConnectQueryOptions<GetGuestByEmailData>): UseDataConnectQueryResult<GetGuestByEmailData, GetGuestByEmailVariables>;
export function useGetGuestByEmail(dc: DataConnect, vars: GetGuestByEmailVariables, options?: useDataConnectQueryOptions<GetGuestByEmailData>): UseDataConnectQueryResult<GetGuestByEmailData, GetGuestByEmailVariables>;

export function useGetStaffByUid(vars: GetStaffByUidVariables, options?: useDataConnectQueryOptions<GetStaffByUidData>): UseDataConnectQueryResult<GetStaffByUidData, GetStaffByUidVariables>;
export function useGetStaffByUid(dc: DataConnect, vars: GetStaffByUidVariables, options?: useDataConnectQueryOptions<GetStaffByUidData>): UseDataConnectQueryResult<GetStaffByUidData, GetStaffByUidVariables>;

export function useGetStaffByEmail(vars: GetStaffByEmailVariables, options?: useDataConnectQueryOptions<GetStaffByEmailData>): UseDataConnectQueryResult<GetStaffByEmailData, GetStaffByEmailVariables>;
export function useGetStaffByEmail(dc: DataConnect, vars: GetStaffByEmailVariables, options?: useDataConnectQueryOptions<GetStaffByEmailData>): UseDataConnectQueryResult<GetStaffByEmailData, GetStaffByEmailVariables>;

export function useListActiveIncidents(options?: useDataConnectQueryOptions<ListActiveIncidentsData>): UseDataConnectQueryResult<ListActiveIncidentsData, undefined>;
export function useListActiveIncidents(dc: DataConnect, options?: useDataConnectQueryOptions<ListActiveIncidentsData>): UseDataConnectQueryResult<ListActiveIncidentsData, undefined>;

export function useListIncidents(options?: useDataConnectQueryOptions<ListIncidentsData>): UseDataConnectQueryResult<ListIncidentsData, undefined>;
export function useListIncidents(dc: DataConnect, options?: useDataConnectQueryOptions<ListIncidentsData>): UseDataConnectQueryResult<ListIncidentsData, undefined>;

export function useListRooms(options?: useDataConnectQueryOptions<ListRoomsData>): UseDataConnectQueryResult<ListRoomsData, undefined>;
export function useListRooms(dc: DataConnect, options?: useDataConnectQueryOptions<ListRoomsData>): UseDataConnectQueryResult<ListRoomsData, undefined>;

export function useListGuests(options?: useDataConnectQueryOptions<ListGuestsData>): UseDataConnectQueryResult<ListGuestsData, undefined>;
export function useListGuests(dc: DataConnect, options?: useDataConnectQueryOptions<ListGuestsData>): UseDataConnectQueryResult<ListGuestsData, undefined>;

export function useListStaff(options?: useDataConnectQueryOptions<ListStaffData>): UseDataConnectQueryResult<ListStaffData, undefined>;
export function useListStaff(dc: DataConnect, options?: useDataConnectQueryOptions<ListStaffData>): UseDataConnectQueryResult<ListStaffData, undefined>;

export function useGetStaffByEmployeeId(vars: GetStaffByEmployeeIdVariables, options?: useDataConnectQueryOptions<GetStaffByEmployeeIdData>): UseDataConnectQueryResult<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;
export function useGetStaffByEmployeeId(dc: DataConnect, vars: GetStaffByEmployeeIdVariables, options?: useDataConnectQueryOptions<GetStaffByEmployeeIdData>): UseDataConnectQueryResult<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;

export function useGetGuestByLoginToken(vars: GetGuestByLoginTokenVariables, options?: useDataConnectQueryOptions<GetGuestByLoginTokenData>): UseDataConnectQueryResult<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;
export function useGetGuestByLoginToken(dc: DataConnect, vars: GetGuestByLoginTokenVariables, options?: useDataConnectQueryOptions<GetGuestByLoginTokenData>): UseDataConnectQueryResult<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;

export function useGetGuestById(vars: GetGuestByIdVariables, options?: useDataConnectQueryOptions<GetGuestByIdData>): UseDataConnectQueryResult<GetGuestByIdData, GetGuestByIdVariables>;
export function useGetGuestById(dc: DataConnect, vars: GetGuestByIdVariables, options?: useDataConnectQueryOptions<GetGuestByIdData>): UseDataConnectQueryResult<GetGuestByIdData, GetGuestByIdVariables>;

export function useGetRoomById(vars: GetRoomByIdVariables, options?: useDataConnectQueryOptions<GetRoomByIdData>): UseDataConnectQueryResult<GetRoomByIdData, GetRoomByIdVariables>;
export function useGetRoomById(dc: DataConnect, vars: GetRoomByIdVariables, options?: useDataConnectQueryOptions<GetRoomByIdData>): UseDataConnectQueryResult<GetRoomByIdData, GetRoomByIdVariables>;

export function useGetIncidentById(vars: GetIncidentByIdVariables, options?: useDataConnectQueryOptions<GetIncidentByIdData>): UseDataConnectQueryResult<GetIncidentByIdData, GetIncidentByIdVariables>;
export function useGetIncidentById(dc: DataConnect, vars: GetIncidentByIdVariables, options?: useDataConnectQueryOptions<GetIncidentByIdData>): UseDataConnectQueryResult<GetIncidentByIdData, GetIncidentByIdVariables>;

export function useGetStaffById(vars: GetStaffByIdVariables, options?: useDataConnectQueryOptions<GetStaffByIdData>): UseDataConnectQueryResult<GetStaffByIdData, GetStaffByIdVariables>;
export function useGetStaffById(dc: DataConnect, vars: GetStaffByIdVariables, options?: useDataConnectQueryOptions<GetStaffByIdData>): UseDataConnectQueryResult<GetStaffByIdData, GetStaffByIdVariables>;

export function useListSecurityProfiles(options?: useDataConnectQueryOptions<ListSecurityProfilesData>): UseDataConnectQueryResult<ListSecurityProfilesData, undefined>;
export function useListSecurityProfiles(dc: DataConnect, options?: useDataConnectQueryOptions<ListSecurityProfilesData>): UseDataConnectQueryResult<ListSecurityProfilesData, undefined>;
