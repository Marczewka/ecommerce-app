import type { ProductAdminRes } from "@shared/dtos";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Products() {
  const [, setProducts] = useState<ProductAdminRes[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await api.get<ProductAdminRes[]>("/products/admin");
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    getProducts();
  }, []);

  return <></>;
}
