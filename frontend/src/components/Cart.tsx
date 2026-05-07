import ProductCard from "./ProductCard";
import { useAppSelector } from "../app/store";

export default function Cart() {
  const cart = useAppSelector((state) => state.cart);

  return (
    <div>
      <div className="flex flex-col">
        <h1>Cart</h1>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,min(240px))] justify-center justify-items-center gap-8">
        {cart.map((item) => (
          <li key={item.id}>
            <ProductCard product={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
