import type { CategoryAdminRes } from "@shared/dtos";
import { useState } from "react";
import api from "../../api/axios";
import { toast } from "sonner";
import ButtonSave from "./ButtonSave";
import ButtonCancel from "./ButtonCancel";
import ButtonDelete from "./ButtonDelete";
import ButtonEdit from "./ButtonEdit";

export default function CategoriesRow({
  category,
  fetchCategories: getCategories,
}: {
  category: CategoryAdminRes;
  fetchCategories: () => void;
}) {
  const [isEdited, setIsEdited] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleEdit = (category: CategoryAdminRes) => {
    setName(category.name);
    setSlug(category.slug);
    setIsEdited(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) {
      return toast.error("Name and Slug cannot be empty");
    }

    const toastId = toast.loading("Updating category...");

    try {
      await api.put<CategoryAdminRes>(`/admin/categories/${category.id}`, {
        name,
        slug,
      });
      toast.success("Category updated successfully!", { id: toastId });
      setIsEdited(false);
      getCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category.", { id: toastId });
    }
  };

  const handleCancel = () => {
    setIsEdited(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const toastId = toast.loading("Deleting category...");

    try {
      await api.delete<CategoryAdminRes>(`/admin/categories/${id}`);
      toast.success("Category deleted successfully!", { id: toastId });
      getCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category.", { id: toastId });
    }
  };

  return (
    <tr className="border-b border-slate-200 transition-colors hover:bg-slate-50">
      {/* 1. ID */}
      <td className="p-2 text-sm font-medium text-slate-500">{category.id}</td>

      {/* 2. Name */}
      <td className="p-2">
        {isEdited ? (
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded border border-slate-300 p-2 text-center text-sm focus:outline-indigo-500"
          />
        ) : (
          <span className="text-slate-800font-medium truncate p-2 text-sm font-medium text-slate-800">
            {category.name}
          </span>
        )}
      </td>

      {/* 3. Slug */}
      <td className="p-2">
        {isEdited ? (
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
            className="w-full rounded border border-slate-300 p-2 text-center text-sm focus:outline-indigo-500"
          />
        ) : (
          <span className="truncate p-2 text-sm text-slate-500">
            {category.slug}
          </span>
        )}
      </td>

      {/* 4. Created At */}
      <td className="p-2 text-sm text-slate-500">
        {String(category.createdAt)}
      </td>

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
              <ButtonEdit handleEdit={() => handleEdit(category)} />
              <ButtonDelete handleDelete={() => handleDelete(category.id)} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
