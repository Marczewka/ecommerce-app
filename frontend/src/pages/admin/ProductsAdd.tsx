import { useState } from "react";
import api from "../../api/axios";
import type { ProductAdminReq, ProductAdminRes } from "@shared/dtos";
import { toast } from "sonner";
import slugify from "slugify";
import ButtonSave from "./ButtonSave";
import ButtonCancel from "./ButtonCancel";

export default function ProductsAdd({
  isAdding,
  setIsAdding,
  getProducts: fetchProducts,
}: {
  isAdding: boolean;
  setIsAdding: (value: boolean) => void;
  getProducts: () => void;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");

  const clearForm = () => {
    setTitle("");
    setSlug("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setImage("");
  };

  const handleSave = async () => {
    if (!title.trim() || !price || !categoryId) {
      return toast.error("Title, Price and Category ID cannot be empty");
    }

    if (Number(price) < 0) {
      return toast.error("Price cannot be negative");
    }

    try {
      await api.post<ProductAdminRes>("/admin/products", {
        title,
        slug: slug || slugify(title, { lower: true }),
        price: price,
        description: description,
        categoryId: Number(categoryId),
        image: image,
      } satisfies ProductAdminReq);

      toast.success("Product created successfully!");

      setIsAdding(false);
      clearForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    clearForm();
  };

  return (
    <>
      {isAdding && (
        <tr className="border-b border-slate-200 bg-indigo-50 transition-colors hover:bg-slate-50">
          {/* 1. ID (empty) */}
          <td className="p-2"></td>

          {/* 2. Title */}
          <td className="p-2">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product Title"
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
              placeholder="product-slug"
              className="w-full rounded border border-slate-300 bg-white p-2 text-center text-sm focus:outline-indigo-500"
            />
          </td>

          {/* 4. Price */}
          <td className="p-2">
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full rounded border border-slate-300 bg-white p-2 text-center text-sm focus:outline-indigo-500"
            />
          </td>

          {/* 5. Description */}
          <td className="p-2">
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full rounded border border-slate-300 bg-white p-2 text-center text-sm focus:outline-indigo-500"
            />
          </td>

          {/* 6. Category ID */}
          <td className="p-2">
            <input
              id="categoryId"
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Category ID"
              className="w-full rounded border border-slate-300 bg-white p-2 text-center text-sm focus:outline-indigo-500"
            />
          </td>

          {/* 7. Image */}
          <td className="p-2">
            <input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL"
              className="w-full rounded border border-slate-300 bg-white p-2 text-center text-sm focus:outline-indigo-500"
            />
          </td>

          {/* 8. Created At (empty) */}
          <td className="p-2"></td>

          <td className="p-2">
            <div className="flex justify-center gap-4">
              <ButtonSave handleSave={handleSave} />
              <ButtonCancel handleCancel={handleCancel} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
