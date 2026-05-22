import { useState } from "react";
import api from "../../api/axios";
import type { CategoryAdminRes } from "@shared/dtos";
import { toast } from "sonner";
import ButtonCancel from "./ButtonCancel";
import ButtonSave from "./ButtonSave";

export default function CategoriesAdd({
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
    if (!name.trim() || !slug.trim()) {
      return toast.error("Name and Slug cannot be empty");
    }

    const savePromise = api.post<CategoryAdminRes>("/admin/categories", {
      name,
      slug,
    });

    toast.promise(savePromise, {
      loading: "Creating category...",
      success: () => {
        setIsAdding(false);
        setName("");
        setSlug("");
        fetchCategories();
        return "Category created successfully!";
      },
      error: (err) => {
        console.error(err);
        return "Failed to create category.";
      },
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setName("");
    setSlug("");
  };

  if (!isAdding) return null;

  return (
    <tr className="border-b border-slate-200 bg-indigo-50 transition-colors hover:bg-slate-50">
      {/* 1. ID (empty) */}
      <td className="p-2 text-sm text-slate-400 italic"></td>

      {/* 2. Name */}
      <td className="p-2">
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          className="w-full rounded border border-slate-300 bg-white p-2 text-center text-sm focus:outline-indigo-500"
        />
      </td>

      {/* 3. Slug */}
      <td className="p-2">
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="category-slug"
          className="w-full rounded border border-slate-300 bg-white p-2 text-center text-sm focus:outline-indigo-500"
        />
      </td>

      {/* 4. Created At (empty) */}
      <td className="p-2 text-sm text-slate-500"></td>

      {/* 5. Actions */}
      <td className="p-2">
        <div className="flex justify-center gap-4">
          <ButtonSave handleSave={handleAddSave} />
          <ButtonCancel handleCancel={handleCancel} />
        </div>
      </td>
    </tr>
  );
}
