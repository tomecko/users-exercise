import React from "react";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { User } from "../model";

interface Props {
  users: User[];
  onEdit: (userId: User["id"], partial: Partial<User>) => void;
  onRemove: (userId: User["id"]) => void;
}

const UserList: React.FC<Props> = ({ users, onEdit, onRemove }) => {
  return (
    <ul>
      {users.map((user) => (
        <li
          key={user.id}
          className="group/user max-w-2xl border relative mb-2 p-2 pr-6 bg-blue-100 border-blue-400"
          data-testid="user"
        >
          {(["name", "email"] as const).map((key) =>
            UserInfo({ propKey: key, user })
          )}
          {RemoveUser({ user })}
        </li>
      ))}
    </ul>
  );

  function UserInfo({
    propKey,
    user,
  }: {
    propKey: "name" | "email";
    user: User;
  }) {
    return (
      <div className="group" key={propKey}>
        {user[propKey]}
        <button
          className="text-gray-600 invisible group-hover:visible"
          data-testid={`edit-user-${propKey}`}
          onClick={() => {
            const newValue =
              prompt(`Enter new ${propKey}`, user[propKey]) ?? "";
            onEdit(user.id, { [propKey]: newValue });
          }}
        >
          <HiPencil className="ml-2" />
        </button>
      </div>
    );
  }

  function RemoveUser({ user }: { user: User }) {
    return (
      <button
        className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-600 invisible group-hover/user:visible"
        data-testid="remove-user"
        onClick={() => {
          onRemove(user.id);
        }}
      >
        <HiTrash />
      </button>
    );
  }
};

export default UserList;
