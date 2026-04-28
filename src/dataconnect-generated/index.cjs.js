const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'aegis-shield-dc',
  location: 'europe-west1'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const upsertUserLoginRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'upsertUserLogin', inputVars);
}
upsertUserLoginRef.operationName = 'upsertUserLogin';
exports.upsertUserLoginRef = upsertUserLoginRef;

exports.upsertUserLogin = function upsertUserLogin(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserLoginRef(dcInstance, inputVars));
}
;

const createGuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createGuest', inputVars);
}
createGuestRef.operationName = 'createGuest';
exports.createGuestRef = createGuestRef;

exports.createGuest = function createGuest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createGuestRef(dcInstance, inputVars));
}
;

const updateGuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateGuest', inputVars);
}
updateGuestRef.operationName = 'updateGuest';
exports.updateGuestRef = updateGuestRef;

exports.updateGuest = function updateGuest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateGuestRef(dcInstance, inputVars));
}
;

const createStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createStaff', inputVars);
}
createStaffRef.operationName = 'createStaff';
exports.createStaffRef = createStaffRef;

exports.createStaff = function createStaff(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createStaffRef(dcInstance, inputVars));
}
;

const updateStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateStaff', inputVars);
}
updateStaffRef.operationName = 'updateStaff';
exports.updateStaffRef = updateStaffRef;

exports.updateStaff = function updateStaff(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateStaffRef(dcInstance, inputVars));
}
;

const createIncidentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createIncident', inputVars);
}
createIncidentRef.operationName = 'createIncident';
exports.createIncidentRef = createIncidentRef;

exports.createIncident = function createIncident(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createIncidentRef(dcInstance, inputVars));
}
;

const updateIncidentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateIncident', inputVars);
}
updateIncidentRef.operationName = 'updateIncident';
exports.updateIncidentRef = updateIncidentRef;

exports.updateIncident = function updateIncident(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateIncidentRef(dcInstance, inputVars));
}
;

const createRoomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createRoom', inputVars);
}
createRoomRef.operationName = 'createRoom';
exports.createRoomRef = createRoomRef;

exports.createRoom = function createRoom(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createRoomRef(dcInstance, inputVars));
}
;

const updateRoomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateRoom', inputVars);
}
updateRoomRef.operationName = 'updateRoom';
exports.updateRoomRef = updateRoomRef;

exports.updateRoom = function updateRoom(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateRoomRef(dcInstance, inputVars));
}
;

const deleteRoomRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteRoom', inputVars);
}
deleteRoomRef.operationName = 'deleteRoom';
exports.deleteRoomRef = deleteRoomRef;

exports.deleteRoom = function deleteRoom(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteRoomRef(dcInstance, inputVars));
}
;

const deleteGuestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteGuest', inputVars);
}
deleteGuestRef.operationName = 'deleteGuest';
exports.deleteGuestRef = deleteGuestRef;

exports.deleteGuest = function deleteGuest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteGuestRef(dcInstance, inputVars));
}
;

const deleteStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteStaff', inputVars);
}
deleteStaffRef.operationName = 'deleteStaff';
exports.deleteStaffRef = deleteStaffRef;

exports.deleteStaff = function deleteStaff(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteStaffRef(dcInstance, inputVars));
}
;

const deleteIncidentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'deleteIncident', inputVars);
}
deleteIncidentRef.operationName = 'deleteIncident';
exports.deleteIncidentRef = deleteIncidentRef;

exports.deleteIncident = function deleteIncident(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteIncidentRef(dcInstance, inputVars));
}
;

const updateGuestPasswordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateGuestPassword', inputVars);
}
updateGuestPasswordRef.operationName = 'updateGuestPassword';
exports.updateGuestPasswordRef = updateGuestPasswordRef;

exports.updateGuestPassword = function updateGuestPassword(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateGuestPasswordRef(dcInstance, inputVars));
}
;

const updateStaffPasswordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'updateStaffPassword', inputVars);
}
updateStaffPasswordRef.operationName = 'updateStaffPassword';
exports.updateStaffPasswordRef = updateStaffPasswordRef;

exports.updateStaffPassword = function updateStaffPassword(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateStaffPasswordRef(dcInstance, inputVars));
}
;

const createGuestFullRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createGuestFull', inputVars);
}
createGuestFullRef.operationName = 'createGuestFull';
exports.createGuestFullRef = createGuestFullRef;

exports.createGuestFull = function createGuestFull(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createGuestFullRef(dcInstance, inputVars));
}
;

const createSecurityProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'createSecurityProfile', inputVars);
}
createSecurityProfileRef.operationName = 'createSecurityProfile';
exports.createSecurityProfileRef = createSecurityProfileRef;

exports.createSecurityProfile = function createSecurityProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createSecurityProfileRef(dcInstance, inputVars));
}
;

const getUserLoginRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getUserLogin', inputVars);
}
getUserLoginRef.operationName = 'getUserLogin';
exports.getUserLoginRef = getUserLoginRef;

exports.getUserLogin = function getUserLogin(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserLoginRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listUserLoginsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listUserLogins');
}
listUserLoginsRef.operationName = 'listUserLogins';
exports.listUserLoginsRef = listUserLoginsRef;

exports.listUserLogins = function listUserLogins(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listUserLoginsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getUserLoginByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getUserLoginByEmail', inputVars);
}
getUserLoginByEmailRef.operationName = 'getUserLoginByEmail';
exports.getUserLoginByEmailRef = getUserLoginByEmailRef;

exports.getUserLoginByEmail = function getUserLoginByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getUserLoginByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getGuestByUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getGuestByUid', inputVars);
}
getGuestByUidRef.operationName = 'getGuestByUid';
exports.getGuestByUidRef = getGuestByUidRef;

exports.getGuestByUid = function getGuestByUid(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getGuestByUidRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getGuestByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getGuestByEmail', inputVars);
}
getGuestByEmailRef.operationName = 'getGuestByEmail';
exports.getGuestByEmailRef = getGuestByEmailRef;

exports.getGuestByEmail = function getGuestByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getGuestByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getStaffByUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getStaffByUid', inputVars);
}
getStaffByUidRef.operationName = 'getStaffByUid';
exports.getStaffByUidRef = getStaffByUidRef;

exports.getStaffByUid = function getStaffByUid(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getStaffByUidRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getStaffByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getStaffByEmail', inputVars);
}
getStaffByEmailRef.operationName = 'getStaffByEmail';
exports.getStaffByEmailRef = getStaffByEmailRef;

exports.getStaffByEmail = function getStaffByEmail(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getStaffByEmailRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listActiveIncidentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listActiveIncidents');
}
listActiveIncidentsRef.operationName = 'listActiveIncidents';
exports.listActiveIncidentsRef = listActiveIncidentsRef;

exports.listActiveIncidents = function listActiveIncidents(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listActiveIncidentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listIncidentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listIncidents');
}
listIncidentsRef.operationName = 'listIncidents';
exports.listIncidentsRef = listIncidentsRef;

exports.listIncidents = function listIncidents(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listIncidentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listRoomsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listRooms');
}
listRoomsRef.operationName = 'listRooms';
exports.listRoomsRef = listRoomsRef;

exports.listRooms = function listRooms(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listRoomsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listGuestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listGuests');
}
listGuestsRef.operationName = 'listGuests';
exports.listGuestsRef = listGuestsRef;

exports.listGuests = function listGuests(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listGuestsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listStaffRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listStaff');
}
listStaffRef.operationName = 'listStaff';
exports.listStaffRef = listStaffRef;

exports.listStaff = function listStaff(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listStaffRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getStaffByEmployeeIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getStaffByEmployeeId', inputVars);
}
getStaffByEmployeeIdRef.operationName = 'getStaffByEmployeeId';
exports.getStaffByEmployeeIdRef = getStaffByEmployeeIdRef;

exports.getStaffByEmployeeId = function getStaffByEmployeeId(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getStaffByEmployeeIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getGuestByLoginTokenRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getGuestByLoginToken', inputVars);
}
getGuestByLoginTokenRef.operationName = 'getGuestByLoginToken';
exports.getGuestByLoginTokenRef = getGuestByLoginTokenRef;

exports.getGuestByLoginToken = function getGuestByLoginToken(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getGuestByLoginTokenRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getGuestByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getGuestById', inputVars);
}
getGuestByIdRef.operationName = 'getGuestById';
exports.getGuestByIdRef = getGuestByIdRef;

exports.getGuestById = function getGuestById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getGuestByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getRoomByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getRoomById', inputVars);
}
getRoomByIdRef.operationName = 'getRoomById';
exports.getRoomByIdRef = getRoomByIdRef;

exports.getRoomById = function getRoomById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getRoomByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getIncidentByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getIncidentById', inputVars);
}
getIncidentByIdRef.operationName = 'getIncidentById';
exports.getIncidentByIdRef = getIncidentByIdRef;

exports.getIncidentById = function getIncidentById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getIncidentByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getStaffByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getStaffById', inputVars);
}
getStaffByIdRef.operationName = 'getStaffById';
exports.getStaffByIdRef = getStaffByIdRef;

exports.getStaffById = function getStaffById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getStaffByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listSecurityProfilesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'listSecurityProfiles');
}
listSecurityProfilesRef.operationName = 'listSecurityProfiles';
exports.listSecurityProfilesRef = listSecurityProfilesRef;

exports.listSecurityProfiles = function listSecurityProfiles(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listSecurityProfilesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
