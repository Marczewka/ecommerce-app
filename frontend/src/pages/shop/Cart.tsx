import CartItem from "./CartItem";
import { useAppSelector } from "../../app/store";

export default function Cart() {
  const cart = useAppSelector((state) => state.cart);

  return (
    <div className="grid grow grid-cols-6">
      <div className="col-span-4 col-start-2 p-10">
        <div className="flex flex-col">
          <h1>Cart</h1>
        </div>
        <ul className="flex flex-col gap-6">
          {cart.map((item) => (
            <li key={item.id}>
              <CartItem product={item} />
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-1 col-start-6 flex flex-col items-center gap-5 bg-white p-10">
        <div className="flex items-center justify-between gap-8">
          <span className="text-sm font-medium tracking-wider text-slate-500 uppercase">
            Total cost
          </span>
          <h2 className="text-2xl font-bold text-slate-800">
            $
            {(
              cart.reduce(
                (val, item) =>
                  val + Math.round(Number(item.price) * 100) * item.quantity,
                0,
              ) / 100
            ).toFixed(2)}
          </h2>
        </div>
        <button className="btn-light w-48">Proceed to Checkout</button>
      </div>
    </div>
  );
}
