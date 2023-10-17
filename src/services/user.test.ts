import { getFilteredUsers } from "./user";

describe("getFilteredUsers", () => {
  const users = [
    { id: "1", name: "Alice", email: "alice@example.com" },
    { id: "2", name: "Bob", email: "bob@something.ch" },
    { id: "3", name: "Charlie", email: "charlie@example.com" },
  ];

  it("returns all users when filter is empty", () => {
    const filteredUsers = getFilteredUsers("", users);
    expect(filteredUsers).toEqual(users);
  });

  it("filters users by name", () => {
    const filteredUsers = getFilteredUsers("li", users);
    expect(filteredUsers).toEqual([
      { id: "1", name: "Alice", email: "alice@example.com" },
      { id: "3", name: "Charlie", email: "charlie@example.com" },
    ]);
  });

  it("filters users by email", () => {
    const filteredUsers = getFilteredUsers("bob", users);
    expect(filteredUsers).toEqual([
      { id: "2", name: "Bob", email: "bob@something.ch" },
    ]);
  });

  it("returns users matching filter", () => {
    const filteredUsers = getFilteredUsers("ch", users);
    expect(filteredUsers).toEqual([
      { id: "2", name: "Bob", email: "bob@something.ch" },
      { id: "3", name: "Charlie", email: "charlie@example.com" },
    ]);
  });

  it("returns an empty array when no users match the filter", () => {
    const filteredUsers = getFilteredUsers("d", users);
    expect(filteredUsers).toEqual([]);
  });
});
