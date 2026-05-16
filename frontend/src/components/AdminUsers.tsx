import type { UserAdminRes } from "@shared/dtos";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminUsers() {
  const [, setUsers] = useState<UserAdminRes[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await api.get<UserAdminRes[]>("/users/admin");
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, []);

  return <></>;
}
