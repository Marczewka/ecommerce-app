import type { CategoryAdminRes } from "@shared/dtos";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import RowEdit from "./CategoriesRow";
import RowAdd from "./RowAdd";

export default function Categories() {
  const [categories, setCategories] = useState<CategoryAdminRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<CategoryAdminRes[]>("/categories/admin");
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col bg-white">
      {isLoading ? (
        <p className="animate-pulse text-center text-slate-500">Loading...</p>
      ) : (
        <>
          <table className="w-full text-center">
            <tr className="bg-slate-100">
              <th>id</th>
              <th>name</th>
              <th>slug</th>
              <th>createdAt</th>
              <th>actions</th>
            </tr>

            {categories.map((category) => (
              <RowEdit category={category} fetchCategories={fetchCategories} />
            ))}

            <RowAdd
              isAdding={isAdding}
              setIsAdding={setIsAdding}
              getCategories={fetchCategories}
            />
          </table>

          {!isAdding && (
            <button
              className="mt-6 cursor-pointer justify-self-center text-indigo-500"
              onClick={() => setIsAdding(true)}
            >
              Add
            </button>
          )}
        </>
      )}
    </div>
  );
}
