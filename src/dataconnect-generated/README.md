# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*getUserLogin*](#getuserlogin)
  - [*listUserLogins*](#listuserlogins)
  - [*getUserLoginByEmail*](#getuserloginbyemail)
  - [*getGuestByUid*](#getguestbyuid)
  - [*getGuestByEmail*](#getguestbyemail)
  - [*getStaffByUid*](#getstaffbyuid)
  - [*getStaffByEmail*](#getstaffbyemail)
  - [*listActiveIncidents*](#listactiveincidents)
  - [*listIncidents*](#listincidents)
  - [*listRooms*](#listrooms)
  - [*listGuests*](#listguests)
  - [*listStaff*](#liststaff)
  - [*getStaffByEmployeeId*](#getstaffbyemployeeid)
  - [*getGuestByLoginToken*](#getguestbylogintoken)
  - [*getGuestById*](#getguestbyid)
  - [*getRoomById*](#getroombyid)
  - [*getIncidentById*](#getincidentbyid)
  - [*getStaffById*](#getstaffbyid)
  - [*listSecurityProfiles*](#listsecurityprofiles)
- [**Mutations**](#mutations)
  - [*upsertUserLogin*](#upsertuserlogin)
  - [*createGuest*](#createguest)
  - [*updateGuest*](#updateguest)
  - [*createStaff*](#createstaff)
  - [*updateStaff*](#updatestaff)
  - [*createIncident*](#createincident)
  - [*updateIncident*](#updateincident)
  - [*createRoom*](#createroom)
  - [*updateRoom*](#updateroom)
  - [*deleteRoom*](#deleteroom)
  - [*deleteGuest*](#deleteguest)
  - [*deleteStaff*](#deletestaff)
  - [*deleteIncident*](#deleteincident)
  - [*updateGuestPassword*](#updateguestpassword)
  - [*updateStaffPassword*](#updatestaffpassword)
  - [*createGuestFull*](#createguestfull)
  - [*createSecurityProfile*](#createsecurityprofile)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## getUserLogin
You can execute the `getUserLogin` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserLogin(vars: GetUserLoginVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLoginData, GetUserLoginVariables>;

interface GetUserLoginRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserLoginVariables): QueryRef<GetUserLoginData, GetUserLoginVariables>;
}
export const getUserLoginRef: GetUserLoginRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserLogin(dc: DataConnect, vars: GetUserLoginVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLoginData, GetUserLoginVariables>;

interface GetUserLoginRef {
  ...
  (dc: DataConnect, vars: GetUserLoginVariables): QueryRef<GetUserLoginData, GetUserLoginVariables>;
}
export const getUserLoginRef: GetUserLoginRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserLoginRef:
```typescript
const name = getUserLoginRef.operationName;
console.log(name);
```

### Variables
The `getUserLogin` query requires an argument of type `GetUserLoginVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserLoginVariables {
  firebaseUid: string;
}
```
### Return Type
Recall that executing the `getUserLogin` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserLoginData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getUserLogin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserLogin, GetUserLoginVariables } from '@dataconnect/generated';

// The `getUserLogin` query requires an argument of type `GetUserLoginVariables`:
const getUserLoginVars: GetUserLoginVariables = {
  firebaseUid: ..., 
};

// Call the `getUserLogin()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserLogin(getUserLoginVars);
// Variables can be defined inline as well.
const { data } = await getUserLogin({ firebaseUid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserLogin(dataConnect, getUserLoginVars);

console.log(data.userLogin);

// Or, you can use the `Promise` API.
getUserLogin(getUserLoginVars).then((response) => {
  const data = response.data;
  console.log(data.userLogin);
});
```

### Using `getUserLogin`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserLoginRef, GetUserLoginVariables } from '@dataconnect/generated';

// The `getUserLogin` query requires an argument of type `GetUserLoginVariables`:
const getUserLoginVars: GetUserLoginVariables = {
  firebaseUid: ..., 
};

// Call the `getUserLoginRef()` function to get a reference to the query.
const ref = getUserLoginRef(getUserLoginVars);
// Variables can be defined inline as well.
const ref = getUserLoginRef({ firebaseUid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserLoginRef(dataConnect, getUserLoginVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userLogin);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userLogin);
});
```

## listUserLogins
You can execute the `listUserLogins` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserLogins(options?: ExecuteQueryOptions): QueryPromise<ListUserLoginsData, undefined>;

interface ListUserLoginsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserLoginsData, undefined>;
}
export const listUserLoginsRef: ListUserLoginsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserLogins(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserLoginsData, undefined>;

interface ListUserLoginsRef {
  ...
  (dc: DataConnect): QueryRef<ListUserLoginsData, undefined>;
}
export const listUserLoginsRef: ListUserLoginsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserLoginsRef:
```typescript
const name = listUserLoginsRef.operationName;
console.log(name);
```

### Variables
The `listUserLogins` query has no variables.
### Return Type
Recall that executing the `listUserLogins` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserLoginsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserLoginsData {
  userLogins: ({
    firebaseUid: string;
    email: string;
    displayName?: string | null;
    role: string;
  } & UserLogin_Key)[];
}
```
### Using `listUserLogins`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserLogins } from '@dataconnect/generated';


// Call the `listUserLogins()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserLogins();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserLogins(dataConnect);

console.log(data.userLogins);

// Or, you can use the `Promise` API.
listUserLogins().then((response) => {
  const data = response.data;
  console.log(data.userLogins);
});
```

### Using `listUserLogins`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserLoginsRef } from '@dataconnect/generated';


// Call the `listUserLoginsRef()` function to get a reference to the query.
const ref = listUserLoginsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserLoginsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userLogins);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userLogins);
});
```

## getUserLoginByEmail
You can execute the `getUserLoginByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserLoginByEmail(vars: GetUserLoginByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;

interface GetUserLoginByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserLoginByEmailVariables): QueryRef<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;
}
export const getUserLoginByEmailRef: GetUserLoginByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserLoginByEmail(dc: DataConnect, vars: GetUserLoginByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;

interface GetUserLoginByEmailRef {
  ...
  (dc: DataConnect, vars: GetUserLoginByEmailVariables): QueryRef<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;
}
export const getUserLoginByEmailRef: GetUserLoginByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserLoginByEmailRef:
```typescript
const name = getUserLoginByEmailRef.operationName;
console.log(name);
```

### Variables
The `getUserLoginByEmail` query requires an argument of type `GetUserLoginByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserLoginByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `getUserLoginByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserLoginByEmailData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserLoginByEmailData {
  userLogins: ({
    firebaseUid: string;
    email: string;
    displayName?: string | null;
    role: string;
  } & UserLogin_Key)[];
}
```
### Using `getUserLoginByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserLoginByEmail, GetUserLoginByEmailVariables } from '@dataconnect/generated';

// The `getUserLoginByEmail` query requires an argument of type `GetUserLoginByEmailVariables`:
const getUserLoginByEmailVars: GetUserLoginByEmailVariables = {
  email: ..., 
};

// Call the `getUserLoginByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserLoginByEmail(getUserLoginByEmailVars);
// Variables can be defined inline as well.
const { data } = await getUserLoginByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserLoginByEmail(dataConnect, getUserLoginByEmailVars);

console.log(data.userLogins);

// Or, you can use the `Promise` API.
getUserLoginByEmail(getUserLoginByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.userLogins);
});
```

### Using `getUserLoginByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserLoginByEmailRef, GetUserLoginByEmailVariables } from '@dataconnect/generated';

// The `getUserLoginByEmail` query requires an argument of type `GetUserLoginByEmailVariables`:
const getUserLoginByEmailVars: GetUserLoginByEmailVariables = {
  email: ..., 
};

// Call the `getUserLoginByEmailRef()` function to get a reference to the query.
const ref = getUserLoginByEmailRef(getUserLoginByEmailVars);
// Variables can be defined inline as well.
const ref = getUserLoginByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserLoginByEmailRef(dataConnect, getUserLoginByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userLogins);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userLogins);
});
```

## getGuestByUid
You can execute the `getGuestByUid` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getGuestByUid(vars: GetGuestByUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByUidData, GetGuestByUidVariables>;

interface GetGuestByUidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGuestByUidVariables): QueryRef<GetGuestByUidData, GetGuestByUidVariables>;
}
export const getGuestByUidRef: GetGuestByUidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getGuestByUid(dc: DataConnect, vars: GetGuestByUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByUidData, GetGuestByUidVariables>;

interface GetGuestByUidRef {
  ...
  (dc: DataConnect, vars: GetGuestByUidVariables): QueryRef<GetGuestByUidData, GetGuestByUidVariables>;
}
export const getGuestByUidRef: GetGuestByUidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getGuestByUidRef:
```typescript
const name = getGuestByUidRef.operationName;
console.log(name);
```

### Variables
The `getGuestByUid` query requires an argument of type `GetGuestByUidVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetGuestByUidVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `getGuestByUid` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetGuestByUidData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getGuestByUid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getGuestByUid, GetGuestByUidVariables } from '@dataconnect/generated';

// The `getGuestByUid` query requires an argument of type `GetGuestByUidVariables`:
const getGuestByUidVars: GetGuestByUidVariables = {
  uid: ..., 
};

// Call the `getGuestByUid()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getGuestByUid(getGuestByUidVars);
// Variables can be defined inline as well.
const { data } = await getGuestByUid({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getGuestByUid(dataConnect, getGuestByUidVars);

console.log(data.guests);

// Or, you can use the `Promise` API.
getGuestByUid(getGuestByUidVars).then((response) => {
  const data = response.data;
  console.log(data.guests);
});
```

### Using `getGuestByUid`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getGuestByUidRef, GetGuestByUidVariables } from '@dataconnect/generated';

// The `getGuestByUid` query requires an argument of type `GetGuestByUidVariables`:
const getGuestByUidVars: GetGuestByUidVariables = {
  uid: ..., 
};

// Call the `getGuestByUidRef()` function to get a reference to the query.
const ref = getGuestByUidRef(getGuestByUidVars);
// Variables can be defined inline as well.
const ref = getGuestByUidRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getGuestByUidRef(dataConnect, getGuestByUidVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.guests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.guests);
});
```

## getGuestByEmail
You can execute the `getGuestByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getGuestByEmail(vars: GetGuestByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByEmailData, GetGuestByEmailVariables>;

interface GetGuestByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGuestByEmailVariables): QueryRef<GetGuestByEmailData, GetGuestByEmailVariables>;
}
export const getGuestByEmailRef: GetGuestByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getGuestByEmail(dc: DataConnect, vars: GetGuestByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByEmailData, GetGuestByEmailVariables>;

interface GetGuestByEmailRef {
  ...
  (dc: DataConnect, vars: GetGuestByEmailVariables): QueryRef<GetGuestByEmailData, GetGuestByEmailVariables>;
}
export const getGuestByEmailRef: GetGuestByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getGuestByEmailRef:
```typescript
const name = getGuestByEmailRef.operationName;
console.log(name);
```

### Variables
The `getGuestByEmail` query requires an argument of type `GetGuestByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetGuestByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `getGuestByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetGuestByEmailData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getGuestByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getGuestByEmail, GetGuestByEmailVariables } from '@dataconnect/generated';

// The `getGuestByEmail` query requires an argument of type `GetGuestByEmailVariables`:
const getGuestByEmailVars: GetGuestByEmailVariables = {
  email: ..., 
};

// Call the `getGuestByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getGuestByEmail(getGuestByEmailVars);
// Variables can be defined inline as well.
const { data } = await getGuestByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getGuestByEmail(dataConnect, getGuestByEmailVars);

console.log(data.guests);

// Or, you can use the `Promise` API.
getGuestByEmail(getGuestByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.guests);
});
```

### Using `getGuestByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getGuestByEmailRef, GetGuestByEmailVariables } from '@dataconnect/generated';

// The `getGuestByEmail` query requires an argument of type `GetGuestByEmailVariables`:
const getGuestByEmailVars: GetGuestByEmailVariables = {
  email: ..., 
};

// Call the `getGuestByEmailRef()` function to get a reference to the query.
const ref = getGuestByEmailRef(getGuestByEmailVars);
// Variables can be defined inline as well.
const ref = getGuestByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getGuestByEmailRef(dataConnect, getGuestByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.guests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.guests);
});
```

## getStaffByUid
You can execute the `getStaffByUid` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStaffByUid(vars: GetStaffByUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByUidData, GetStaffByUidVariables>;

interface GetStaffByUidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByUidVariables): QueryRef<GetStaffByUidData, GetStaffByUidVariables>;
}
export const getStaffByUidRef: GetStaffByUidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStaffByUid(dc: DataConnect, vars: GetStaffByUidVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByUidData, GetStaffByUidVariables>;

interface GetStaffByUidRef {
  ...
  (dc: DataConnect, vars: GetStaffByUidVariables): QueryRef<GetStaffByUidData, GetStaffByUidVariables>;
}
export const getStaffByUidRef: GetStaffByUidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStaffByUidRef:
```typescript
const name = getStaffByUidRef.operationName;
console.log(name);
```

### Variables
The `getStaffByUid` query requires an argument of type `GetStaffByUidVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStaffByUidVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `getStaffByUid` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStaffByUidData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getStaffByUid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStaffByUid, GetStaffByUidVariables } from '@dataconnect/generated';

// The `getStaffByUid` query requires an argument of type `GetStaffByUidVariables`:
const getStaffByUidVars: GetStaffByUidVariables = {
  uid: ..., 
};

// Call the `getStaffByUid()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStaffByUid(getStaffByUidVars);
// Variables can be defined inline as well.
const { data } = await getStaffByUid({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStaffByUid(dataConnect, getStaffByUidVars);

console.log(data.staffs);

// Or, you can use the `Promise` API.
getStaffByUid(getStaffByUidVars).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

### Using `getStaffByUid`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStaffByUidRef, GetStaffByUidVariables } from '@dataconnect/generated';

// The `getStaffByUid` query requires an argument of type `GetStaffByUidVariables`:
const getStaffByUidVars: GetStaffByUidVariables = {
  uid: ..., 
};

// Call the `getStaffByUidRef()` function to get a reference to the query.
const ref = getStaffByUidRef(getStaffByUidVars);
// Variables can be defined inline as well.
const ref = getStaffByUidRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStaffByUidRef(dataConnect, getStaffByUidVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.staffs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

## getStaffByEmail
You can execute the `getStaffByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStaffByEmail(vars: GetStaffByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByEmailData, GetStaffByEmailVariables>;

interface GetStaffByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByEmailVariables): QueryRef<GetStaffByEmailData, GetStaffByEmailVariables>;
}
export const getStaffByEmailRef: GetStaffByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStaffByEmail(dc: DataConnect, vars: GetStaffByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByEmailData, GetStaffByEmailVariables>;

interface GetStaffByEmailRef {
  ...
  (dc: DataConnect, vars: GetStaffByEmailVariables): QueryRef<GetStaffByEmailData, GetStaffByEmailVariables>;
}
export const getStaffByEmailRef: GetStaffByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStaffByEmailRef:
```typescript
const name = getStaffByEmailRef.operationName;
console.log(name);
```

### Variables
The `getStaffByEmail` query requires an argument of type `GetStaffByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStaffByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `getStaffByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStaffByEmailData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getStaffByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStaffByEmail, GetStaffByEmailVariables } from '@dataconnect/generated';

// The `getStaffByEmail` query requires an argument of type `GetStaffByEmailVariables`:
const getStaffByEmailVars: GetStaffByEmailVariables = {
  email: ..., 
};

// Call the `getStaffByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStaffByEmail(getStaffByEmailVars);
// Variables can be defined inline as well.
const { data } = await getStaffByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStaffByEmail(dataConnect, getStaffByEmailVars);

console.log(data.staffs);

// Or, you can use the `Promise` API.
getStaffByEmail(getStaffByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

### Using `getStaffByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStaffByEmailRef, GetStaffByEmailVariables } from '@dataconnect/generated';

// The `getStaffByEmail` query requires an argument of type `GetStaffByEmailVariables`:
const getStaffByEmailVars: GetStaffByEmailVariables = {
  email: ..., 
};

// Call the `getStaffByEmailRef()` function to get a reference to the query.
const ref = getStaffByEmailRef(getStaffByEmailVars);
// Variables can be defined inline as well.
const ref = getStaffByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStaffByEmailRef(dataConnect, getStaffByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.staffs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

## listActiveIncidents
You can execute the `listActiveIncidents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listActiveIncidents(options?: ExecuteQueryOptions): QueryPromise<ListActiveIncidentsData, undefined>;

interface ListActiveIncidentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListActiveIncidentsData, undefined>;
}
export const listActiveIncidentsRef: ListActiveIncidentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listActiveIncidents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListActiveIncidentsData, undefined>;

interface ListActiveIncidentsRef {
  ...
  (dc: DataConnect): QueryRef<ListActiveIncidentsData, undefined>;
}
export const listActiveIncidentsRef: ListActiveIncidentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listActiveIncidentsRef:
```typescript
const name = listActiveIncidentsRef.operationName;
console.log(name);
```

### Variables
The `listActiveIncidents` query has no variables.
### Return Type
Recall that executing the `listActiveIncidents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListActiveIncidentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `listActiveIncidents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listActiveIncidents } from '@dataconnect/generated';


// Call the `listActiveIncidents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listActiveIncidents();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listActiveIncidents(dataConnect);

console.log(data.incidents);

// Or, you can use the `Promise` API.
listActiveIncidents().then((response) => {
  const data = response.data;
  console.log(data.incidents);
});
```

### Using `listActiveIncidents`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listActiveIncidentsRef } from '@dataconnect/generated';


// Call the `listActiveIncidentsRef()` function to get a reference to the query.
const ref = listActiveIncidentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listActiveIncidentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.incidents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.incidents);
});
```

## listIncidents
You can execute the `listIncidents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listIncidents(options?: ExecuteQueryOptions): QueryPromise<ListIncidentsData, undefined>;

interface ListIncidentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListIncidentsData, undefined>;
}
export const listIncidentsRef: ListIncidentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listIncidents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListIncidentsData, undefined>;

interface ListIncidentsRef {
  ...
  (dc: DataConnect): QueryRef<ListIncidentsData, undefined>;
}
export const listIncidentsRef: ListIncidentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listIncidentsRef:
```typescript
const name = listIncidentsRef.operationName;
console.log(name);
```

### Variables
The `listIncidents` query has no variables.
### Return Type
Recall that executing the `listIncidents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListIncidentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `listIncidents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listIncidents } from '@dataconnect/generated';


// Call the `listIncidents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listIncidents();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listIncidents(dataConnect);

console.log(data.incidents);

// Or, you can use the `Promise` API.
listIncidents().then((response) => {
  const data = response.data;
  console.log(data.incidents);
});
```

### Using `listIncidents`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listIncidentsRef } from '@dataconnect/generated';


// Call the `listIncidentsRef()` function to get a reference to the query.
const ref = listIncidentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listIncidentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.incidents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.incidents);
});
```

## listRooms
You can execute the `listRooms` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listRooms(options?: ExecuteQueryOptions): QueryPromise<ListRoomsData, undefined>;

interface ListRoomsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRoomsData, undefined>;
}
export const listRoomsRef: ListRoomsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listRooms(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRoomsData, undefined>;

interface ListRoomsRef {
  ...
  (dc: DataConnect): QueryRef<ListRoomsData, undefined>;
}
export const listRoomsRef: ListRoomsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listRoomsRef:
```typescript
const name = listRoomsRef.operationName;
console.log(name);
```

### Variables
The `listRooms` query has no variables.
### Return Type
Recall that executing the `listRooms` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListRoomsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `listRooms`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listRooms } from '@dataconnect/generated';


// Call the `listRooms()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listRooms();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listRooms(dataConnect);

console.log(data.rooms);

// Or, you can use the `Promise` API.
listRooms().then((response) => {
  const data = response.data;
  console.log(data.rooms);
});
```

### Using `listRooms`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listRoomsRef } from '@dataconnect/generated';


// Call the `listRoomsRef()` function to get a reference to the query.
const ref = listRoomsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listRoomsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.rooms);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.rooms);
});
```

## listGuests
You can execute the `listGuests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listGuests(options?: ExecuteQueryOptions): QueryPromise<ListGuestsData, undefined>;

interface ListGuestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListGuestsData, undefined>;
}
export const listGuestsRef: ListGuestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listGuests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListGuestsData, undefined>;

interface ListGuestsRef {
  ...
  (dc: DataConnect): QueryRef<ListGuestsData, undefined>;
}
export const listGuestsRef: ListGuestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listGuestsRef:
```typescript
const name = listGuestsRef.operationName;
console.log(name);
```

### Variables
The `listGuests` query has no variables.
### Return Type
Recall that executing the `listGuests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListGuestsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `listGuests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listGuests } from '@dataconnect/generated';


// Call the `listGuests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listGuests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listGuests(dataConnect);

console.log(data.guests);

// Or, you can use the `Promise` API.
listGuests().then((response) => {
  const data = response.data;
  console.log(data.guests);
});
```

### Using `listGuests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listGuestsRef } from '@dataconnect/generated';


// Call the `listGuestsRef()` function to get a reference to the query.
const ref = listGuestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listGuestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.guests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.guests);
});
```

## listStaff
You can execute the `listStaff` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listStaff(options?: ExecuteQueryOptions): QueryPromise<ListStaffData, undefined>;

interface ListStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStaffData, undefined>;
}
export const listStaffRef: ListStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStaff(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListStaffData, undefined>;

interface ListStaffRef {
  ...
  (dc: DataConnect): QueryRef<ListStaffData, undefined>;
}
export const listStaffRef: ListStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStaffRef:
```typescript
const name = listStaffRef.operationName;
console.log(name);
```

### Variables
The `listStaff` query has no variables.
### Return Type
Recall that executing the `listStaff` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStaffData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `listStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStaff } from '@dataconnect/generated';


// Call the `listStaff()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStaff();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStaff(dataConnect);

console.log(data.staffs);

// Or, you can use the `Promise` API.
listStaff().then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

### Using `listStaff`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStaffRef } from '@dataconnect/generated';


// Call the `listStaffRef()` function to get a reference to the query.
const ref = listStaffRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStaffRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.staffs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

## getStaffByEmployeeId
You can execute the `getStaffByEmployeeId` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStaffByEmployeeId(vars: GetStaffByEmployeeIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;

interface GetStaffByEmployeeIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByEmployeeIdVariables): QueryRef<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;
}
export const getStaffByEmployeeIdRef: GetStaffByEmployeeIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStaffByEmployeeId(dc: DataConnect, vars: GetStaffByEmployeeIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;

interface GetStaffByEmployeeIdRef {
  ...
  (dc: DataConnect, vars: GetStaffByEmployeeIdVariables): QueryRef<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;
}
export const getStaffByEmployeeIdRef: GetStaffByEmployeeIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStaffByEmployeeIdRef:
```typescript
const name = getStaffByEmployeeIdRef.operationName;
console.log(name);
```

### Variables
The `getStaffByEmployeeId` query requires an argument of type `GetStaffByEmployeeIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStaffByEmployeeIdVariables {
  employeeId: string;
}
```
### Return Type
Recall that executing the `getStaffByEmployeeId` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStaffByEmployeeIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getStaffByEmployeeId`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStaffByEmployeeId, GetStaffByEmployeeIdVariables } from '@dataconnect/generated';

// The `getStaffByEmployeeId` query requires an argument of type `GetStaffByEmployeeIdVariables`:
const getStaffByEmployeeIdVars: GetStaffByEmployeeIdVariables = {
  employeeId: ..., 
};

// Call the `getStaffByEmployeeId()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStaffByEmployeeId(getStaffByEmployeeIdVars);
// Variables can be defined inline as well.
const { data } = await getStaffByEmployeeId({ employeeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStaffByEmployeeId(dataConnect, getStaffByEmployeeIdVars);

console.log(data.staffs);

// Or, you can use the `Promise` API.
getStaffByEmployeeId(getStaffByEmployeeIdVars).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

### Using `getStaffByEmployeeId`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStaffByEmployeeIdRef, GetStaffByEmployeeIdVariables } from '@dataconnect/generated';

// The `getStaffByEmployeeId` query requires an argument of type `GetStaffByEmployeeIdVariables`:
const getStaffByEmployeeIdVars: GetStaffByEmployeeIdVariables = {
  employeeId: ..., 
};

// Call the `getStaffByEmployeeIdRef()` function to get a reference to the query.
const ref = getStaffByEmployeeIdRef(getStaffByEmployeeIdVars);
// Variables can be defined inline as well.
const ref = getStaffByEmployeeIdRef({ employeeId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStaffByEmployeeIdRef(dataConnect, getStaffByEmployeeIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.staffs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.staffs);
});
```

## getGuestByLoginToken
You can execute the `getGuestByLoginToken` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getGuestByLoginToken(vars: GetGuestByLoginTokenVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;

interface GetGuestByLoginTokenRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGuestByLoginTokenVariables): QueryRef<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;
}
export const getGuestByLoginTokenRef: GetGuestByLoginTokenRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getGuestByLoginToken(dc: DataConnect, vars: GetGuestByLoginTokenVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;

interface GetGuestByLoginTokenRef {
  ...
  (dc: DataConnect, vars: GetGuestByLoginTokenVariables): QueryRef<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;
}
export const getGuestByLoginTokenRef: GetGuestByLoginTokenRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getGuestByLoginTokenRef:
```typescript
const name = getGuestByLoginTokenRef.operationName;
console.log(name);
```

### Variables
The `getGuestByLoginToken` query requires an argument of type `GetGuestByLoginTokenVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetGuestByLoginTokenVariables {
  loginToken: string;
}
```
### Return Type
Recall that executing the `getGuestByLoginToken` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetGuestByLoginTokenData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getGuestByLoginToken`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getGuestByLoginToken, GetGuestByLoginTokenVariables } from '@dataconnect/generated';

// The `getGuestByLoginToken` query requires an argument of type `GetGuestByLoginTokenVariables`:
const getGuestByLoginTokenVars: GetGuestByLoginTokenVariables = {
  loginToken: ..., 
};

// Call the `getGuestByLoginToken()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getGuestByLoginToken(getGuestByLoginTokenVars);
// Variables can be defined inline as well.
const { data } = await getGuestByLoginToken({ loginToken: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getGuestByLoginToken(dataConnect, getGuestByLoginTokenVars);

console.log(data.guests);

// Or, you can use the `Promise` API.
getGuestByLoginToken(getGuestByLoginTokenVars).then((response) => {
  const data = response.data;
  console.log(data.guests);
});
```

### Using `getGuestByLoginToken`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getGuestByLoginTokenRef, GetGuestByLoginTokenVariables } from '@dataconnect/generated';

// The `getGuestByLoginToken` query requires an argument of type `GetGuestByLoginTokenVariables`:
const getGuestByLoginTokenVars: GetGuestByLoginTokenVariables = {
  loginToken: ..., 
};

// Call the `getGuestByLoginTokenRef()` function to get a reference to the query.
const ref = getGuestByLoginTokenRef(getGuestByLoginTokenVars);
// Variables can be defined inline as well.
const ref = getGuestByLoginTokenRef({ loginToken: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getGuestByLoginTokenRef(dataConnect, getGuestByLoginTokenVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.guests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.guests);
});
```

## getGuestById
You can execute the `getGuestById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getGuestById(vars: GetGuestByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByIdData, GetGuestByIdVariables>;

interface GetGuestByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetGuestByIdVariables): QueryRef<GetGuestByIdData, GetGuestByIdVariables>;
}
export const getGuestByIdRef: GetGuestByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getGuestById(dc: DataConnect, vars: GetGuestByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetGuestByIdData, GetGuestByIdVariables>;

interface GetGuestByIdRef {
  ...
  (dc: DataConnect, vars: GetGuestByIdVariables): QueryRef<GetGuestByIdData, GetGuestByIdVariables>;
}
export const getGuestByIdRef: GetGuestByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getGuestByIdRef:
```typescript
const name = getGuestByIdRef.operationName;
console.log(name);
```

### Variables
The `getGuestById` query requires an argument of type `GetGuestByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetGuestByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `getGuestById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetGuestByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getGuestById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getGuestById, GetGuestByIdVariables } from '@dataconnect/generated';

// The `getGuestById` query requires an argument of type `GetGuestByIdVariables`:
const getGuestByIdVars: GetGuestByIdVariables = {
  id: ..., 
};

// Call the `getGuestById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getGuestById(getGuestByIdVars);
// Variables can be defined inline as well.
const { data } = await getGuestById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getGuestById(dataConnect, getGuestByIdVars);

console.log(data.guest);

// Or, you can use the `Promise` API.
getGuestById(getGuestByIdVars).then((response) => {
  const data = response.data;
  console.log(data.guest);
});
```

### Using `getGuestById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getGuestByIdRef, GetGuestByIdVariables } from '@dataconnect/generated';

// The `getGuestById` query requires an argument of type `GetGuestByIdVariables`:
const getGuestByIdVars: GetGuestByIdVariables = {
  id: ..., 
};

// Call the `getGuestByIdRef()` function to get a reference to the query.
const ref = getGuestByIdRef(getGuestByIdVars);
// Variables can be defined inline as well.
const ref = getGuestByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getGuestByIdRef(dataConnect, getGuestByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.guest);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.guest);
});
```

## getRoomById
You can execute the `getRoomById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getRoomById(vars: GetRoomByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetRoomByIdData, GetRoomByIdVariables>;

interface GetRoomByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRoomByIdVariables): QueryRef<GetRoomByIdData, GetRoomByIdVariables>;
}
export const getRoomByIdRef: GetRoomByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getRoomById(dc: DataConnect, vars: GetRoomByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetRoomByIdData, GetRoomByIdVariables>;

interface GetRoomByIdRef {
  ...
  (dc: DataConnect, vars: GetRoomByIdVariables): QueryRef<GetRoomByIdData, GetRoomByIdVariables>;
}
export const getRoomByIdRef: GetRoomByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getRoomByIdRef:
```typescript
const name = getRoomByIdRef.operationName;
console.log(name);
```

### Variables
The `getRoomById` query requires an argument of type `GetRoomByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetRoomByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `getRoomById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRoomByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getRoomById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getRoomById, GetRoomByIdVariables } from '@dataconnect/generated';

// The `getRoomById` query requires an argument of type `GetRoomByIdVariables`:
const getRoomByIdVars: GetRoomByIdVariables = {
  id: ..., 
};

// Call the `getRoomById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRoomById(getRoomByIdVars);
// Variables can be defined inline as well.
const { data } = await getRoomById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRoomById(dataConnect, getRoomByIdVars);

console.log(data.room);

// Or, you can use the `Promise` API.
getRoomById(getRoomByIdVars).then((response) => {
  const data = response.data;
  console.log(data.room);
});
```

### Using `getRoomById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRoomByIdRef, GetRoomByIdVariables } from '@dataconnect/generated';

// The `getRoomById` query requires an argument of type `GetRoomByIdVariables`:
const getRoomByIdVars: GetRoomByIdVariables = {
  id: ..., 
};

// Call the `getRoomByIdRef()` function to get a reference to the query.
const ref = getRoomByIdRef(getRoomByIdVars);
// Variables can be defined inline as well.
const ref = getRoomByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRoomByIdRef(dataConnect, getRoomByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.room);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.room);
});
```

## getIncidentById
You can execute the `getIncidentById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getIncidentById(vars: GetIncidentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetIncidentByIdData, GetIncidentByIdVariables>;

interface GetIncidentByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetIncidentByIdVariables): QueryRef<GetIncidentByIdData, GetIncidentByIdVariables>;
}
export const getIncidentByIdRef: GetIncidentByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getIncidentById(dc: DataConnect, vars: GetIncidentByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetIncidentByIdData, GetIncidentByIdVariables>;

interface GetIncidentByIdRef {
  ...
  (dc: DataConnect, vars: GetIncidentByIdVariables): QueryRef<GetIncidentByIdData, GetIncidentByIdVariables>;
}
export const getIncidentByIdRef: GetIncidentByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getIncidentByIdRef:
```typescript
const name = getIncidentByIdRef.operationName;
console.log(name);
```

### Variables
The `getIncidentById` query requires an argument of type `GetIncidentByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetIncidentByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `getIncidentById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetIncidentByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getIncidentById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getIncidentById, GetIncidentByIdVariables } from '@dataconnect/generated';

// The `getIncidentById` query requires an argument of type `GetIncidentByIdVariables`:
const getIncidentByIdVars: GetIncidentByIdVariables = {
  id: ..., 
};

// Call the `getIncidentById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getIncidentById(getIncidentByIdVars);
// Variables can be defined inline as well.
const { data } = await getIncidentById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getIncidentById(dataConnect, getIncidentByIdVars);

console.log(data.incident);

// Or, you can use the `Promise` API.
getIncidentById(getIncidentByIdVars).then((response) => {
  const data = response.data;
  console.log(data.incident);
});
```

### Using `getIncidentById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getIncidentByIdRef, GetIncidentByIdVariables } from '@dataconnect/generated';

// The `getIncidentById` query requires an argument of type `GetIncidentByIdVariables`:
const getIncidentByIdVars: GetIncidentByIdVariables = {
  id: ..., 
};

// Call the `getIncidentByIdRef()` function to get a reference to the query.
const ref = getIncidentByIdRef(getIncidentByIdVars);
// Variables can be defined inline as well.
const ref = getIncidentByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getIncidentByIdRef(dataConnect, getIncidentByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.incident);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.incident);
});
```

## getStaffById
You can execute the `getStaffById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStaffById(vars: GetStaffByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByIdData, GetStaffByIdVariables>;

interface GetStaffByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStaffByIdVariables): QueryRef<GetStaffByIdData, GetStaffByIdVariables>;
}
export const getStaffByIdRef: GetStaffByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStaffById(dc: DataConnect, vars: GetStaffByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetStaffByIdData, GetStaffByIdVariables>;

interface GetStaffByIdRef {
  ...
  (dc: DataConnect, vars: GetStaffByIdVariables): QueryRef<GetStaffByIdData, GetStaffByIdVariables>;
}
export const getStaffByIdRef: GetStaffByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStaffByIdRef:
```typescript
const name = getStaffByIdRef.operationName;
console.log(name);
```

### Variables
The `getStaffById` query requires an argument of type `GetStaffByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStaffByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `getStaffById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStaffByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `getStaffById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStaffById, GetStaffByIdVariables } from '@dataconnect/generated';

// The `getStaffById` query requires an argument of type `GetStaffByIdVariables`:
const getStaffByIdVars: GetStaffByIdVariables = {
  id: ..., 
};

// Call the `getStaffById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStaffById(getStaffByIdVars);
// Variables can be defined inline as well.
const { data } = await getStaffById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStaffById(dataConnect, getStaffByIdVars);

console.log(data.staff);

// Or, you can use the `Promise` API.
getStaffById(getStaffByIdVars).then((response) => {
  const data = response.data;
  console.log(data.staff);
});
```

### Using `getStaffById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStaffByIdRef, GetStaffByIdVariables } from '@dataconnect/generated';

// The `getStaffById` query requires an argument of type `GetStaffByIdVariables`:
const getStaffByIdVars: GetStaffByIdVariables = {
  id: ..., 
};

// Call the `getStaffByIdRef()` function to get a reference to the query.
const ref = getStaffByIdRef(getStaffByIdVars);
// Variables can be defined inline as well.
const ref = getStaffByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStaffByIdRef(dataConnect, getStaffByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.staff);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.staff);
});
```

## listSecurityProfiles
You can execute the `listSecurityProfiles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listSecurityProfiles(options?: ExecuteQueryOptions): QueryPromise<ListSecurityProfilesData, undefined>;

interface ListSecurityProfilesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSecurityProfilesData, undefined>;
}
export const listSecurityProfilesRef: ListSecurityProfilesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listSecurityProfiles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSecurityProfilesData, undefined>;

interface ListSecurityProfilesRef {
  ...
  (dc: DataConnect): QueryRef<ListSecurityProfilesData, undefined>;
}
export const listSecurityProfilesRef: ListSecurityProfilesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listSecurityProfilesRef:
```typescript
const name = listSecurityProfilesRef.operationName;
console.log(name);
```

### Variables
The `listSecurityProfiles` query has no variables.
### Return Type
Recall that executing the `listSecurityProfiles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListSecurityProfilesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `listSecurityProfiles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listSecurityProfiles } from '@dataconnect/generated';


// Call the `listSecurityProfiles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listSecurityProfiles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listSecurityProfiles(dataConnect);

console.log(data.securityProfiles);

// Or, you can use the `Promise` API.
listSecurityProfiles().then((response) => {
  const data = response.data;
  console.log(data.securityProfiles);
});
```

### Using `listSecurityProfiles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listSecurityProfilesRef } from '@dataconnect/generated';


// Call the `listSecurityProfilesRef()` function to get a reference to the query.
const ref = listSecurityProfilesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listSecurityProfilesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.securityProfiles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.securityProfiles);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## upsertUserLogin
You can execute the `upsertUserLogin` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertUserLogin(vars: UpsertUserLoginVariables): MutationPromise<UpsertUserLoginData, UpsertUserLoginVariables>;

interface UpsertUserLoginRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserLoginVariables): MutationRef<UpsertUserLoginData, UpsertUserLoginVariables>;
}
export const upsertUserLoginRef: UpsertUserLoginRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUserLogin(dc: DataConnect, vars: UpsertUserLoginVariables): MutationPromise<UpsertUserLoginData, UpsertUserLoginVariables>;

interface UpsertUserLoginRef {
  ...
  (dc: DataConnect, vars: UpsertUserLoginVariables): MutationRef<UpsertUserLoginData, UpsertUserLoginVariables>;
}
export const upsertUserLoginRef: UpsertUserLoginRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserLoginRef:
```typescript
const name = upsertUserLoginRef.operationName;
console.log(name);
```

### Variables
The `upsertUserLogin` mutation requires an argument of type `UpsertUserLoginVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserLoginVariables {
  firebaseUid: string;
  email: string;
  displayName?: string | null;
  role: string;
}
```
### Return Type
Recall that executing the `upsertUserLogin` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserLoginData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserLoginData {
  userLogin_upsert: UserLogin_Key;
}
```
### Using `upsertUserLogin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUserLogin, UpsertUserLoginVariables } from '@dataconnect/generated';

// The `upsertUserLogin` mutation requires an argument of type `UpsertUserLoginVariables`:
const upsertUserLoginVars: UpsertUserLoginVariables = {
  firebaseUid: ..., 
  email: ..., 
  displayName: ..., // optional
  role: ..., 
};

// Call the `upsertUserLogin()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUserLogin(upsertUserLoginVars);
// Variables can be defined inline as well.
const { data } = await upsertUserLogin({ firebaseUid: ..., email: ..., displayName: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUserLogin(dataConnect, upsertUserLoginVars);

console.log(data.userLogin_upsert);

// Or, you can use the `Promise` API.
upsertUserLogin(upsertUserLoginVars).then((response) => {
  const data = response.data;
  console.log(data.userLogin_upsert);
});
```

### Using `upsertUserLogin`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserLoginRef, UpsertUserLoginVariables } from '@dataconnect/generated';

// The `upsertUserLogin` mutation requires an argument of type `UpsertUserLoginVariables`:
const upsertUserLoginVars: UpsertUserLoginVariables = {
  firebaseUid: ..., 
  email: ..., 
  displayName: ..., // optional
  role: ..., 
};

// Call the `upsertUserLoginRef()` function to get a reference to the mutation.
const ref = upsertUserLoginRef(upsertUserLoginVars);
// Variables can be defined inline as well.
const ref = upsertUserLoginRef({ firebaseUid: ..., email: ..., displayName: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserLoginRef(dataConnect, upsertUserLoginVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userLogin_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userLogin_upsert);
});
```

## createGuest
You can execute the `createGuest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createGuest(vars: CreateGuestVariables): MutationPromise<CreateGuestData, CreateGuestVariables>;

interface CreateGuestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGuestVariables): MutationRef<CreateGuestData, CreateGuestVariables>;
}
export const createGuestRef: CreateGuestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createGuest(dc: DataConnect, vars: CreateGuestVariables): MutationPromise<CreateGuestData, CreateGuestVariables>;

interface CreateGuestRef {
  ...
  (dc: DataConnect, vars: CreateGuestVariables): MutationRef<CreateGuestData, CreateGuestVariables>;
}
export const createGuestRef: CreateGuestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createGuestRef:
```typescript
const name = createGuestRef.operationName;
console.log(name);
```

### Variables
The `createGuest` mutation requires an argument of type `CreateGuestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateGuestVariables {
  firebaseUid?: string | null;
  email?: string | null;
  name: string;
  roomNumber?: string | null;
  status: string;
  checkOut: TimestampString;
  photoUrl?: string | null;
}
```
### Return Type
Recall that executing the `createGuest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateGuestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateGuestData {
  guest_insert: Guest_Key;
}
```
### Using `createGuest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createGuest, CreateGuestVariables } from '@dataconnect/generated';

// The `createGuest` mutation requires an argument of type `CreateGuestVariables`:
const createGuestVars: CreateGuestVariables = {
  firebaseUid: ..., // optional
  email: ..., // optional
  name: ..., 
  roomNumber: ..., // optional
  status: ..., 
  checkOut: ..., 
  photoUrl: ..., // optional
};

// Call the `createGuest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createGuest(createGuestVars);
// Variables can be defined inline as well.
const { data } = await createGuest({ firebaseUid: ..., email: ..., name: ..., roomNumber: ..., status: ..., checkOut: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createGuest(dataConnect, createGuestVars);

console.log(data.guest_insert);

// Or, you can use the `Promise` API.
createGuest(createGuestVars).then((response) => {
  const data = response.data;
  console.log(data.guest_insert);
});
```

### Using `createGuest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createGuestRef, CreateGuestVariables } from '@dataconnect/generated';

// The `createGuest` mutation requires an argument of type `CreateGuestVariables`:
const createGuestVars: CreateGuestVariables = {
  firebaseUid: ..., // optional
  email: ..., // optional
  name: ..., 
  roomNumber: ..., // optional
  status: ..., 
  checkOut: ..., 
  photoUrl: ..., // optional
};

// Call the `createGuestRef()` function to get a reference to the mutation.
const ref = createGuestRef(createGuestVars);
// Variables can be defined inline as well.
const ref = createGuestRef({ firebaseUid: ..., email: ..., name: ..., roomNumber: ..., status: ..., checkOut: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createGuestRef(dataConnect, createGuestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.guest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.guest_insert);
});
```

## updateGuest
You can execute the `updateGuest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateGuest(vars: UpdateGuestVariables): MutationPromise<UpdateGuestData, UpdateGuestVariables>;

interface UpdateGuestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGuestVariables): MutationRef<UpdateGuestData, UpdateGuestVariables>;
}
export const updateGuestRef: UpdateGuestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateGuest(dc: DataConnect, vars: UpdateGuestVariables): MutationPromise<UpdateGuestData, UpdateGuestVariables>;

interface UpdateGuestRef {
  ...
  (dc: DataConnect, vars: UpdateGuestVariables): MutationRef<UpdateGuestData, UpdateGuestVariables>;
}
export const updateGuestRef: UpdateGuestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateGuestRef:
```typescript
const name = updateGuestRef.operationName;
console.log(name);
```

### Variables
The `updateGuest` mutation requires an argument of type `UpdateGuestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `updateGuest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateGuestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateGuestData {
  guest_update?: Guest_Key | null;
}
```
### Using `updateGuest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateGuest, UpdateGuestVariables } from '@dataconnect/generated';

// The `updateGuest` mutation requires an argument of type `UpdateGuestVariables`:
const updateGuestVars: UpdateGuestVariables = {
  id: ..., 
  name: ..., // optional
  email: ..., // optional
  firebaseUid: ..., // optional
  status: ..., // optional
  roomNumber: ..., // optional
  loginToken: ..., // optional
  roomId: ..., // optional
  qrPayload: ..., // optional
  idNumber: ..., // optional
  contact: ..., // optional
  address: ..., // optional
  checkOut: ..., // optional
  loginEmail: ..., // optional
  loginPassword: ..., // optional
  photoUrl: ..., // optional
};

// Call the `updateGuest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateGuest(updateGuestVars);
// Variables can be defined inline as well.
const { data } = await updateGuest({ id: ..., name: ..., email: ..., firebaseUid: ..., status: ..., roomNumber: ..., loginToken: ..., roomId: ..., qrPayload: ..., idNumber: ..., contact: ..., address: ..., checkOut: ..., loginEmail: ..., loginPassword: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateGuest(dataConnect, updateGuestVars);

console.log(data.guest_update);

// Or, you can use the `Promise` API.
updateGuest(updateGuestVars).then((response) => {
  const data = response.data;
  console.log(data.guest_update);
});
```

### Using `updateGuest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateGuestRef, UpdateGuestVariables } from '@dataconnect/generated';

// The `updateGuest` mutation requires an argument of type `UpdateGuestVariables`:
const updateGuestVars: UpdateGuestVariables = {
  id: ..., 
  name: ..., // optional
  email: ..., // optional
  firebaseUid: ..., // optional
  status: ..., // optional
  roomNumber: ..., // optional
  loginToken: ..., // optional
  roomId: ..., // optional
  qrPayload: ..., // optional
  idNumber: ..., // optional
  contact: ..., // optional
  address: ..., // optional
  checkOut: ..., // optional
  loginEmail: ..., // optional
  loginPassword: ..., // optional
  photoUrl: ..., // optional
};

// Call the `updateGuestRef()` function to get a reference to the mutation.
const ref = updateGuestRef(updateGuestVars);
// Variables can be defined inline as well.
const ref = updateGuestRef({ id: ..., name: ..., email: ..., firebaseUid: ..., status: ..., roomNumber: ..., loginToken: ..., roomId: ..., qrPayload: ..., idNumber: ..., contact: ..., address: ..., checkOut: ..., loginEmail: ..., loginPassword: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateGuestRef(dataConnect, updateGuestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.guest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.guest_update);
});
```

## createStaff
You can execute the `createStaff` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createStaff(vars: CreateStaffVariables): MutationPromise<CreateStaffData, CreateStaffVariables>;

interface CreateStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStaffVariables): MutationRef<CreateStaffData, CreateStaffVariables>;
}
export const createStaffRef: CreateStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStaff(dc: DataConnect, vars: CreateStaffVariables): MutationPromise<CreateStaffData, CreateStaffVariables>;

interface CreateStaffRef {
  ...
  (dc: DataConnect, vars: CreateStaffVariables): MutationRef<CreateStaffData, CreateStaffVariables>;
}
export const createStaffRef: CreateStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStaffRef:
```typescript
const name = createStaffRef.operationName;
console.log(name);
```

### Variables
The `createStaff` mutation requires an argument of type `CreateStaffVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `createStaff` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStaffData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStaffData {
  staff_insert: Staff_Key;
}
```
### Using `createStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStaff, CreateStaffVariables } from '@dataconnect/generated';

// The `createStaff` mutation requires an argument of type `CreateStaffVariables`:
const createStaffVars: CreateStaffVariables = {
  firebaseUid: ..., // optional
  email: ..., // optional
  loginPassword: ..., // optional
  name: ..., 
  role: ..., 
  status: ..., 
  employeeId: ..., // optional
  department: ..., // optional
  phone: ..., // optional
  emergencyContact: ..., // optional
  bloodGroup: ..., // optional
  joiningDate: ..., // optional
  validTill: ..., // optional
  photoUrl: ..., // optional
};

// Call the `createStaff()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStaff(createStaffVars);
// Variables can be defined inline as well.
const { data } = await createStaff({ firebaseUid: ..., email: ..., loginPassword: ..., name: ..., role: ..., status: ..., employeeId: ..., department: ..., phone: ..., emergencyContact: ..., bloodGroup: ..., joiningDate: ..., validTill: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStaff(dataConnect, createStaffVars);

console.log(data.staff_insert);

// Or, you can use the `Promise` API.
createStaff(createStaffVars).then((response) => {
  const data = response.data;
  console.log(data.staff_insert);
});
```

### Using `createStaff`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStaffRef, CreateStaffVariables } from '@dataconnect/generated';

// The `createStaff` mutation requires an argument of type `CreateStaffVariables`:
const createStaffVars: CreateStaffVariables = {
  firebaseUid: ..., // optional
  email: ..., // optional
  loginPassword: ..., // optional
  name: ..., 
  role: ..., 
  status: ..., 
  employeeId: ..., // optional
  department: ..., // optional
  phone: ..., // optional
  emergencyContact: ..., // optional
  bloodGroup: ..., // optional
  joiningDate: ..., // optional
  validTill: ..., // optional
  photoUrl: ..., // optional
};

// Call the `createStaffRef()` function to get a reference to the mutation.
const ref = createStaffRef(createStaffVars);
// Variables can be defined inline as well.
const ref = createStaffRef({ firebaseUid: ..., email: ..., loginPassword: ..., name: ..., role: ..., status: ..., employeeId: ..., department: ..., phone: ..., emergencyContact: ..., bloodGroup: ..., joiningDate: ..., validTill: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStaffRef(dataConnect, createStaffVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staff_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staff_insert);
});
```

## updateStaff
You can execute the `updateStaff` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStaff(vars: UpdateStaffVariables): MutationPromise<UpdateStaffData, UpdateStaffVariables>;

interface UpdateStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffVariables): MutationRef<UpdateStaffData, UpdateStaffVariables>;
}
export const updateStaffRef: UpdateStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStaff(dc: DataConnect, vars: UpdateStaffVariables): MutationPromise<UpdateStaffData, UpdateStaffVariables>;

interface UpdateStaffRef {
  ...
  (dc: DataConnect, vars: UpdateStaffVariables): MutationRef<UpdateStaffData, UpdateStaffVariables>;
}
export const updateStaffRef: UpdateStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStaffRef:
```typescript
const name = updateStaffRef.operationName;
console.log(name);
```

### Variables
The `updateStaff` mutation requires an argument of type `UpdateStaffVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `updateStaff` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStaffData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStaffData {
  staff_update?: Staff_Key | null;
}
```
### Using `updateStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStaff, UpdateStaffVariables } from '@dataconnect/generated';

// The `updateStaff` mutation requires an argument of type `UpdateStaffVariables`:
const updateStaffVars: UpdateStaffVariables = {
  id: ..., 
  name: ..., // optional
  email: ..., // optional
  firebaseUid: ..., // optional
  role: ..., // optional
  department: ..., // optional
  status: ..., // optional
  phone: ..., // optional
  emergencyContact: ..., // optional
  bloodGroup: ..., // optional
  joiningDate: ..., // optional
  validTill: ..., // optional
  photoUrl: ..., // optional
  employeeId: ..., // optional
};

// Call the `updateStaff()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStaff(updateStaffVars);
// Variables can be defined inline as well.
const { data } = await updateStaff({ id: ..., name: ..., email: ..., firebaseUid: ..., role: ..., department: ..., status: ..., phone: ..., emergencyContact: ..., bloodGroup: ..., joiningDate: ..., validTill: ..., photoUrl: ..., employeeId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStaff(dataConnect, updateStaffVars);

console.log(data.staff_update);

// Or, you can use the `Promise` API.
updateStaff(updateStaffVars).then((response) => {
  const data = response.data;
  console.log(data.staff_update);
});
```

### Using `updateStaff`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStaffRef, UpdateStaffVariables } from '@dataconnect/generated';

// The `updateStaff` mutation requires an argument of type `UpdateStaffVariables`:
const updateStaffVars: UpdateStaffVariables = {
  id: ..., 
  name: ..., // optional
  email: ..., // optional
  firebaseUid: ..., // optional
  role: ..., // optional
  department: ..., // optional
  status: ..., // optional
  phone: ..., // optional
  emergencyContact: ..., // optional
  bloodGroup: ..., // optional
  joiningDate: ..., // optional
  validTill: ..., // optional
  photoUrl: ..., // optional
  employeeId: ..., // optional
};

// Call the `updateStaffRef()` function to get a reference to the mutation.
const ref = updateStaffRef(updateStaffVars);
// Variables can be defined inline as well.
const ref = updateStaffRef({ id: ..., name: ..., email: ..., firebaseUid: ..., role: ..., department: ..., status: ..., phone: ..., emergencyContact: ..., bloodGroup: ..., joiningDate: ..., validTill: ..., photoUrl: ..., employeeId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStaffRef(dataConnect, updateStaffVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staff_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staff_update);
});
```

## createIncident
You can execute the `createIncident` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createIncident(vars: CreateIncidentVariables): MutationPromise<CreateIncidentData, CreateIncidentVariables>;

interface CreateIncidentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIncidentVariables): MutationRef<CreateIncidentData, CreateIncidentVariables>;
}
export const createIncidentRef: CreateIncidentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createIncident(dc: DataConnect, vars: CreateIncidentVariables): MutationPromise<CreateIncidentData, CreateIncidentVariables>;

interface CreateIncidentRef {
  ...
  (dc: DataConnect, vars: CreateIncidentVariables): MutationRef<CreateIncidentData, CreateIncidentVariables>;
}
export const createIncidentRef: CreateIncidentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createIncidentRef:
```typescript
const name = createIncidentRef.operationName;
console.log(name);
```

### Variables
The `createIncident` mutation requires an argument of type `CreateIncidentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateIncidentVariables {
  title: string;
  severity: string;
  roomId?: string | null;
  description?: string | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `createIncident` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateIncidentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateIncidentData {
  incident_insert: Incident_Key;
}
```
### Using `createIncident`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createIncident, CreateIncidentVariables } from '@dataconnect/generated';

// The `createIncident` mutation requires an argument of type `CreateIncidentVariables`:
const createIncidentVars: CreateIncidentVariables = {
  title: ..., 
  severity: ..., 
  roomId: ..., // optional
  description: ..., // optional
  status: ..., // optional
};

// Call the `createIncident()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createIncident(createIncidentVars);
// Variables can be defined inline as well.
const { data } = await createIncident({ title: ..., severity: ..., roomId: ..., description: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createIncident(dataConnect, createIncidentVars);

console.log(data.incident_insert);

// Or, you can use the `Promise` API.
createIncident(createIncidentVars).then((response) => {
  const data = response.data;
  console.log(data.incident_insert);
});
```

### Using `createIncident`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createIncidentRef, CreateIncidentVariables } from '@dataconnect/generated';

// The `createIncident` mutation requires an argument of type `CreateIncidentVariables`:
const createIncidentVars: CreateIncidentVariables = {
  title: ..., 
  severity: ..., 
  roomId: ..., // optional
  description: ..., // optional
  status: ..., // optional
};

// Call the `createIncidentRef()` function to get a reference to the mutation.
const ref = createIncidentRef(createIncidentVars);
// Variables can be defined inline as well.
const ref = createIncidentRef({ title: ..., severity: ..., roomId: ..., description: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createIncidentRef(dataConnect, createIncidentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.incident_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.incident_insert);
});
```

## updateIncident
You can execute the `updateIncident` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateIncident(vars: UpdateIncidentVariables): MutationPromise<UpdateIncidentData, UpdateIncidentVariables>;

interface UpdateIncidentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateIncidentVariables): MutationRef<UpdateIncidentData, UpdateIncidentVariables>;
}
export const updateIncidentRef: UpdateIncidentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateIncident(dc: DataConnect, vars: UpdateIncidentVariables): MutationPromise<UpdateIncidentData, UpdateIncidentVariables>;

interface UpdateIncidentRef {
  ...
  (dc: DataConnect, vars: UpdateIncidentVariables): MutationRef<UpdateIncidentData, UpdateIncidentVariables>;
}
export const updateIncidentRef: UpdateIncidentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateIncidentRef:
```typescript
const name = updateIncidentRef.operationName;
console.log(name);
```

### Variables
The `updateIncident` mutation requires an argument of type `UpdateIncidentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateIncidentVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `updateIncident` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateIncidentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateIncidentData {
  incident_update?: Incident_Key | null;
}
```
### Using `updateIncident`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateIncident, UpdateIncidentVariables } from '@dataconnect/generated';

// The `updateIncident` mutation requires an argument of type `UpdateIncidentVariables`:
const updateIncidentVars: UpdateIncidentVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateIncident()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateIncident(updateIncidentVars);
// Variables can be defined inline as well.
const { data } = await updateIncident({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateIncident(dataConnect, updateIncidentVars);

console.log(data.incident_update);

// Or, you can use the `Promise` API.
updateIncident(updateIncidentVars).then((response) => {
  const data = response.data;
  console.log(data.incident_update);
});
```

### Using `updateIncident`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateIncidentRef, UpdateIncidentVariables } from '@dataconnect/generated';

// The `updateIncident` mutation requires an argument of type `UpdateIncidentVariables`:
const updateIncidentVars: UpdateIncidentVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateIncidentRef()` function to get a reference to the mutation.
const ref = updateIncidentRef(updateIncidentVars);
// Variables can be defined inline as well.
const ref = updateIncidentRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateIncidentRef(dataConnect, updateIncidentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.incident_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.incident_update);
});
```

## createRoom
You can execute the `createRoom` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createRoom(vars: CreateRoomVariables): MutationPromise<CreateRoomData, CreateRoomVariables>;

interface CreateRoomRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRoomVariables): MutationRef<CreateRoomData, CreateRoomVariables>;
}
export const createRoomRef: CreateRoomRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createRoom(dc: DataConnect, vars: CreateRoomVariables): MutationPromise<CreateRoomData, CreateRoomVariables>;

interface CreateRoomRef {
  ...
  (dc: DataConnect, vars: CreateRoomVariables): MutationRef<CreateRoomData, CreateRoomVariables>;
}
export const createRoomRef: CreateRoomRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createRoomRef:
```typescript
const name = createRoomRef.operationName;
console.log(name);
```

### Variables
The `createRoom` mutation requires an argument of type `CreateRoomVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateRoomVariables {
  number: string;
  floor: number;
  type: string;
  status: string;
}
```
### Return Type
Recall that executing the `createRoom` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateRoomData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateRoomData {
  room_insert: Room_Key;
}
```
### Using `createRoom`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createRoom, CreateRoomVariables } from '@dataconnect/generated';

// The `createRoom` mutation requires an argument of type `CreateRoomVariables`:
const createRoomVars: CreateRoomVariables = {
  number: ..., 
  floor: ..., 
  type: ..., 
  status: ..., 
};

// Call the `createRoom()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createRoom(createRoomVars);
// Variables can be defined inline as well.
const { data } = await createRoom({ number: ..., floor: ..., type: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createRoom(dataConnect, createRoomVars);

console.log(data.room_insert);

// Or, you can use the `Promise` API.
createRoom(createRoomVars).then((response) => {
  const data = response.data;
  console.log(data.room_insert);
});
```

### Using `createRoom`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createRoomRef, CreateRoomVariables } from '@dataconnect/generated';

// The `createRoom` mutation requires an argument of type `CreateRoomVariables`:
const createRoomVars: CreateRoomVariables = {
  number: ..., 
  floor: ..., 
  type: ..., 
  status: ..., 
};

// Call the `createRoomRef()` function to get a reference to the mutation.
const ref = createRoomRef(createRoomVars);
// Variables can be defined inline as well.
const ref = createRoomRef({ number: ..., floor: ..., type: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createRoomRef(dataConnect, createRoomVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.room_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.room_insert);
});
```

## updateRoom
You can execute the `updateRoom` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateRoom(vars: UpdateRoomVariables): MutationPromise<UpdateRoomData, UpdateRoomVariables>;

interface UpdateRoomRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRoomVariables): MutationRef<UpdateRoomData, UpdateRoomVariables>;
}
export const updateRoomRef: UpdateRoomRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateRoom(dc: DataConnect, vars: UpdateRoomVariables): MutationPromise<UpdateRoomData, UpdateRoomVariables>;

interface UpdateRoomRef {
  ...
  (dc: DataConnect, vars: UpdateRoomVariables): MutationRef<UpdateRoomData, UpdateRoomVariables>;
}
export const updateRoomRef: UpdateRoomRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateRoomRef:
```typescript
const name = updateRoomRef.operationName;
console.log(name);
```

### Variables
The `updateRoom` mutation requires an argument of type `UpdateRoomVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateRoomVariables {
  id: UUIDString;
  number?: string | null;
  floor?: number | null;
  type?: string | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `updateRoom` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateRoomData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateRoomData {
  room_update?: Room_Key | null;
}
```
### Using `updateRoom`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateRoom, UpdateRoomVariables } from '@dataconnect/generated';

// The `updateRoom` mutation requires an argument of type `UpdateRoomVariables`:
const updateRoomVars: UpdateRoomVariables = {
  id: ..., 
  number: ..., // optional
  floor: ..., // optional
  type: ..., // optional
  status: ..., // optional
};

// Call the `updateRoom()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateRoom(updateRoomVars);
// Variables can be defined inline as well.
const { data } = await updateRoom({ id: ..., number: ..., floor: ..., type: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateRoom(dataConnect, updateRoomVars);

console.log(data.room_update);

// Or, you can use the `Promise` API.
updateRoom(updateRoomVars).then((response) => {
  const data = response.data;
  console.log(data.room_update);
});
```

### Using `updateRoom`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateRoomRef, UpdateRoomVariables } from '@dataconnect/generated';

// The `updateRoom` mutation requires an argument of type `UpdateRoomVariables`:
const updateRoomVars: UpdateRoomVariables = {
  id: ..., 
  number: ..., // optional
  floor: ..., // optional
  type: ..., // optional
  status: ..., // optional
};

// Call the `updateRoomRef()` function to get a reference to the mutation.
const ref = updateRoomRef(updateRoomVars);
// Variables can be defined inline as well.
const ref = updateRoomRef({ id: ..., number: ..., floor: ..., type: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateRoomRef(dataConnect, updateRoomVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.room_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.room_update);
});
```

## deleteRoom
You can execute the `deleteRoom` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteRoom(vars: DeleteRoomVariables): MutationPromise<DeleteRoomData, DeleteRoomVariables>;

interface DeleteRoomRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteRoomVariables): MutationRef<DeleteRoomData, DeleteRoomVariables>;
}
export const deleteRoomRef: DeleteRoomRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteRoom(dc: DataConnect, vars: DeleteRoomVariables): MutationPromise<DeleteRoomData, DeleteRoomVariables>;

interface DeleteRoomRef {
  ...
  (dc: DataConnect, vars: DeleteRoomVariables): MutationRef<DeleteRoomData, DeleteRoomVariables>;
}
export const deleteRoomRef: DeleteRoomRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteRoomRef:
```typescript
const name = deleteRoomRef.operationName;
console.log(name);
```

### Variables
The `deleteRoom` mutation requires an argument of type `DeleteRoomVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteRoomVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `deleteRoom` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteRoomData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteRoomData {
  room_delete?: Room_Key | null;
}
```
### Using `deleteRoom`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteRoom, DeleteRoomVariables } from '@dataconnect/generated';

// The `deleteRoom` mutation requires an argument of type `DeleteRoomVariables`:
const deleteRoomVars: DeleteRoomVariables = {
  id: ..., 
};

// Call the `deleteRoom()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteRoom(deleteRoomVars);
// Variables can be defined inline as well.
const { data } = await deleteRoom({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteRoom(dataConnect, deleteRoomVars);

console.log(data.room_delete);

// Or, you can use the `Promise` API.
deleteRoom(deleteRoomVars).then((response) => {
  const data = response.data;
  console.log(data.room_delete);
});
```

### Using `deleteRoom`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteRoomRef, DeleteRoomVariables } from '@dataconnect/generated';

// The `deleteRoom` mutation requires an argument of type `DeleteRoomVariables`:
const deleteRoomVars: DeleteRoomVariables = {
  id: ..., 
};

// Call the `deleteRoomRef()` function to get a reference to the mutation.
const ref = deleteRoomRef(deleteRoomVars);
// Variables can be defined inline as well.
const ref = deleteRoomRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteRoomRef(dataConnect, deleteRoomVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.room_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.room_delete);
});
```

## deleteGuest
You can execute the `deleteGuest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteGuest(vars: DeleteGuestVariables): MutationPromise<DeleteGuestData, DeleteGuestVariables>;

interface DeleteGuestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGuestVariables): MutationRef<DeleteGuestData, DeleteGuestVariables>;
}
export const deleteGuestRef: DeleteGuestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteGuest(dc: DataConnect, vars: DeleteGuestVariables): MutationPromise<DeleteGuestData, DeleteGuestVariables>;

interface DeleteGuestRef {
  ...
  (dc: DataConnect, vars: DeleteGuestVariables): MutationRef<DeleteGuestData, DeleteGuestVariables>;
}
export const deleteGuestRef: DeleteGuestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteGuestRef:
```typescript
const name = deleteGuestRef.operationName;
console.log(name);
```

### Variables
The `deleteGuest` mutation requires an argument of type `DeleteGuestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteGuestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `deleteGuest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteGuestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteGuestData {
  guest_delete?: Guest_Key | null;
}
```
### Using `deleteGuest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteGuest, DeleteGuestVariables } from '@dataconnect/generated';

// The `deleteGuest` mutation requires an argument of type `DeleteGuestVariables`:
const deleteGuestVars: DeleteGuestVariables = {
  id: ..., 
};

// Call the `deleteGuest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteGuest(deleteGuestVars);
// Variables can be defined inline as well.
const { data } = await deleteGuest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteGuest(dataConnect, deleteGuestVars);

console.log(data.guest_delete);

// Or, you can use the `Promise` API.
deleteGuest(deleteGuestVars).then((response) => {
  const data = response.data;
  console.log(data.guest_delete);
});
```

### Using `deleteGuest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteGuestRef, DeleteGuestVariables } from '@dataconnect/generated';

// The `deleteGuest` mutation requires an argument of type `DeleteGuestVariables`:
const deleteGuestVars: DeleteGuestVariables = {
  id: ..., 
};

// Call the `deleteGuestRef()` function to get a reference to the mutation.
const ref = deleteGuestRef(deleteGuestVars);
// Variables can be defined inline as well.
const ref = deleteGuestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteGuestRef(dataConnect, deleteGuestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.guest_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.guest_delete);
});
```

## deleteStaff
You can execute the `deleteStaff` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteStaff(vars: DeleteStaffVariables): MutationPromise<DeleteStaffData, DeleteStaffVariables>;

interface DeleteStaffRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStaffVariables): MutationRef<DeleteStaffData, DeleteStaffVariables>;
}
export const deleteStaffRef: DeleteStaffRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteStaff(dc: DataConnect, vars: DeleteStaffVariables): MutationPromise<DeleteStaffData, DeleteStaffVariables>;

interface DeleteStaffRef {
  ...
  (dc: DataConnect, vars: DeleteStaffVariables): MutationRef<DeleteStaffData, DeleteStaffVariables>;
}
export const deleteStaffRef: DeleteStaffRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteStaffRef:
```typescript
const name = deleteStaffRef.operationName;
console.log(name);
```

### Variables
The `deleteStaff` mutation requires an argument of type `DeleteStaffVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteStaffVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `deleteStaff` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteStaffData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteStaffData {
  staff_delete?: Staff_Key | null;
}
```
### Using `deleteStaff`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteStaff, DeleteStaffVariables } from '@dataconnect/generated';

// The `deleteStaff` mutation requires an argument of type `DeleteStaffVariables`:
const deleteStaffVars: DeleteStaffVariables = {
  id: ..., 
};

// Call the `deleteStaff()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteStaff(deleteStaffVars);
// Variables can be defined inline as well.
const { data } = await deleteStaff({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteStaff(dataConnect, deleteStaffVars);

console.log(data.staff_delete);

// Or, you can use the `Promise` API.
deleteStaff(deleteStaffVars).then((response) => {
  const data = response.data;
  console.log(data.staff_delete);
});
```

### Using `deleteStaff`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteStaffRef, DeleteStaffVariables } from '@dataconnect/generated';

// The `deleteStaff` mutation requires an argument of type `DeleteStaffVariables`:
const deleteStaffVars: DeleteStaffVariables = {
  id: ..., 
};

// Call the `deleteStaffRef()` function to get a reference to the mutation.
const ref = deleteStaffRef(deleteStaffVars);
// Variables can be defined inline as well.
const ref = deleteStaffRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteStaffRef(dataConnect, deleteStaffVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staff_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staff_delete);
});
```

## deleteIncident
You can execute the `deleteIncident` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteIncident(vars: DeleteIncidentVariables): MutationPromise<DeleteIncidentData, DeleteIncidentVariables>;

interface DeleteIncidentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteIncidentVariables): MutationRef<DeleteIncidentData, DeleteIncidentVariables>;
}
export const deleteIncidentRef: DeleteIncidentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteIncident(dc: DataConnect, vars: DeleteIncidentVariables): MutationPromise<DeleteIncidentData, DeleteIncidentVariables>;

interface DeleteIncidentRef {
  ...
  (dc: DataConnect, vars: DeleteIncidentVariables): MutationRef<DeleteIncidentData, DeleteIncidentVariables>;
}
export const deleteIncidentRef: DeleteIncidentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteIncidentRef:
```typescript
const name = deleteIncidentRef.operationName;
console.log(name);
```

### Variables
The `deleteIncident` mutation requires an argument of type `DeleteIncidentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteIncidentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `deleteIncident` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteIncidentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteIncidentData {
  incident_delete?: Incident_Key | null;
}
```
### Using `deleteIncident`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteIncident, DeleteIncidentVariables } from '@dataconnect/generated';

// The `deleteIncident` mutation requires an argument of type `DeleteIncidentVariables`:
const deleteIncidentVars: DeleteIncidentVariables = {
  id: ..., 
};

// Call the `deleteIncident()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteIncident(deleteIncidentVars);
// Variables can be defined inline as well.
const { data } = await deleteIncident({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteIncident(dataConnect, deleteIncidentVars);

console.log(data.incident_delete);

// Or, you can use the `Promise` API.
deleteIncident(deleteIncidentVars).then((response) => {
  const data = response.data;
  console.log(data.incident_delete);
});
```

### Using `deleteIncident`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteIncidentRef, DeleteIncidentVariables } from '@dataconnect/generated';

// The `deleteIncident` mutation requires an argument of type `DeleteIncidentVariables`:
const deleteIncidentVars: DeleteIncidentVariables = {
  id: ..., 
};

// Call the `deleteIncidentRef()` function to get a reference to the mutation.
const ref = deleteIncidentRef(deleteIncidentVars);
// Variables can be defined inline as well.
const ref = deleteIncidentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteIncidentRef(dataConnect, deleteIncidentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.incident_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.incident_delete);
});
```

## updateGuestPassword
You can execute the `updateGuestPassword` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateGuestPassword(vars: UpdateGuestPasswordVariables): MutationPromise<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;

interface UpdateGuestPasswordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateGuestPasswordVariables): MutationRef<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;
}
export const updateGuestPasswordRef: UpdateGuestPasswordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateGuestPassword(dc: DataConnect, vars: UpdateGuestPasswordVariables): MutationPromise<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;

interface UpdateGuestPasswordRef {
  ...
  (dc: DataConnect, vars: UpdateGuestPasswordVariables): MutationRef<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;
}
export const updateGuestPasswordRef: UpdateGuestPasswordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateGuestPasswordRef:
```typescript
const name = updateGuestPasswordRef.operationName;
console.log(name);
```

### Variables
The `updateGuestPassword` mutation requires an argument of type `UpdateGuestPasswordVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateGuestPasswordVariables {
  id: UUIDString;
  loginPassword?: string | null;
}
```
### Return Type
Recall that executing the `updateGuestPassword` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateGuestPasswordData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateGuestPasswordData {
  guest_update?: Guest_Key | null;
}
```
### Using `updateGuestPassword`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateGuestPassword, UpdateGuestPasswordVariables } from '@dataconnect/generated';

// The `updateGuestPassword` mutation requires an argument of type `UpdateGuestPasswordVariables`:
const updateGuestPasswordVars: UpdateGuestPasswordVariables = {
  id: ..., 
  loginPassword: ..., // optional
};

// Call the `updateGuestPassword()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateGuestPassword(updateGuestPasswordVars);
// Variables can be defined inline as well.
const { data } = await updateGuestPassword({ id: ..., loginPassword: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateGuestPassword(dataConnect, updateGuestPasswordVars);

console.log(data.guest_update);

// Or, you can use the `Promise` API.
updateGuestPassword(updateGuestPasswordVars).then((response) => {
  const data = response.data;
  console.log(data.guest_update);
});
```

### Using `updateGuestPassword`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateGuestPasswordRef, UpdateGuestPasswordVariables } from '@dataconnect/generated';

// The `updateGuestPassword` mutation requires an argument of type `UpdateGuestPasswordVariables`:
const updateGuestPasswordVars: UpdateGuestPasswordVariables = {
  id: ..., 
  loginPassword: ..., // optional
};

// Call the `updateGuestPasswordRef()` function to get a reference to the mutation.
const ref = updateGuestPasswordRef(updateGuestPasswordVars);
// Variables can be defined inline as well.
const ref = updateGuestPasswordRef({ id: ..., loginPassword: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateGuestPasswordRef(dataConnect, updateGuestPasswordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.guest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.guest_update);
});
```

## updateStaffPassword
You can execute the `updateStaffPassword` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStaffPassword(vars: UpdateStaffPasswordVariables): MutationPromise<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;

interface UpdateStaffPasswordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffPasswordVariables): MutationRef<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;
}
export const updateStaffPasswordRef: UpdateStaffPasswordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStaffPassword(dc: DataConnect, vars: UpdateStaffPasswordVariables): MutationPromise<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;

interface UpdateStaffPasswordRef {
  ...
  (dc: DataConnect, vars: UpdateStaffPasswordVariables): MutationRef<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;
}
export const updateStaffPasswordRef: UpdateStaffPasswordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStaffPasswordRef:
```typescript
const name = updateStaffPasswordRef.operationName;
console.log(name);
```

### Variables
The `updateStaffPassword` mutation requires an argument of type `UpdateStaffPasswordVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStaffPasswordVariables {
  id: UUIDString;
  loginPassword?: string | null;
}
```
### Return Type
Recall that executing the `updateStaffPassword` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStaffPasswordData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStaffPasswordData {
  staff_update?: Staff_Key | null;
}
```
### Using `updateStaffPassword`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStaffPassword, UpdateStaffPasswordVariables } from '@dataconnect/generated';

// The `updateStaffPassword` mutation requires an argument of type `UpdateStaffPasswordVariables`:
const updateStaffPasswordVars: UpdateStaffPasswordVariables = {
  id: ..., 
  loginPassword: ..., // optional
};

// Call the `updateStaffPassword()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStaffPassword(updateStaffPasswordVars);
// Variables can be defined inline as well.
const { data } = await updateStaffPassword({ id: ..., loginPassword: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStaffPassword(dataConnect, updateStaffPasswordVars);

console.log(data.staff_update);

// Or, you can use the `Promise` API.
updateStaffPassword(updateStaffPasswordVars).then((response) => {
  const data = response.data;
  console.log(data.staff_update);
});
```

### Using `updateStaffPassword`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStaffPasswordRef, UpdateStaffPasswordVariables } from '@dataconnect/generated';

// The `updateStaffPassword` mutation requires an argument of type `UpdateStaffPasswordVariables`:
const updateStaffPasswordVars: UpdateStaffPasswordVariables = {
  id: ..., 
  loginPassword: ..., // optional
};

// Call the `updateStaffPasswordRef()` function to get a reference to the mutation.
const ref = updateStaffPasswordRef(updateStaffPasswordVars);
// Variables can be defined inline as well.
const ref = updateStaffPasswordRef({ id: ..., loginPassword: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStaffPasswordRef(dataConnect, updateStaffPasswordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staff_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staff_update);
});
```

## createGuestFull
You can execute the `createGuestFull` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createGuestFull(vars: CreateGuestFullVariables): MutationPromise<CreateGuestFullData, CreateGuestFullVariables>;

interface CreateGuestFullRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateGuestFullVariables): MutationRef<CreateGuestFullData, CreateGuestFullVariables>;
}
export const createGuestFullRef: CreateGuestFullRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createGuestFull(dc: DataConnect, vars: CreateGuestFullVariables): MutationPromise<CreateGuestFullData, CreateGuestFullVariables>;

interface CreateGuestFullRef {
  ...
  (dc: DataConnect, vars: CreateGuestFullVariables): MutationRef<CreateGuestFullData, CreateGuestFullVariables>;
}
export const createGuestFullRef: CreateGuestFullRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createGuestFullRef:
```typescript
const name = createGuestFullRef.operationName;
console.log(name);
```

### Variables
The `createGuestFull` mutation requires an argument of type `CreateGuestFullVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `createGuestFull` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateGuestFullData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateGuestFullData {
  guest_insert: Guest_Key;
}
```
### Using `createGuestFull`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createGuestFull, CreateGuestFullVariables } from '@dataconnect/generated';

// The `createGuestFull` mutation requires an argument of type `CreateGuestFullVariables`:
const createGuestFullVars: CreateGuestFullVariables = {
  name: ..., 
  roomNumber: ..., // optional
  roomId: ..., // optional
  idNumber: ..., // optional
  contact: ..., // optional
  address: ..., // optional
  status: ..., 
  checkOut: ..., // optional
  loginToken: ..., // optional
  email: ..., // optional
  loginEmail: ..., // optional
  loginPassword: ..., // optional
  firebaseUid: ..., // optional
  qrPayload: ..., // optional
  photoUrl: ..., // optional
};

// Call the `createGuestFull()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createGuestFull(createGuestFullVars);
// Variables can be defined inline as well.
const { data } = await createGuestFull({ name: ..., roomNumber: ..., roomId: ..., idNumber: ..., contact: ..., address: ..., status: ..., checkOut: ..., loginToken: ..., email: ..., loginEmail: ..., loginPassword: ..., firebaseUid: ..., qrPayload: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createGuestFull(dataConnect, createGuestFullVars);

console.log(data.guest_insert);

// Or, you can use the `Promise` API.
createGuestFull(createGuestFullVars).then((response) => {
  const data = response.data;
  console.log(data.guest_insert);
});
```

### Using `createGuestFull`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createGuestFullRef, CreateGuestFullVariables } from '@dataconnect/generated';

// The `createGuestFull` mutation requires an argument of type `CreateGuestFullVariables`:
const createGuestFullVars: CreateGuestFullVariables = {
  name: ..., 
  roomNumber: ..., // optional
  roomId: ..., // optional
  idNumber: ..., // optional
  contact: ..., // optional
  address: ..., // optional
  status: ..., 
  checkOut: ..., // optional
  loginToken: ..., // optional
  email: ..., // optional
  loginEmail: ..., // optional
  loginPassword: ..., // optional
  firebaseUid: ..., // optional
  qrPayload: ..., // optional
  photoUrl: ..., // optional
};

// Call the `createGuestFullRef()` function to get a reference to the mutation.
const ref = createGuestFullRef(createGuestFullVars);
// Variables can be defined inline as well.
const ref = createGuestFullRef({ name: ..., roomNumber: ..., roomId: ..., idNumber: ..., contact: ..., address: ..., status: ..., checkOut: ..., loginToken: ..., email: ..., loginEmail: ..., loginPassword: ..., firebaseUid: ..., qrPayload: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createGuestFullRef(dataConnect, createGuestFullVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.guest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.guest_insert);
});
```

## createSecurityProfile
You can execute the `createSecurityProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createSecurityProfile(vars: CreateSecurityProfileVariables): MutationPromise<CreateSecurityProfileData, CreateSecurityProfileVariables>;

interface CreateSecurityProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSecurityProfileVariables): MutationRef<CreateSecurityProfileData, CreateSecurityProfileVariables>;
}
export const createSecurityProfileRef: CreateSecurityProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSecurityProfile(dc: DataConnect, vars: CreateSecurityProfileVariables): MutationPromise<CreateSecurityProfileData, CreateSecurityProfileVariables>;

interface CreateSecurityProfileRef {
  ...
  (dc: DataConnect, vars: CreateSecurityProfileVariables): MutationRef<CreateSecurityProfileData, CreateSecurityProfileVariables>;
}
export const createSecurityProfileRef: CreateSecurityProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSecurityProfileRef:
```typescript
const name = createSecurityProfileRef.operationName;
console.log(name);
```

### Variables
The `createSecurityProfile` mutation requires an argument of type `CreateSecurityProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateSecurityProfileVariables {
  referenceId: string;
  name: string;
  role: string;
  photoUrl: string;
  facialFeatures?: string | null;
}
```
### Return Type
Recall that executing the `createSecurityProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSecurityProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSecurityProfileData {
  securityProfile_insert: SecurityProfile_Key;
}
```
### Using `createSecurityProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSecurityProfile, CreateSecurityProfileVariables } from '@dataconnect/generated';

// The `createSecurityProfile` mutation requires an argument of type `CreateSecurityProfileVariables`:
const createSecurityProfileVars: CreateSecurityProfileVariables = {
  referenceId: ..., 
  name: ..., 
  role: ..., 
  photoUrl: ..., 
  facialFeatures: ..., // optional
};

// Call the `createSecurityProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSecurityProfile(createSecurityProfileVars);
// Variables can be defined inline as well.
const { data } = await createSecurityProfile({ referenceId: ..., name: ..., role: ..., photoUrl: ..., facialFeatures: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSecurityProfile(dataConnect, createSecurityProfileVars);

console.log(data.securityProfile_insert);

// Or, you can use the `Promise` API.
createSecurityProfile(createSecurityProfileVars).then((response) => {
  const data = response.data;
  console.log(data.securityProfile_insert);
});
```

### Using `createSecurityProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSecurityProfileRef, CreateSecurityProfileVariables } from '@dataconnect/generated';

// The `createSecurityProfile` mutation requires an argument of type `CreateSecurityProfileVariables`:
const createSecurityProfileVars: CreateSecurityProfileVariables = {
  referenceId: ..., 
  name: ..., 
  role: ..., 
  photoUrl: ..., 
  facialFeatures: ..., // optional
};

// Call the `createSecurityProfileRef()` function to get a reference to the mutation.
const ref = createSecurityProfileRef(createSecurityProfileVars);
// Variables can be defined inline as well.
const ref = createSecurityProfileRef({ referenceId: ..., name: ..., role: ..., photoUrl: ..., facialFeatures: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSecurityProfileRef(dataConnect, createSecurityProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.securityProfile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.securityProfile_insert);
});
```

