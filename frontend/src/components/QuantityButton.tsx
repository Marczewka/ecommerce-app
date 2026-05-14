export function QuantityButton({
  type,
  changeQuantity,
  className,
}: {
  type: "plus" | "minus";
  changeQuantity: (type: string) => void;
  className?: string;
}) {
  return (
    <button
      onClick={() => changeQuantity(type)}
      className={`btn-dark cursor-center flex h-8 w-8 items-center justify-center overflow-hidden rounded-3xl ${className}`}
    >
      <span className="-translate-y-0.5 text-2xl font-bold">
        {type === "plus" ? "+" : "-"}
      </span>
    </button>
  );
}
