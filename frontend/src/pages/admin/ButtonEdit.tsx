export default function ButtonEdit({ handleEdit }: { handleEdit: () => void }) {
  return (
    <button
      className="cursor-pointer font-medium text-indigo-600 transition-colors hover:text-indigo-800"
      onClick={handleEdit}
    >
      Edit
    </button>
  );
}
