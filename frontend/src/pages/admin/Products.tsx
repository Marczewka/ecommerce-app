import type { ProductAdminRes } from "@shared/dtos";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import ProductsRow from "./ProductsRow";
import ProductsAdd from "./ProductsAdd";
import ButtonAdd from "./ButtonAdd";

export default function Products() {
  const [products, setProducts] = useState<ProductAdminRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<ProductAdminRes[]>("/admin/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
                <th className="w-[5%] p-3 text-xs">ID</th>
                <th className="w-[15%] p-3 text-xs">TITLE</th>
                <th className="w-[12%] p-3 text-xs">SLUG</th>
                <th className="w-[8%] p-3 text-xs">PRICE</th>
                <th className="w-[20%] p-3 text-xs">DESCRIPTION</th>
                <th className="w-[8%] p-3 text-xs">CATEGORY ID</th>
                <th className="w-[12%] p-3 text-xs">IMAGE</th>
                <th className="w-[10%] p-3 text-xs">CREATED AT</th>
                <th className="w-[10%] p-3 text-xs">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <ProductsRow
                  key={product.id}
                  product={product}
                  fetchProducts={fetchProducts}
                />
              ))}

              <ProductsAdd
                isAdding={isAdding}
                setIsAdding={setIsAdding}
                getProducts={fetchProducts}
              />
            </tbody>
          </table>

          {!isAdding && <ButtonAdd handleAdd={() => setIsAdding(true)} />}
        </div>
      )}
    </div>
  );
}
