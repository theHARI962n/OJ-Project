export default function adminSidebar({ setSelectedPage }) {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      <button
        onClick={() => setSelectedPage("problems")}
        className="block w-full text-left p-3 hover:bg-gray-700 rounded"
      >
        All Problems
      </button>

      <button
        onClick={() => setSelectedPage("create")}
        className="block w-full text-left p-3 hover:bg-gray-700 rounded"
      >
        Create Problem
      </button>

      <button
        onClick={() => setSelectedPage("edit")}
        className="block w-full text-left p-3 hover:bg-gray-700 rounded"
      >
        Edit Problem
      </button>
    </div>
  );
}
