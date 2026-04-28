import { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'aegis-shield-dc',
  location: 'europe-west1'
};
export const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
export const upsertUserLoginRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertUserLogin', inputVars);
}
upsertUserLoginRef.operationName = 'upsertUserLogin';

export function upsertUserLogin(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserLoginRef(dcInstance, inputVars));
}

export const createGuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createGuest', inputVars);
}
createGuestRef.operationName = 'createGuest';

export function createGuest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createGuestRef(dcInstance, inputVars));
}

export const updateGuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateGuest', inputVars);
}
updateGuestRef.operationName = 'updateGuest';

export function updateGuest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateGuestRef(dcInstance, inputVars));
}

export const createStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createStaff', inputVars);
}
createStaffRef.operationName = 'createStaff';

export function createStaff(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createStaffRef(dcInstance, inputVars));
}

export const updateStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateStaff', inputVars);
}
updateStaffRef.operationName = 'updateStaff';

export function updateStaff(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateStaffRef(dcInstance, inputVars));
}

export const createIncidentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createIncident', inputVars);
}
createIncidentRef.operationName = 'createIncident';

export function createIncident(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createIncidentRef(dcInstance, inputVars));
}

export const updateIncidentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateIncident', inputVars);
}
updateIncidentRef.operationName = 'updateIncident';

export function updateIncident(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateIncidentRef(dcInstance, inputVars));
}

export const createRoomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createRoom', inputVars);
}
createRoomRef.operationName = 'createRoom';

export function createRoom(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createRoomRef(dcInstance, inputVars));
}

export const updateRoomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateRoom', inputVars);
}
updateRoomRef.operationName = 'updateRoom';

export function updateRoom(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateRoomRef(dcInstance, inputVars));
}

export const deleteRoomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteRoom', inputVars);
}
deleteRoomRef.operationName = 'deleteRoom';

export function deleteRoom(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteRoomRef(dcInstance, inputVars));
}

export const deleteGuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteGuest', inputVars);
}
deleteGuestRef.operationName = 'deleteGuest';

export function deleteGuest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteGuestRef(dcInstance, inputVars));
}

export const deleteStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteStaff', inputVars);
}
deleteStaffRef.operationName = 'deleteStaff';

export function deleteStaff(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteStaffRef(dcInstance, inputVars));
}

export const deleteIncidentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteIncident', inputVars);
}
deleteIncidentRef.operationName = 'deleteIncident';

export function deleteIncident(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteIncidentRef(dcInstance, inputVars));
}

export const updateGuestPasswordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateGuestPassword', inputVars);
}
updateGuestPasswordRef.operationName = 'updateGuestPassword';

export function updateGuestPassword(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateGuestPasswordRef(dcInstance, inputVars));
}

export const updateStaffPasswordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateStaffPassword', inputVars);
}
updateStaffPasswordRef.operationName = 'updateStaffPassword';

export function updateStaffPassword(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateStaffPasswordRef(dcInstance, inputVars));
}

export const createGuestFullRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createGuestFull', inputVars);
}
createGuestFullRef.operationName = 'createGuestFull';

export function createGuestFull(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createGuestFullRef(dcInstance, inputVars));
}

export const createSecurityProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSecurityProfile', inputVars);
}
createSecurityProfileRef.operationName = 'createSecurityProfile';

export function createSecurityProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createSecurityProfileRef(dcInstance, inputVars));
}

export const getUserLoginRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getUserLogin', inputVars);
}
getUserLoginRef.operationName = 'getUserLogin';

export function getUserLogin(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserLoginRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listUserLoginsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listUserLogins');
}
listUserLoginsRef.operationName = 'listUserLogins';

export function listUserLogins(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listUserLoginsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getUserLoginByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getUserLoginByEmail', inputVars);
}
getUserLoginByEmailRef.operationName = 'getUserLoginByEmail';

export function getUserLoginByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserLoginByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getGuestByUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getGuestByUid', inputVars);
}
getGuestByUidRef.operationName = 'getGuestByUid';

export function getGuestByUid(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getGuestByUidRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getGuestByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getGuestByEmail', inputVars);
}
getGuestByEmailRef.operationName = 'getGuestByEmail';

export function getGuestByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getGuestByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getStaffByUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getStaffByUid', inputVars);
}
getStaffByUidRef.operationName = 'getStaffByUid';

export function getStaffByUid(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getStaffByUidRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getStaffByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getStaffByEmail', inputVars);
}
getStaffByEmailRef.operationName = 'getStaffByEmail';

export function getStaffByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getStaffByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listActiveIncidentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listActiveIncidents');
}
listActiveIncidentsRef.operationName = 'listActiveIncidents';

export function listActiveIncidents(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listActiveIncidentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listIncidentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listIncidents');
}
listIncidentsRef.operationName = 'listIncidents';

export function listIncidents(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listIncidentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listRoomsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listRooms');
}
listRoomsRef.operationName = 'listRooms';

export function listRooms(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listRoomsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listGuestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listGuests');
}
listGuestsRef.operationName = 'listGuests';

export function listGuests(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listGuestsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listStaffRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listStaff');
}
listStaffRef.operationName = 'listStaff';

export function listStaff(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listStaffRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getStaffByEmployeeIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getStaffByEmployeeId', inputVars);
}
getStaffByEmployeeIdRef.operationName = 'getStaffByEmployeeId';

export function getStaffByEmployeeId(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getStaffByEmployeeIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getGuestByLoginTokenRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getGuestByLoginToken', inputVars);
}
getGuestByLoginTokenRef.operationName = 'getGuestByLoginToken';

export function getGuestByLoginToken(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getGuestByLoginTokenRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getGuestByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getGuestById', inputVars);
}
getGuestByIdRef.operationName = 'getGuestById';

export function getGuestById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getGuestByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getRoomByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getRoomById', inputVars);
}
getRoomByIdRef.operationName = 'getRoomById';

export function getRoomById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getRoomByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getIncidentByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getIncidentById', inputVars);
}
getIncidentByIdRef.operationName = 'getIncidentById';

export function getIncidentById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getIncidentByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const getStaffByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getStaffById', inputVars);
}
getStaffByIdRef.operationName = 'getStaffById';

export function getStaffById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getStaffByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const listSecurityProfilesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listSecurityProfiles');
}
listSecurityProfilesRef.operationName = 'listSecurityProfiles';

export function listSecurityProfiles(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listSecurityProfilesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

