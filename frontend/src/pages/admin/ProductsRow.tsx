import type { ProductAdminRes } from "@shared/dtos";
import { useState } from "react";
import api from "../../api/axios";
import { toast } from "sonner";
import ButtonSave from "./ButtonSave";
import ButtonCancel from "./ButtonCancel";
import ButtonDelete from "./ButtonDelete";
import ButtonEdit from "./ButtonEdit";

export default function ProductsRow({
  product,
  fetchProducts: getProducts,
}: {
  product: ProductAdminRes;
  fetchProducts: () => void;
}) {
  const [isEdited, setIsEdited] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");

  const handleEdit = (product: ProductAdminRes) => {
    setTitle(product.title);
    setSlug(product.slug);
    setPrice(String(product.price));
    setDescription(product.description || "");
    setCategoryId(String(product.categoryId));
    setImage(product.image || "");
    setIsEdited(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim() || !price || !categoryId) {
      return toast.error("Required fields cannot be empty");
    }

    const toastId = toast.loading("Updating product...");

    try {
      await api.put<ProductAdminRes>(`/admin/products/${product.id}`, {
        title,
        slug,
        price: parseFloat(price),
        description,
        categoryId: parseInt(categoryId),
        image,
      });

      toast.success("Product updated successfully!", { id: toastId });
      setIsEdited(false);
      getProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product.", { id: toastId });
    }
  };

  const handleCancel = () => {
    setIsEdited(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const toastId = toast.loading("Deleting product...");

    try {
      await api.delete<ProductAdminRes>(`/admin/products/${id}`);
      toast.success("Product deleted successfully!", { id: toastId });
      getProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.", { id: toastId });
    }
  };

  return (
    <tr className="border-b border-slate-200 transition-colors hover:bg-slate-50">
      {/* 1. ID */}
      <td className="p-2 text-sm font-medium text-slate-500">{product.id}</td>

      {isEdited ? (
        <>
          {/* 2. Title */}
          <td className="p-2">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded border border-slate-300 p-2 text-center text-sm focus:outline-indigo-500"
            />
          </td>

          {/* 3. Slug */}
          <td className="p-2">
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Slug"
              className="w-full rounded border border-slate-300 p-2 text-center text-sm focus:outline-indigo-500"
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
              className="w-full rounded border border-slate-300 p-2 text-center text-sm focus:outline-indigo-500"
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
              className="w-full rounded border border-slate-300 p-2 text-center text-sm focus:outline-indigo-500"
            />
          </td>

          {/* 6. Category ID */}
          <td className="p-2">
            <input
              id="categoryId"
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Cat ID"
              className="w-full rounded border border-slate-300 p-2 text-center text-sm focus:outline-indigo-500"
            />
          </td>

          {/* 7. Image URL Input */}
          <td className="p-2">
            <input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL"
              className="w-full rounded border border-slate-300 p-2 text-center text-sm focus:outline-indigo-500"
            />
          </td>
        </>
      ) : (
        <>
          {/* 2. Title */}
          <td
            className="truncate p-2 text-sm font-medium text-slate-800"
            title={product.title}
          >
            {product.title}
          </td>

          {/* 3. Slug */}
          <td
            className="truncate p-2 text-sm text-slate-500"
            title={product.slug}
          >
            {product.slug}
          </td>

          {/* 4. Price */}
          <td className="p-2 text-sm font-semibold text-slate-800">
            {product.price} zł
          </td>

          {/* 5. Description */}
          <td
            className="truncate p-2 text-sm text-slate-500"
            title={product.description || ""}
          >
            {product.description || (
              <span className="text-slate-300 italic">No description</span>
            )}
          </td>

          {/* 6. Category ID */}
          <td className="p-2 text-sm text-slate-600">{product.categoryId}</td>

          {/* 7. Image Preview */}
          <td className="p-2">
            <div className="flex h-12 w-full items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-12 max-w-full rounded border border-slate-100 object-contain p-0.5"
                />
              ) : (
                <span className="text-xs text-slate-300 italic">No image</span>
              )}
            </div>
          </td>
        </>
      )}

      {/* 8. Created At */}
      <td className="p-2 text-sm text-slate-500">
        {String(product.createdAt)}
      </td>

      {/* 9. Actions */}
      <td className="p-2">
        <div className="flex justify-center gap-4">
          {isEdited ? (
            <>
              <ButtonSave handleSave={handleSave} />
              <ButtonCancel handleCancel={handleCancel} />
            </>
          ) : (
            <>
              <ButtonEdit handleEdit={() => handleEdit(product)} />
              <ButtonDelete handleDelete={() => handleDelete(product.id)} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
