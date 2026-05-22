export default function ButtonCancel({
  handleCancel,
}: {
  handleCancel: () => void;
}) {
  return (
    <button
      className="cursor-pointer font-medium text-slate-500 transition-colors hover:text-slate-700"
      onClick={handleCancel}
    >
      Cancel
    </button>
  );
}
