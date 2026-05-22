export default function ButtonAdd({ handleAdd }: { handleAdd: () => void }) {
  return (
    <button
      className="mt-4 cursor-pointer font-medium text-indigo-600 transition-colors hover:text-indigo-800"
      onClick={handleAdd}
    >
      + Add
    </button>
  );
}
