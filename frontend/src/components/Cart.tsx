import ProductCard from "./ProductCard";
import { useAppSelector } from "../app/store";

export default function Cart() {
  const cart = useAppSelector((state) => state.cart);

  return (
    <div>
      <div className="flex flex-col">
        <h1>Cart</h1>
      </div>
      <div className="mt-8 justify-self-end">
        <div className="min-w-[300px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-8">
            <span className="text-sm font-medium tracking-wider text-slate-500 uppercase">
              Total cost
            </span>
            <h2 className="text-2xl font-bold text-slate-800">
              $
              {cart
                .reduce(
                  (val, item) => val + Number(item.price) * item.quantity,
                  0,
                )
                .toFixed(2)}
            </h2>
          </div>

          <button className="mt-4 w-full rounded-lg bg-slate-800 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-slate-700">
            Proceed to Checkout
          </button>
        </div>
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
