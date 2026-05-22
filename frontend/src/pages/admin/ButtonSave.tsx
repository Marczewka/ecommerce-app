export default function ButtonSave({ handleSave }: { handleSave: () => void }) {
  return (
    <button
      className="cursor-pointer font-medium text-indigo-600 transition-colors hover:text-indigo-800"
      onClick={handleSave}
    >
      Save
    </button>
  );
}
