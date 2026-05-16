import type { CategoryAdminRes } from "@shared/dtos";
import { useState } from "react";
import api from "../../api/axios";

export default function RowEdit({
  category,
  fetchCategories: getCategories,
}: {
  category: CategoryAdminRes;
  fetchCategories: () => void;
}) {
  const [isEdited, setIsEdited] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleEdit = async (category: CategoryAdminRes) => {
    setName(category.name);
    setSlug(category.slug);
    setIsEdited(true);
  };

  const handleSave = async () => {
    try {
      await api.put<CategoryAdminRes>(`categories/admin/${category.id}`, {
        name,
        slug,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsEdited(false);
      getCategories();
    }
  };

  const handleCancel = async () => {
    setIsEdited(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete<CategoryAdminRes>(`categories/admin/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      getCategories();
    }
  };

  return (
    <>
      <tr key={category.id} className="border border-slate-200">
        <td>{category.id}</td>
        {isEdited ? (
          <>
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
          </>
        ) : (
          <>
            <td>{category.name}</td>
            <td>{category.slug}</td>
          </>
        )}
        <td>{String(category.createdAt)}</td>
        {isEdited ? (
          <td className="flex justify-around">
            <button
              className="cursor-pointer text-indigo-500"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="cursor-pointer text-indigo-500"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </td>
        ) : (
          <td className="flex justify-around">
            <button
              className="cursor-pointer text-indigo-500"
              onClick={() => handleEdit(category)}
            >
              Edit
            </button>
            <button
              className="cursor-pointer text-red-500"
              onClick={() => handleDelete(category.id)}
            >
              Delete
            </button>
          </td>
        )}
      </tr>
    </>
  );
}
