export default function ButtonDelete({
  handleDelete,
}: {
  handleDelete: () => void;
}) {
  return (
    <button
      className="cursor-pointer font-medium text-red-600 transition-colors hover:text-red-800"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
