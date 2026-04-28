# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useUpsertUserLogin, useCreateGuest, useUpdateGuest, useCreateStaff, useUpdateStaff, useCreateIncident, useUpdateIncident, useCreateRoom, useUpdateRoom, useDeleteRoom } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useUpsertUserLogin(upsertUserLoginVars);

const { data, isPending, isSuccess, isError, error } = useCreateGuest(createGuestVars);

const { data, isPending, isSuccess, isError, error } = useUpdateGuest(updateGuestVars);

const { data, isPending, isSuccess, isError, error } = useCreateStaff(createStaffVars);

const { data, isPending, isSuccess, isError, error } = useUpdateStaff(updateStaffVars);

const { data, isPending, isSuccess, isError, error } = useCreateIncident(createIncidentVars);

const { data, isPending, isSuccess, isError, error } = useUpdateIncident(updateIncidentVars);

const { data, isPending, isSuccess, isError, error } = useCreateRoom(createRoomVars);

const { data, isPending, isSuccess, isError, error } = useUpdateRoom(updateRoomVars);

const { data, isPending, isSuccess, isError, error } = useDeleteRoom(deleteRoomVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertUserLogin, createGuest, updateGuest, createStaff, updateStaff, createIncident, updateIncident, createRoom, updateRoom, deleteRoom } from '@dataconnect/generated';


// Operation upsertUserLogin:  For variables, look at type UpsertUserLoginVars in ../index.d.ts
const { data } = await UpsertUserLogin(dataConnect, upsertUserLoginVars);

// Operation createGuest:  For variables, look at type CreateGuestVars in ../index.d.ts
const { data } = await CreateGuest(dataConnect, createGuestVars);

// Operation updateGuest:  For variables, look at type UpdateGuestVars in ../index.d.ts
const { data } = await UpdateGuest(dataConnect, updateGuestVars);

// Operation createStaff:  For variables, look at type CreateStaffVars in ../index.d.ts
const { data } = await CreateStaff(dataConnect, createStaffVars);

// Operation updateStaff:  For variables, look at type UpdateStaffVars in ../index.d.ts
const { data } = await UpdateStaff(dataConnect, updateStaffVars);

// Operation createIncident:  For variables, look at type CreateIncidentVars in ../index.d.ts
const { data } = await CreateIncident(dataConnect, createIncidentVars);

// Operation updateIncident:  For variables, look at type UpdateIncidentVars in ../index.d.ts
const { data } = await UpdateIncident(dataConnect, updateIncidentVars);

// Operation createRoom:  For variables, look at type CreateRoomVars in ../index.d.ts
const { data } = await CreateRoom(dataConnect, createRoomVars);

// Operation updateRoom:  For variables, look at type UpdateRoomVars in ../index.d.ts
const { data } = await UpdateRoom(dataConnect, updateRoomVars);

// Operation deleteRoom:  For variables, look at type DeleteRoomVars in ../index.d.ts
const { data } = await DeleteRoom(dataConnect, deleteRoomVars);


```