import React, { useState } from "react";
import { useQuery, QueryClient, useMutation } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { getFilteredUsers } from "../services/user";
import { User } from "../model";
import UserList from "./UserList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  throttleTime: 0,
});

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: Infinity }}
    >
      <Users />
    </PersistQueryClientProvider>
  );
}

function Users() {
  const [filter, setFilter] = useState("");
  const {
    isLoading,
    error,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as Promise<User[]>;
    },
  });

  const editUserMutation = useMutation({
    onMutate: async ({ userId, partial }) => {
      queryClient.setQueryData<User[]>(["users"], (users) =>
        users?.map((user) =>
          user.id === userId ? { ...user, ...partial } : user
        )
      );
    },
    mutationFn: ({
      userId,
      partial,
    }: {
      userId: User["id"];
      partial: Partial<User>;
    }) => {
      return Promise.resolve();
    },
  });

  const removeUserMutation = useMutation({
    onMutate: async (userId) => {
      queryClient.setQueryData<User[]>(["users"], (users) =>
        users?.filter(({ id }) => id !== userId)
      );
    },
    mutationFn: (userId: string) => {
      return Promise.resolve();
    },
  });

  const filteredUsers = getFilteredUsers(filter, users);

  return (
    <main className="p-8 min-w-[300px]">
      {Heading()}
      {isLoading && <span>Loading…</span>}
      {Boolean(error) && <span>An error occurred</span>}
      {!isLoading && !error ? (
        <>
          {FilterInput()}
          {filteredUsers.length === 0 ? (
            NoUsers()
          ) : (
            <UserList
              users={filteredUsers}
              onEdit={(userId, partial) => {
                editUserMutation.mutate({ userId, partial });
              }}
              onRemove={(userId) => {
                removeUserMutation.mutate(userId);
              }}
            />
          )}
        </>
      ) : null}
    </main>
  );

  function Heading() {
    return (
      <h1 className="text-2xl mb-4">
        Users {users ? `(${filteredUsers.length}/${users?.length})` : ""}
      </h1>
    );
  }

  function FilterInput() {
    return (
      <input
        className="border p-2 mb-4"
        data-testid="filter-input"
        key="filter-input"
        type="text"
        placeholder="Filter by name or email"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
        }}
      />
    );
  }

  function NoUsers() {
    return <div>No users</div>;
  }
}

export default App;
