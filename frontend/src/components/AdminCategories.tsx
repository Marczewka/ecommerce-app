import type { CategoryAdminRes } from "@shared/dtos";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminCategories() {
  const [, setCategories] = useState<CategoryAdminRes[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data } = await api.get<CategoryAdminRes[]>("/categories/admin");
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    getCategories();
  }, []);

  return <></>;
}
