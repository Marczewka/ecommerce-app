import { USER_ROLES, type UserAdminRes } from "@shared/dtos";
import { useState } from "react";
import api from "../../api/axios";
import { toast } from "sonner";
import ButtonSave from "./ButtonSave";
import ButtonCancel from "./ButtonCancel";
import ButtonDelete from "./ButtonDelete";
import ButtonEdit from "./ButtonEdit";

export default function UsersRow({
  user,
  fetchUsers: getUsers,
}: {
  user: UserAdminRes;
  fetchUsers: () => void;
}) {
  const [isEdited, setIsEdited] = useState(false);
  const [role, setRole] = useState("");

  const handleEdit = async (user: UserAdminRes) => {
    setRole(user.role);
    setIsEdited(true);
  };

  const handleSave = async () => {
    if (!(USER_ROLES as readonly string[]).includes(role)) {
      return toast.error(`Role must be either ${USER_ROLES.join(" or ")}`);
    }
    try {
      await api.put<UserAdminRes>(`/admin/users/${user.id}`, {
        role,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsEdited(false);
      getUsers();
    }
  };

  const handleCancel = async () => {
    setIsEdited(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete<UserAdminRes>(`/admin/users/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      getUsers();
    }
  };

  return (
    <tr className="border-b border-slate-200 transition-colors hover:bg-slate-50">
      {/* 1. ID */}
      <td className="p-2 text-sm font-medium text-slate-500">{user.id}</td>

      {/* 2. Username */}
      <td className="truncate p-2 text-sm font-medium text-slate-800">
        {user.username}
      </td>

      {/* 3. Role */}
      <td className="p-2">
        {isEdited ? (
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="role"
            className="w-full rounded border border-slate-300 p-2 text-center text-sm focus:outline-indigo-500"
          />
        ) : (
          <span className="rounded bg-slate-100 p-2 text-sm text-slate-700">
            {user.role}
          </span>
        )}
      </td>

      {/* 4. Created At */}
      <td className="p-2 text-sm text-slate-500">{String(user.createdAt)}</td>

      {/* 5. Actions */}
      <td className="p-2">
        <div className="flex justify-center gap-4">
          {isEdited ? (
            <>
              <ButtonSave handleSave={handleSave} />
              <ButtonCancel handleCancel={handleCancel} />
            </>
          ) : (
            <>
              <ButtonEdit handleEdit={() => handleEdit(user)} />
              <ButtonDelete handleDelete={() => handleDelete(user.id)} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
