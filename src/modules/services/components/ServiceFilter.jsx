export default function ServiceFilter({ active, setActive }) {

  const filters = [
    "مقبول",
    "قيد الانتظار",
    "المجدولة",
    "الكل",
  ];

  return (
    <div className="flex justify-end gap-2 mb-15">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActive(filter)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition
            ${
              active === filter
                ? "bg-[#E8F0FF] text-[#3B82F6] border border-[#3B82F6]"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}