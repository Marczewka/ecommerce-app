import type { CategoryAdminRes } from "@shared/dtos";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import CategoriesRow from "./CategoriesRow";
import CategoriesAdd from "./CategoriesAdd";
import ButtonAdd from "./ButtonAdd";

export default function Categories() {
  const [categories, setCategories] = useState<CategoryAdminRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<CategoryAdminRes[]>("/admin/categories");
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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
                <th className="w-[30%] p-3 text-xs">NAME</th>
                <th className="w-[30%] p-3 text-xs">SLUG</th>
                <th className="w-[15%] p-3 text-xs">CREATEDAT</th>
                <th className="w-[15%] p-3 text-xs">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <CategoriesRow
                  key={category.id}
                  category={category}
                  fetchCategories={fetchCategories}
                />
              ))}

              <CategoriesAdd
                isAdding={isAdding}
                setIsAdding={setIsAdding}
                getCategories={fetchCategories}
              />
            </tbody>
          </table>

          {!isAdding && <ButtonAdd handleAdd={() => setIsAdding(true)} />}
        </div>
      )}
    </div>
  );
}
