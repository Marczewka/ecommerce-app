import type { UserAdminRes } from "@shared/dtos";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import UsersRow from "./UsersRow";

export default function Users() {
  const [users, setUsers] = useState<UserAdminRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<UserAdminRes[]>("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col rounded-lg bg-white p-4 shadow-sm">
      {isLoading ? (
        <p className="animate-pulse text-center text-slate-500">Loading...</p>
      ) : (
        <div className="flex flex-col items-center overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-center">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 font-semibold text-slate-700">
                <th className="w-[10%] p-3 text-xs">ID</th>
                <th className="w-[35%] p-3 text-xs">USERNAME</th>
                <th className="w-[20%] p-3 text-xs">ROLE</th>
                <th className="w-[20%] p-3 text-xs">CREATED AT</th>
                <th className="w-[15%] p-3 text-xs">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <UsersRow key={user.id} user={user} fetchUsers={fetchUsers} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
