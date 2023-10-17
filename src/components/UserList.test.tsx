import React from "react";
import { render } from "@testing-library/react";
import UserList from "./UserList";
import { User } from "../model";

describe("UserList", () => {
  const users: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com" },
    { id: "2", name: "Bob", email: "bob@example.com" },
  ];

  it("renders correctly", () => {
    const { container } = render(
      <UserList users={users} onEdit={() => {}} onRemove={() => {}} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
