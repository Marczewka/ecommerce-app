import { useState } from "react";
import api from "../../api/axios";
import type { CategoryAdminRes } from "@shared/dtos";

export default function RowAdd({
  isAdding,
  setIsAdding,
  getCategories: fetchCategories,
}: {
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
  getCategories: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleAddSave = async () => {
    setIsAdding(false);
    setName("");
    setSlug("");
    try {
      await api.post<CategoryAdminRes>("categories/admin", { name, slug });
    } catch (error) {
      console.error(error);
    } finally {
      fetchCategories();
    }
  };

  return (
    <>
      {isAdding && (
        <tr className="border border-slate-200">
          <td></td>
          <td>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="name"
              className="w-full border border-slate-200 text-center"
            ></input>
          </td>
          <td>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="slug"
              className="w-full border border-slate-200 text-center"
            ></input>
          </td>
          <td></td>
          <td className="flex justify-around">
            <button
              className="cursor-pointer text-indigo-500"
              onClick={handleAddSave}
            >
              Save
            </button>
            <button
              className="cursor-pointer text-indigo-500"
              onClick={() => {
                setIsAdding(false);
                setName("");
                setSlug("");
              }}
            >
              Cancel
            </button>
          </td>
        </tr>
      )}
    </>
  );
}
