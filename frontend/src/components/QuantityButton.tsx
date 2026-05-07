export function QuantityButton({
  type,
  changeQuantity,
}: {
  type: "plus" | "minus";
  changeQuantity: (type: string) => void;
}) {
  return (
    <button
      onClick={() => changeQuantity(type)}
      className="btn-dark flex h-8 w-8 cursor-pointer items-center justify-center rounded-3xl"
    >
      <span className="-translate-y-0.5 text-2xl font-bold">
        {type === "plus" ? "+" : "-"}
      </span>
    </button>
  );
}
