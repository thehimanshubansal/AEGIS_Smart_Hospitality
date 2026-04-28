# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## getUserLogin
You can execute the `getUserLogin` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetUserLogin(dc: DataConnect, vars: GetUserLoginVariables, options?: useDataConnectQueryOptions<GetUserLoginData>): UseDataConnectQueryResult<GetUserLoginData, GetUserLoginVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUserLogin(vars: GetUserLoginVariables, options?: useDataConnectQueryOptions<GetUserLoginData>): UseDataConnectQueryResult<GetUserLoginData, GetUserLoginVariables>;
```

### Variables
The `getUserLogin` Query requires an argument of type `GetUserLoginVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetUserLoginVariables {
  firebaseUid: string;
}
```
### Return Type
Recall that calling the `getUserLogin` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getUserLogin` Query is of type `GetUserLoginData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getUserLogin`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetUserLoginVariables } from '@dataconnect/generated';
import { useGetUserLogin } from '@dataconnect/generated/react'

export default function GetUserLoginComponent() {
  // The `useGetUserLogin` Query hook requires an argument of type `GetUserLoginVariables`:
  const getUserLoginVars: GetUserLoginVariables = {
    firebaseUid: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUserLogin(getUserLoginVars);
  // Variables can be defined inline as well.
  const query = useGetUserLogin({ firebaseUid: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUserLogin(dataConnect, getUserLoginVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserLogin(getUserLoginVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserLogin(dataConnect, getUserLoginVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.userLogin);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listUserLogins
You can execute the `listUserLogins` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListUserLogins(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserLoginsData>): UseDataConnectQueryResult<ListUserLoginsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListUserLogins(options?: useDataConnectQueryOptions<ListUserLoginsData>): UseDataConnectQueryResult<ListUserLoginsData, undefined>;
```

### Variables
The `listUserLogins` Query has no variables.
### Return Type
Recall that calling the `listUserLogins` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listUserLogins` Query is of type `ListUserLoginsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListUserLoginsData {
  userLogins: ({
    firebaseUid: string;
    email: string;
    displayName?: string | null;
    role: string;
  } & UserLogin_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listUserLogins`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListUserLogins } from '@dataconnect/generated/react'

export default function ListUserLoginsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListUserLogins();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListUserLogins(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListUserLogins(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListUserLogins(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.userLogins);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getUserLoginByEmail
You can execute the `getUserLoginByEmail` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetUserLoginByEmail(dc: DataConnect, vars: GetUserLoginByEmailVariables, options?: useDataConnectQueryOptions<GetUserLoginByEmailData>): UseDataConnectQueryResult<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUserLoginByEmail(vars: GetUserLoginByEmailVariables, options?: useDataConnectQueryOptions<GetUserLoginByEmailData>): UseDataConnectQueryResult<GetUserLoginByEmailData, GetUserLoginByEmailVariables>;
```

### Variables
The `getUserLoginByEmail` Query requires an argument of type `GetUserLoginByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetUserLoginByEmailVariables {
  email: string;
}
```
### Return Type
Recall that calling the `getUserLoginByEmail` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getUserLoginByEmail` Query is of type `GetUserLoginByEmailData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetUserLoginByEmailData {
  userLogins: ({
    firebaseUid: string;
    email: string;
    displayName?: string | null;
    role: string;
  } & UserLogin_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getUserLoginByEmail`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetUserLoginByEmailVariables } from '@dataconnect/generated';
import { useGetUserLoginByEmail } from '@dataconnect/generated/react'

export default function GetUserLoginByEmailComponent() {
  // The `useGetUserLoginByEmail` Query hook requires an argument of type `GetUserLoginByEmailVariables`:
  const getUserLoginByEmailVars: GetUserLoginByEmailVariables = {
    email: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUserLoginByEmail(getUserLoginByEmailVars);
  // Variables can be defined inline as well.
  const query = useGetUserLoginByEmail({ email: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUserLoginByEmail(dataConnect, getUserLoginByEmailVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserLoginByEmail(getUserLoginByEmailVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserLoginByEmail(dataConnect, getUserLoginByEmailVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.userLogins);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getGuestByUid
You can execute the `getGuestByUid` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetGuestByUid(dc: DataConnect, vars: GetGuestByUidVariables, options?: useDataConnectQueryOptions<GetGuestByUidData>): UseDataConnectQueryResult<GetGuestByUidData, GetGuestByUidVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetGuestByUid(vars: GetGuestByUidVariables, options?: useDataConnectQueryOptions<GetGuestByUidData>): UseDataConnectQueryResult<GetGuestByUidData, GetGuestByUidVariables>;
```

### Variables
The `getGuestByUid` Query requires an argument of type `GetGuestByUidVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetGuestByUidVariables {
  uid: string;
}
```
### Return Type
Recall that calling the `getGuestByUid` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getGuestByUid` Query is of type `GetGuestByUidData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getGuestByUid`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetGuestByUidVariables } from '@dataconnect/generated';
import { useGetGuestByUid } from '@dataconnect/generated/react'

export default function GetGuestByUidComponent() {
  // The `useGetGuestByUid` Query hook requires an argument of type `GetGuestByUidVariables`:
  const getGuestByUidVars: GetGuestByUidVariables = {
    uid: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetGuestByUid(getGuestByUidVars);
  // Variables can be defined inline as well.
  const query = useGetGuestByUid({ uid: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetGuestByUid(dataConnect, getGuestByUidVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetGuestByUid(getGuestByUidVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetGuestByUid(dataConnect, getGuestByUidVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.guests);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getGuestByEmail
You can execute the `getGuestByEmail` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetGuestByEmail(dc: DataConnect, vars: GetGuestByEmailVariables, options?: useDataConnectQueryOptions<GetGuestByEmailData>): UseDataConnectQueryResult<GetGuestByEmailData, GetGuestByEmailVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetGuestByEmail(vars: GetGuestByEmailVariables, options?: useDataConnectQueryOptions<GetGuestByEmailData>): UseDataConnectQueryResult<GetGuestByEmailData, GetGuestByEmailVariables>;
```

### Variables
The `getGuestByEmail` Query requires an argument of type `GetGuestByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetGuestByEmailVariables {
  email: string;
}
```
### Return Type
Recall that calling the `getGuestByEmail` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getGuestByEmail` Query is of type `GetGuestByEmailData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getGuestByEmail`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetGuestByEmailVariables } from '@dataconnect/generated';
import { useGetGuestByEmail } from '@dataconnect/generated/react'

export default function GetGuestByEmailComponent() {
  // The `useGetGuestByEmail` Query hook requires an argument of type `GetGuestByEmailVariables`:
  const getGuestByEmailVars: GetGuestByEmailVariables = {
    email: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetGuestByEmail(getGuestByEmailVars);
  // Variables can be defined inline as well.
  const query = useGetGuestByEmail({ email: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetGuestByEmail(dataConnect, getGuestByEmailVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetGuestByEmail(getGuestByEmailVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetGuestByEmail(dataConnect, getGuestByEmailVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.guests);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getStaffByUid
You can execute the `getStaffByUid` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetStaffByUid(dc: DataConnect, vars: GetStaffByUidVariables, options?: useDataConnectQueryOptions<GetStaffByUidData>): UseDataConnectQueryResult<GetStaffByUidData, GetStaffByUidVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetStaffByUid(vars: GetStaffByUidVariables, options?: useDataConnectQueryOptions<GetStaffByUidData>): UseDataConnectQueryResult<GetStaffByUidData, GetStaffByUidVariables>;
```

### Variables
The `getStaffByUid` Query requires an argument of type `GetStaffByUidVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetStaffByUidVariables {
  uid: string;
}
```
### Return Type
Recall that calling the `getStaffByUid` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getStaffByUid` Query is of type `GetStaffByUidData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getStaffByUid`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetStaffByUidVariables } from '@dataconnect/generated';
import { useGetStaffByUid } from '@dataconnect/generated/react'

export default function GetStaffByUidComponent() {
  // The `useGetStaffByUid` Query hook requires an argument of type `GetStaffByUidVariables`:
  const getStaffByUidVars: GetStaffByUidVariables = {
    uid: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetStaffByUid(getStaffByUidVars);
  // Variables can be defined inline as well.
  const query = useGetStaffByUid({ uid: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetStaffByUid(dataConnect, getStaffByUidVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetStaffByUid(getStaffByUidVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetStaffByUid(dataConnect, getStaffByUidVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.staffs);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getStaffByEmail
You can execute the `getStaffByEmail` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetStaffByEmail(dc: DataConnect, vars: GetStaffByEmailVariables, options?: useDataConnectQueryOptions<GetStaffByEmailData>): UseDataConnectQueryResult<GetStaffByEmailData, GetStaffByEmailVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetStaffByEmail(vars: GetStaffByEmailVariables, options?: useDataConnectQueryOptions<GetStaffByEmailData>): UseDataConnectQueryResult<GetStaffByEmailData, GetStaffByEmailVariables>;
```

### Variables
The `getStaffByEmail` Query requires an argument of type `GetStaffByEmailVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetStaffByEmailVariables {
  email: string;
}
```
### Return Type
Recall that calling the `getStaffByEmail` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getStaffByEmail` Query is of type `GetStaffByEmailData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getStaffByEmail`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetStaffByEmailVariables } from '@dataconnect/generated';
import { useGetStaffByEmail } from '@dataconnect/generated/react'

export default function GetStaffByEmailComponent() {
  // The `useGetStaffByEmail` Query hook requires an argument of type `GetStaffByEmailVariables`:
  const getStaffByEmailVars: GetStaffByEmailVariables = {
    email: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetStaffByEmail(getStaffByEmailVars);
  // Variables can be defined inline as well.
  const query = useGetStaffByEmail({ email: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetStaffByEmail(dataConnect, getStaffByEmailVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetStaffByEmail(getStaffByEmailVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetStaffByEmail(dataConnect, getStaffByEmailVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.staffs);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listActiveIncidents
You can execute the `listActiveIncidents` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListActiveIncidents(dc: DataConnect, options?: useDataConnectQueryOptions<ListActiveIncidentsData>): UseDataConnectQueryResult<ListActiveIncidentsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListActiveIncidents(options?: useDataConnectQueryOptions<ListActiveIncidentsData>): UseDataConnectQueryResult<ListActiveIncidentsData, undefined>;
```

### Variables
The `listActiveIncidents` Query has no variables.
### Return Type
Recall that calling the `listActiveIncidents` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listActiveIncidents` Query is of type `ListActiveIncidentsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listActiveIncidents`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListActiveIncidents } from '@dataconnect/generated/react'

export default function ListActiveIncidentsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListActiveIncidents();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListActiveIncidents(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListActiveIncidents(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListActiveIncidents(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.incidents);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listIncidents
You can execute the `listIncidents` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListIncidents(dc: DataConnect, options?: useDataConnectQueryOptions<ListIncidentsData>): UseDataConnectQueryResult<ListIncidentsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListIncidents(options?: useDataConnectQueryOptions<ListIncidentsData>): UseDataConnectQueryResult<ListIncidentsData, undefined>;
```

### Variables
The `listIncidents` Query has no variables.
### Return Type
Recall that calling the `listIncidents` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listIncidents` Query is of type `ListIncidentsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listIncidents`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListIncidents } from '@dataconnect/generated/react'

export default function ListIncidentsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListIncidents();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListIncidents(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListIncidents(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListIncidents(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.incidents);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listRooms
You can execute the `listRooms` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListRooms(dc: DataConnect, options?: useDataConnectQueryOptions<ListRoomsData>): UseDataConnectQueryResult<ListRoomsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListRooms(options?: useDataConnectQueryOptions<ListRoomsData>): UseDataConnectQueryResult<ListRoomsData, undefined>;
```

### Variables
The `listRooms` Query has no variables.
### Return Type
Recall that calling the `listRooms` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listRooms` Query is of type `ListRoomsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listRooms`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListRooms } from '@dataconnect/generated/react'

export default function ListRoomsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListRooms();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListRooms(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListRooms(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListRooms(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.rooms);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listGuests
You can execute the `listGuests` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListGuests(dc: DataConnect, options?: useDataConnectQueryOptions<ListGuestsData>): UseDataConnectQueryResult<ListGuestsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListGuests(options?: useDataConnectQueryOptions<ListGuestsData>): UseDataConnectQueryResult<ListGuestsData, undefined>;
```

### Variables
The `listGuests` Query has no variables.
### Return Type
Recall that calling the `listGuests` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listGuests` Query is of type `ListGuestsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listGuests`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListGuests } from '@dataconnect/generated/react'

export default function ListGuestsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListGuests();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListGuests(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListGuests(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListGuests(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.guests);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listStaff
You can execute the `listStaff` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListStaff(dc: DataConnect, options?: useDataConnectQueryOptions<ListStaffData>): UseDataConnectQueryResult<ListStaffData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListStaff(options?: useDataConnectQueryOptions<ListStaffData>): UseDataConnectQueryResult<ListStaffData, undefined>;
```

### Variables
The `listStaff` Query has no variables.
### Return Type
Recall that calling the `listStaff` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listStaff` Query is of type `ListStaffData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listStaff`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListStaff } from '@dataconnect/generated/react'

export default function ListStaffComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListStaff();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListStaff(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListStaff(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListStaff(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.staffs);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getStaffByEmployeeId
You can execute the `getStaffByEmployeeId` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetStaffByEmployeeId(dc: DataConnect, vars: GetStaffByEmployeeIdVariables, options?: useDataConnectQueryOptions<GetStaffByEmployeeIdData>): UseDataConnectQueryResult<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetStaffByEmployeeId(vars: GetStaffByEmployeeIdVariables, options?: useDataConnectQueryOptions<GetStaffByEmployeeIdData>): UseDataConnectQueryResult<GetStaffByEmployeeIdData, GetStaffByEmployeeIdVariables>;
```

### Variables
The `getStaffByEmployeeId` Query requires an argument of type `GetStaffByEmployeeIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetStaffByEmployeeIdVariables {
  employeeId: string;
}
```
### Return Type
Recall that calling the `getStaffByEmployeeId` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getStaffByEmployeeId` Query is of type `GetStaffByEmployeeIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getStaffByEmployeeId`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetStaffByEmployeeIdVariables } from '@dataconnect/generated';
import { useGetStaffByEmployeeId } from '@dataconnect/generated/react'

export default function GetStaffByEmployeeIdComponent() {
  // The `useGetStaffByEmployeeId` Query hook requires an argument of type `GetStaffByEmployeeIdVariables`:
  const getStaffByEmployeeIdVars: GetStaffByEmployeeIdVariables = {
    employeeId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetStaffByEmployeeId(getStaffByEmployeeIdVars);
  // Variables can be defined inline as well.
  const query = useGetStaffByEmployeeId({ employeeId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetStaffByEmployeeId(dataConnect, getStaffByEmployeeIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetStaffByEmployeeId(getStaffByEmployeeIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetStaffByEmployeeId(dataConnect, getStaffByEmployeeIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.staffs);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getGuestByLoginToken
You can execute the `getGuestByLoginToken` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetGuestByLoginToken(dc: DataConnect, vars: GetGuestByLoginTokenVariables, options?: useDataConnectQueryOptions<GetGuestByLoginTokenData>): UseDataConnectQueryResult<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetGuestByLoginToken(vars: GetGuestByLoginTokenVariables, options?: useDataConnectQueryOptions<GetGuestByLoginTokenData>): UseDataConnectQueryResult<GetGuestByLoginTokenData, GetGuestByLoginTokenVariables>;
```

### Variables
The `getGuestByLoginToken` Query requires an argument of type `GetGuestByLoginTokenVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetGuestByLoginTokenVariables {
  loginToken: string;
}
```
### Return Type
Recall that calling the `getGuestByLoginToken` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getGuestByLoginToken` Query is of type `GetGuestByLoginTokenData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getGuestByLoginToken`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetGuestByLoginTokenVariables } from '@dataconnect/generated';
import { useGetGuestByLoginToken } from '@dataconnect/generated/react'

export default function GetGuestByLoginTokenComponent() {
  // The `useGetGuestByLoginToken` Query hook requires an argument of type `GetGuestByLoginTokenVariables`:
  const getGuestByLoginTokenVars: GetGuestByLoginTokenVariables = {
    loginToken: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetGuestByLoginToken(getGuestByLoginTokenVars);
  // Variables can be defined inline as well.
  const query = useGetGuestByLoginToken({ loginToken: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetGuestByLoginToken(dataConnect, getGuestByLoginTokenVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetGuestByLoginToken(getGuestByLoginTokenVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetGuestByLoginToken(dataConnect, getGuestByLoginTokenVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.guests);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getGuestById
You can execute the `getGuestById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetGuestById(dc: DataConnect, vars: GetGuestByIdVariables, options?: useDataConnectQueryOptions<GetGuestByIdData>): UseDataConnectQueryResult<GetGuestByIdData, GetGuestByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetGuestById(vars: GetGuestByIdVariables, options?: useDataConnectQueryOptions<GetGuestByIdData>): UseDataConnectQueryResult<GetGuestByIdData, GetGuestByIdVariables>;
```

### Variables
The `getGuestById` Query requires an argument of type `GetGuestByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetGuestByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `getGuestById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getGuestById` Query is of type `GetGuestByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getGuestById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetGuestByIdVariables } from '@dataconnect/generated';
import { useGetGuestById } from '@dataconnect/generated/react'

export default function GetGuestByIdComponent() {
  // The `useGetGuestById` Query hook requires an argument of type `GetGuestByIdVariables`:
  const getGuestByIdVars: GetGuestByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetGuestById(getGuestByIdVars);
  // Variables can be defined inline as well.
  const query = useGetGuestById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetGuestById(dataConnect, getGuestByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetGuestById(getGuestByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetGuestById(dataConnect, getGuestByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.guest);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getRoomById
You can execute the `getRoomById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetRoomById(dc: DataConnect, vars: GetRoomByIdVariables, options?: useDataConnectQueryOptions<GetRoomByIdData>): UseDataConnectQueryResult<GetRoomByIdData, GetRoomByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetRoomById(vars: GetRoomByIdVariables, options?: useDataConnectQueryOptions<GetRoomByIdData>): UseDataConnectQueryResult<GetRoomByIdData, GetRoomByIdVariables>;
```

### Variables
The `getRoomById` Query requires an argument of type `GetRoomByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetRoomByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `getRoomById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getRoomById` Query is of type `GetRoomByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getRoomById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetRoomByIdVariables } from '@dataconnect/generated';
import { useGetRoomById } from '@dataconnect/generated/react'

export default function GetRoomByIdComponent() {
  // The `useGetRoomById` Query hook requires an argument of type `GetRoomByIdVariables`:
  const getRoomByIdVars: GetRoomByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetRoomById(getRoomByIdVars);
  // Variables can be defined inline as well.
  const query = useGetRoomById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetRoomById(dataConnect, getRoomByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetRoomById(getRoomByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetRoomById(dataConnect, getRoomByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.room);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getIncidentById
You can execute the `getIncidentById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetIncidentById(dc: DataConnect, vars: GetIncidentByIdVariables, options?: useDataConnectQueryOptions<GetIncidentByIdData>): UseDataConnectQueryResult<GetIncidentByIdData, GetIncidentByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetIncidentById(vars: GetIncidentByIdVariables, options?: useDataConnectQueryOptions<GetIncidentByIdData>): UseDataConnectQueryResult<GetIncidentByIdData, GetIncidentByIdVariables>;
```

### Variables
The `getIncidentById` Query requires an argument of type `GetIncidentByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetIncidentByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `getIncidentById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getIncidentById` Query is of type `GetIncidentByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getIncidentById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetIncidentByIdVariables } from '@dataconnect/generated';
import { useGetIncidentById } from '@dataconnect/generated/react'

export default function GetIncidentByIdComponent() {
  // The `useGetIncidentById` Query hook requires an argument of type `GetIncidentByIdVariables`:
  const getIncidentByIdVars: GetIncidentByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetIncidentById(getIncidentByIdVars);
  // Variables can be defined inline as well.
  const query = useGetIncidentById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetIncidentById(dataConnect, getIncidentByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetIncidentById(getIncidentByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetIncidentById(dataConnect, getIncidentByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.incident);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getStaffById
You can execute the `getStaffById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetStaffById(dc: DataConnect, vars: GetStaffByIdVariables, options?: useDataConnectQueryOptions<GetStaffByIdData>): UseDataConnectQueryResult<GetStaffByIdData, GetStaffByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetStaffById(vars: GetStaffByIdVariables, options?: useDataConnectQueryOptions<GetStaffByIdData>): UseDataConnectQueryResult<GetStaffByIdData, GetStaffByIdVariables>;
```

### Variables
The `getStaffById` Query requires an argument of type `GetStaffByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetStaffByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `getStaffById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getStaffById` Query is of type `GetStaffByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getStaffById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetStaffByIdVariables } from '@dataconnect/generated';
import { useGetStaffById } from '@dataconnect/generated/react'

export default function GetStaffByIdComponent() {
  // The `useGetStaffById` Query hook requires an argument of type `GetStaffByIdVariables`:
  const getStaffByIdVars: GetStaffByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetStaffById(getStaffByIdVars);
  // Variables can be defined inline as well.
  const query = useGetStaffById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetStaffById(dataConnect, getStaffByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetStaffById(getStaffByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetStaffById(dataConnect, getStaffByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.staff);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## listSecurityProfiles
You can execute the `listSecurityProfiles` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListSecurityProfiles(dc: DataConnect, options?: useDataConnectQueryOptions<ListSecurityProfilesData>): UseDataConnectQueryResult<ListSecurityProfilesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListSecurityProfiles(options?: useDataConnectQueryOptions<ListSecurityProfilesData>): UseDataConnectQueryResult<ListSecurityProfilesData, undefined>;
```

### Variables
The `listSecurityProfiles` Query has no variables.
### Return Type
Recall that calling the `listSecurityProfiles` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `listSecurityProfiles` Query is of type `ListSecurityProfilesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `listSecurityProfiles`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListSecurityProfiles } from '@dataconnect/generated/react'

export default function ListSecurityProfilesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListSecurityProfiles();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListSecurityProfiles(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListSecurityProfiles(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListSecurityProfiles(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.securityProfiles);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## upsertUserLogin
You can execute the `upsertUserLogin` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertUserLogin(options?: useDataConnectMutationOptions<UpsertUserLoginData, FirebaseError, UpsertUserLoginVariables>): UseDataConnectMutationResult<UpsertUserLoginData, UpsertUserLoginVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertUserLogin(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserLoginData, FirebaseError, UpsertUserLoginVariables>): UseDataConnectMutationResult<UpsertUserLoginData, UpsertUserLoginVariables>;
```

### Variables
The `upsertUserLogin` Mutation requires an argument of type `UpsertUserLoginVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertUserLoginVariables {
  firebaseUid: string;
  email: string;
  displayName?: string | null;
  role: string;
}
```
### Return Type
Recall that calling the `upsertUserLogin` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `upsertUserLogin` Mutation is of type `UpsertUserLoginData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertUserLoginData {
  userLogin_upsert: UserLogin_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `upsertUserLogin`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertUserLoginVariables } from '@dataconnect/generated';
import { useUpsertUserLogin } from '@dataconnect/generated/react'

export default function UpsertUserLoginComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertUserLogin();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertUserLogin(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUserLogin(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUserLogin(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertUserLogin` Mutation requires an argument of type `UpsertUserLoginVariables`:
  const upsertUserLoginVars: UpsertUserLoginVariables = {
    firebaseUid: ..., 
    email: ..., 
    displayName: ..., // optional
    role: ..., 
  };
  mutation.mutate(upsertUserLoginVars);
  // Variables can be defined inline as well.
  mutation.mutate({ firebaseUid: ..., email: ..., displayName: ..., role: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertUserLoginVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userLogin_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## createGuest
You can execute the `createGuest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateGuest(options?: useDataConnectMutationOptions<CreateGuestData, FirebaseError, CreateGuestVariables>): UseDataConnectMutationResult<CreateGuestData, CreateGuestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateGuest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateGuestData, FirebaseError, CreateGuestVariables>): UseDataConnectMutationResult<CreateGuestData, CreateGuestVariables>;
```

### Variables
The `createGuest` Mutation requires an argument of type `CreateGuestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `createGuest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `createGuest` Mutation is of type `CreateGuestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateGuestData {
  guest_insert: Guest_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `createGuest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateGuestVariables } from '@dataconnect/generated';
import { useCreateGuest } from '@dataconnect/generated/react'

export default function CreateGuestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateGuest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateGuest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateGuest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateGuest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateGuest` Mutation requires an argument of type `CreateGuestVariables`:
  const createGuestVars: CreateGuestVariables = {
    firebaseUid: ..., // optional
    email: ..., // optional
    name: ..., 
    roomNumber: ..., // optional
    status: ..., 
    checkOut: ..., 
    photoUrl: ..., // optional
  };
  mutation.mutate(createGuestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ firebaseUid: ..., email: ..., name: ..., roomNumber: ..., status: ..., checkOut: ..., photoUrl: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createGuestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.guest_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## updateGuest
You can execute the `updateGuest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateGuest(options?: useDataConnectMutationOptions<UpdateGuestData, FirebaseError, UpdateGuestVariables>): UseDataConnectMutationResult<UpdateGuestData, UpdateGuestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateGuest(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateGuestData, FirebaseError, UpdateGuestVariables>): UseDataConnectMutationResult<UpdateGuestData, UpdateGuestVariables>;
```

### Variables
The `updateGuest` Mutation requires an argument of type `UpdateGuestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `updateGuest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `updateGuest` Mutation is of type `UpdateGuestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateGuestData {
  guest_update?: Guest_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `updateGuest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateGuestVariables } from '@dataconnect/generated';
import { useUpdateGuest } from '@dataconnect/generated/react'

export default function UpdateGuestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateGuest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateGuest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateGuest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateGuest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateGuest` Mutation requires an argument of type `UpdateGuestVariables`:
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
  mutation.mutate(updateGuestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., email: ..., firebaseUid: ..., status: ..., roomNumber: ..., loginToken: ..., roomId: ..., qrPayload: ..., idNumber: ..., contact: ..., address: ..., checkOut: ..., loginEmail: ..., loginPassword: ..., photoUrl: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateGuestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.guest_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## createStaff
You can execute the `createStaff` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateStaff(options?: useDataConnectMutationOptions<CreateStaffData, FirebaseError, CreateStaffVariables>): UseDataConnectMutationResult<CreateStaffData, CreateStaffVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateStaff(dc: DataConnect, options?: useDataConnectMutationOptions<CreateStaffData, FirebaseError, CreateStaffVariables>): UseDataConnectMutationResult<CreateStaffData, CreateStaffVariables>;
```

### Variables
The `createStaff` Mutation requires an argument of type `CreateStaffVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `createStaff` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `createStaff` Mutation is of type `CreateStaffData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateStaffData {
  staff_insert: Staff_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `createStaff`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateStaffVariables } from '@dataconnect/generated';
import { useCreateStaff } from '@dataconnect/generated/react'

export default function CreateStaffComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateStaff();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateStaff(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateStaff(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateStaff(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateStaff` Mutation requires an argument of type `CreateStaffVariables`:
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
  mutation.mutate(createStaffVars);
  // Variables can be defined inline as well.
  mutation.mutate({ firebaseUid: ..., email: ..., loginPassword: ..., name: ..., role: ..., status: ..., employeeId: ..., department: ..., phone: ..., emergencyContact: ..., bloodGroup: ..., joiningDate: ..., validTill: ..., photoUrl: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createStaffVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.staff_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## updateStaff
You can execute the `updateStaff` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateStaff(options?: useDataConnectMutationOptions<UpdateStaffData, FirebaseError, UpdateStaffVariables>): UseDataConnectMutationResult<UpdateStaffData, UpdateStaffVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateStaff(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateStaffData, FirebaseError, UpdateStaffVariables>): UseDataConnectMutationResult<UpdateStaffData, UpdateStaffVariables>;
```

### Variables
The `updateStaff` Mutation requires an argument of type `UpdateStaffVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `updateStaff` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `updateStaff` Mutation is of type `UpdateStaffData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateStaffData {
  staff_update?: Staff_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `updateStaff`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateStaffVariables } from '@dataconnect/generated';
import { useUpdateStaff } from '@dataconnect/generated/react'

export default function UpdateStaffComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateStaff();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateStaff(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateStaff(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateStaff(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateStaff` Mutation requires an argument of type `UpdateStaffVariables`:
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
  mutation.mutate(updateStaffVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., email: ..., firebaseUid: ..., role: ..., department: ..., status: ..., phone: ..., emergencyContact: ..., bloodGroup: ..., joiningDate: ..., validTill: ..., photoUrl: ..., employeeId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateStaffVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.staff_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## createIncident
You can execute the `createIncident` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateIncident(options?: useDataConnectMutationOptions<CreateIncidentData, FirebaseError, CreateIncidentVariables>): UseDataConnectMutationResult<CreateIncidentData, CreateIncidentVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateIncident(dc: DataConnect, options?: useDataConnectMutationOptions<CreateIncidentData, FirebaseError, CreateIncidentVariables>): UseDataConnectMutationResult<CreateIncidentData, CreateIncidentVariables>;
```

### Variables
The `createIncident` Mutation requires an argument of type `CreateIncidentVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateIncidentVariables {
  title: string;
  severity: string;
  roomId?: string | null;
  description?: string | null;
  status?: string | null;
}
```
### Return Type
Recall that calling the `createIncident` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `createIncident` Mutation is of type `CreateIncidentData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateIncidentData {
  incident_insert: Incident_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `createIncident`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateIncidentVariables } from '@dataconnect/generated';
import { useCreateIncident } from '@dataconnect/generated/react'

export default function CreateIncidentComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateIncident();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateIncident(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateIncident(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateIncident(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateIncident` Mutation requires an argument of type `CreateIncidentVariables`:
  const createIncidentVars: CreateIncidentVariables = {
    title: ..., 
    severity: ..., 
    roomId: ..., // optional
    description: ..., // optional
    status: ..., // optional
  };
  mutation.mutate(createIncidentVars);
  // Variables can be defined inline as well.
  mutation.mutate({ title: ..., severity: ..., roomId: ..., description: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createIncidentVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.incident_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## updateIncident
You can execute the `updateIncident` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateIncident(options?: useDataConnectMutationOptions<UpdateIncidentData, FirebaseError, UpdateIncidentVariables>): UseDataConnectMutationResult<UpdateIncidentData, UpdateIncidentVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateIncident(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateIncidentData, FirebaseError, UpdateIncidentVariables>): UseDataConnectMutationResult<UpdateIncidentData, UpdateIncidentVariables>;
```

### Variables
The `updateIncident` Mutation requires an argument of type `UpdateIncidentVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateIncidentVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that calling the `updateIncident` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `updateIncident` Mutation is of type `UpdateIncidentData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateIncidentData {
  incident_update?: Incident_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `updateIncident`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateIncidentVariables } from '@dataconnect/generated';
import { useUpdateIncident } from '@dataconnect/generated/react'

export default function UpdateIncidentComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateIncident();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateIncident(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateIncident(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateIncident(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateIncident` Mutation requires an argument of type `UpdateIncidentVariables`:
  const updateIncidentVars: UpdateIncidentVariables = {
    id: ..., 
    status: ..., 
  };
  mutation.mutate(updateIncidentVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateIncidentVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.incident_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## createRoom
You can execute the `createRoom` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateRoom(options?: useDataConnectMutationOptions<CreateRoomData, FirebaseError, CreateRoomVariables>): UseDataConnectMutationResult<CreateRoomData, CreateRoomVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateRoom(dc: DataConnect, options?: useDataConnectMutationOptions<CreateRoomData, FirebaseError, CreateRoomVariables>): UseDataConnectMutationResult<CreateRoomData, CreateRoomVariables>;
```

### Variables
The `createRoom` Mutation requires an argument of type `CreateRoomVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateRoomVariables {
  number: string;
  floor: number;
  type: string;
  status: string;
}
```
### Return Type
Recall that calling the `createRoom` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `createRoom` Mutation is of type `CreateRoomData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateRoomData {
  room_insert: Room_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `createRoom`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateRoomVariables } from '@dataconnect/generated';
import { useCreateRoom } from '@dataconnect/generated/react'

export default function CreateRoomComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateRoom();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateRoom(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateRoom(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateRoom(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateRoom` Mutation requires an argument of type `CreateRoomVariables`:
  const createRoomVars: CreateRoomVariables = {
    number: ..., 
    floor: ..., 
    type: ..., 
    status: ..., 
  };
  mutation.mutate(createRoomVars);
  // Variables can be defined inline as well.
  mutation.mutate({ number: ..., floor: ..., type: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createRoomVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.room_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## updateRoom
You can execute the `updateRoom` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateRoom(options?: useDataConnectMutationOptions<UpdateRoomData, FirebaseError, UpdateRoomVariables>): UseDataConnectMutationResult<UpdateRoomData, UpdateRoomVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateRoom(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateRoomData, FirebaseError, UpdateRoomVariables>): UseDataConnectMutationResult<UpdateRoomData, UpdateRoomVariables>;
```

### Variables
The `updateRoom` Mutation requires an argument of type `UpdateRoomVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateRoomVariables {
  id: UUIDString;
  number?: string | null;
  floor?: number | null;
  type?: string | null;
  status?: string | null;
}
```
### Return Type
Recall that calling the `updateRoom` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `updateRoom` Mutation is of type `UpdateRoomData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateRoomData {
  room_update?: Room_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `updateRoom`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateRoomVariables } from '@dataconnect/generated';
import { useUpdateRoom } from '@dataconnect/generated/react'

export default function UpdateRoomComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateRoom();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateRoom(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateRoom(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateRoom(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateRoom` Mutation requires an argument of type `UpdateRoomVariables`:
  const updateRoomVars: UpdateRoomVariables = {
    id: ..., 
    number: ..., // optional
    floor: ..., // optional
    type: ..., // optional
    status: ..., // optional
  };
  mutation.mutate(updateRoomVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., number: ..., floor: ..., type: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateRoomVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.room_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## deleteRoom
You can execute the `deleteRoom` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteRoom(options?: useDataConnectMutationOptions<DeleteRoomData, FirebaseError, DeleteRoomVariables>): UseDataConnectMutationResult<DeleteRoomData, DeleteRoomVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteRoom(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteRoomData, FirebaseError, DeleteRoomVariables>): UseDataConnectMutationResult<DeleteRoomData, DeleteRoomVariables>;
```

### Variables
The `deleteRoom` Mutation requires an argument of type `DeleteRoomVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteRoomVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `deleteRoom` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `deleteRoom` Mutation is of type `DeleteRoomData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteRoomData {
  room_delete?: Room_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `deleteRoom`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteRoomVariables } from '@dataconnect/generated';
import { useDeleteRoom } from '@dataconnect/generated/react'

export default function DeleteRoomComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteRoom();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteRoom(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteRoom(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteRoom(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteRoom` Mutation requires an argument of type `DeleteRoomVariables`:
  const deleteRoomVars: DeleteRoomVariables = {
    id: ..., 
  };
  mutation.mutate(deleteRoomVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteRoomVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.room_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## deleteGuest
You can execute the `deleteGuest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteGuest(options?: useDataConnectMutationOptions<DeleteGuestData, FirebaseError, DeleteGuestVariables>): UseDataConnectMutationResult<DeleteGuestData, DeleteGuestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteGuest(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteGuestData, FirebaseError, DeleteGuestVariables>): UseDataConnectMutationResult<DeleteGuestData, DeleteGuestVariables>;
```

### Variables
The `deleteGuest` Mutation requires an argument of type `DeleteGuestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteGuestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `deleteGuest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `deleteGuest` Mutation is of type `DeleteGuestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteGuestData {
  guest_delete?: Guest_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `deleteGuest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteGuestVariables } from '@dataconnect/generated';
import { useDeleteGuest } from '@dataconnect/generated/react'

export default function DeleteGuestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteGuest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteGuest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteGuest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteGuest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteGuest` Mutation requires an argument of type `DeleteGuestVariables`:
  const deleteGuestVars: DeleteGuestVariables = {
    id: ..., 
  };
  mutation.mutate(deleteGuestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteGuestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.guest_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## deleteStaff
You can execute the `deleteStaff` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteStaff(options?: useDataConnectMutationOptions<DeleteStaffData, FirebaseError, DeleteStaffVariables>): UseDataConnectMutationResult<DeleteStaffData, DeleteStaffVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteStaff(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteStaffData, FirebaseError, DeleteStaffVariables>): UseDataConnectMutationResult<DeleteStaffData, DeleteStaffVariables>;
```

### Variables
The `deleteStaff` Mutation requires an argument of type `DeleteStaffVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteStaffVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `deleteStaff` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `deleteStaff` Mutation is of type `DeleteStaffData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteStaffData {
  staff_delete?: Staff_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `deleteStaff`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteStaffVariables } from '@dataconnect/generated';
import { useDeleteStaff } from '@dataconnect/generated/react'

export default function DeleteStaffComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteStaff();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteStaff(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteStaff(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteStaff(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteStaff` Mutation requires an argument of type `DeleteStaffVariables`:
  const deleteStaffVars: DeleteStaffVariables = {
    id: ..., 
  };
  mutation.mutate(deleteStaffVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteStaffVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.staff_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## deleteIncident
You can execute the `deleteIncident` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteIncident(options?: useDataConnectMutationOptions<DeleteIncidentData, FirebaseError, DeleteIncidentVariables>): UseDataConnectMutationResult<DeleteIncidentData, DeleteIncidentVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteIncident(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteIncidentData, FirebaseError, DeleteIncidentVariables>): UseDataConnectMutationResult<DeleteIncidentData, DeleteIncidentVariables>;
```

### Variables
The `deleteIncident` Mutation requires an argument of type `DeleteIncidentVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteIncidentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `deleteIncident` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `deleteIncident` Mutation is of type `DeleteIncidentData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteIncidentData {
  incident_delete?: Incident_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `deleteIncident`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteIncidentVariables } from '@dataconnect/generated';
import { useDeleteIncident } from '@dataconnect/generated/react'

export default function DeleteIncidentComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteIncident();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteIncident(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteIncident(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteIncident(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteIncident` Mutation requires an argument of type `DeleteIncidentVariables`:
  const deleteIncidentVars: DeleteIncidentVariables = {
    id: ..., 
  };
  mutation.mutate(deleteIncidentVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteIncidentVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.incident_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## updateGuestPassword
You can execute the `updateGuestPassword` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateGuestPassword(options?: useDataConnectMutationOptions<UpdateGuestPasswordData, FirebaseError, UpdateGuestPasswordVariables>): UseDataConnectMutationResult<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateGuestPassword(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateGuestPasswordData, FirebaseError, UpdateGuestPasswordVariables>): UseDataConnectMutationResult<UpdateGuestPasswordData, UpdateGuestPasswordVariables>;
```

### Variables
The `updateGuestPassword` Mutation requires an argument of type `UpdateGuestPasswordVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateGuestPasswordVariables {
  id: UUIDString;
  loginPassword?: string | null;
}
```
### Return Type
Recall that calling the `updateGuestPassword` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `updateGuestPassword` Mutation is of type `UpdateGuestPasswordData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateGuestPasswordData {
  guest_update?: Guest_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `updateGuestPassword`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateGuestPasswordVariables } from '@dataconnect/generated';
import { useUpdateGuestPassword } from '@dataconnect/generated/react'

export default function UpdateGuestPasswordComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateGuestPassword();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateGuestPassword(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateGuestPassword(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateGuestPassword(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateGuestPassword` Mutation requires an argument of type `UpdateGuestPasswordVariables`:
  const updateGuestPasswordVars: UpdateGuestPasswordVariables = {
    id: ..., 
    loginPassword: ..., // optional
  };
  mutation.mutate(updateGuestPasswordVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., loginPassword: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateGuestPasswordVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.guest_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## updateStaffPassword
You can execute the `updateStaffPassword` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateStaffPassword(options?: useDataConnectMutationOptions<UpdateStaffPasswordData, FirebaseError, UpdateStaffPasswordVariables>): UseDataConnectMutationResult<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateStaffPassword(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateStaffPasswordData, FirebaseError, UpdateStaffPasswordVariables>): UseDataConnectMutationResult<UpdateStaffPasswordData, UpdateStaffPasswordVariables>;
```

### Variables
The `updateStaffPassword` Mutation requires an argument of type `UpdateStaffPasswordVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateStaffPasswordVariables {
  id: UUIDString;
  loginPassword?: string | null;
}
```
### Return Type
Recall that calling the `updateStaffPassword` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `updateStaffPassword` Mutation is of type `UpdateStaffPasswordData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateStaffPasswordData {
  staff_update?: Staff_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `updateStaffPassword`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateStaffPasswordVariables } from '@dataconnect/generated';
import { useUpdateStaffPassword } from '@dataconnect/generated/react'

export default function UpdateStaffPasswordComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateStaffPassword();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateStaffPassword(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateStaffPassword(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateStaffPassword(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateStaffPassword` Mutation requires an argument of type `UpdateStaffPasswordVariables`:
  const updateStaffPasswordVars: UpdateStaffPasswordVariables = {
    id: ..., 
    loginPassword: ..., // optional
  };
  mutation.mutate(updateStaffPasswordVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., loginPassword: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateStaffPasswordVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.staff_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## createGuestFull
You can execute the `createGuestFull` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateGuestFull(options?: useDataConnectMutationOptions<CreateGuestFullData, FirebaseError, CreateGuestFullVariables>): UseDataConnectMutationResult<CreateGuestFullData, CreateGuestFullVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateGuestFull(dc: DataConnect, options?: useDataConnectMutationOptions<CreateGuestFullData, FirebaseError, CreateGuestFullVariables>): UseDataConnectMutationResult<CreateGuestFullData, CreateGuestFullVariables>;
```

### Variables
The `createGuestFull` Mutation requires an argument of type `CreateGuestFullVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `createGuestFull` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `createGuestFull` Mutation is of type `CreateGuestFullData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateGuestFullData {
  guest_insert: Guest_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `createGuestFull`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateGuestFullVariables } from '@dataconnect/generated';
import { useCreateGuestFull } from '@dataconnect/generated/react'

export default function CreateGuestFullComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateGuestFull();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateGuestFull(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateGuestFull(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateGuestFull(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateGuestFull` Mutation requires an argument of type `CreateGuestFullVariables`:
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
  mutation.mutate(createGuestFullVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., roomNumber: ..., roomId: ..., idNumber: ..., contact: ..., address: ..., status: ..., checkOut: ..., loginToken: ..., email: ..., loginEmail: ..., loginPassword: ..., firebaseUid: ..., qrPayload: ..., photoUrl: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createGuestFullVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.guest_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## createSecurityProfile
You can execute the `createSecurityProfile` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateSecurityProfile(options?: useDataConnectMutationOptions<CreateSecurityProfileData, FirebaseError, CreateSecurityProfileVariables>): UseDataConnectMutationResult<CreateSecurityProfileData, CreateSecurityProfileVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateSecurityProfile(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSecurityProfileData, FirebaseError, CreateSecurityProfileVariables>): UseDataConnectMutationResult<CreateSecurityProfileData, CreateSecurityProfileVariables>;
```

### Variables
The `createSecurityProfile` Mutation requires an argument of type `CreateSecurityProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateSecurityProfileVariables {
  referenceId: string;
  name: string;
  role: string;
  photoUrl: string;
  facialFeatures?: string | null;
}
```
### Return Type
Recall that calling the `createSecurityProfile` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `createSecurityProfile` Mutation is of type `CreateSecurityProfileData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateSecurityProfileData {
  securityProfile_insert: SecurityProfile_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `createSecurityProfile`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateSecurityProfileVariables } from '@dataconnect/generated';
import { useCreateSecurityProfile } from '@dataconnect/generated/react'

export default function CreateSecurityProfileComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateSecurityProfile();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateSecurityProfile(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSecurityProfile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateSecurityProfile(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateSecurityProfile` Mutation requires an argument of type `CreateSecurityProfileVariables`:
  const createSecurityProfileVars: CreateSecurityProfileVariables = {
    referenceId: ..., 
    name: ..., 
    role: ..., 
    photoUrl: ..., 
    facialFeatures: ..., // optional
  };
  mutation.mutate(createSecurityProfileVars);
  // Variables can be defined inline as well.
  mutation.mutate({ referenceId: ..., name: ..., role: ..., photoUrl: ..., facialFeatures: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createSecurityProfileVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.securityProfile_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

