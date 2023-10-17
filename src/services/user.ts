import { User } from "../model";

export function getFilteredUsers(filter: string, users: User[] | undefined) {
  const filterPhrase = filter.trim().toLowerCase();
  return (
    users?.filter((user) => {
      return (
        user.name.toLowerCase().includes(filterPhrase) ||
        user.email.toLowerCase().includes(filterPhrase)
      );
    }) ?? []
  );
}
