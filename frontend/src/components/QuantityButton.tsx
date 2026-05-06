export function QuantityButton({
  type,
  changeQuantity,
}: {
  type: string;
  changeQuantity: (type: string) => void;
}) {
  return (
    <button
      onClick={() => changeQuantity(type)}
      className="btn flex h-6 w-6 cursor-pointer items-center justify-center rounded-md shadow"
    >
      <span className="-translate-y-0.5 text-xl font-bold">
        {type === "plus" ? "+" : "-"}
      </span>
    </button>
  );
}
