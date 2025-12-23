import { useEffect, useState } from "react";
import { API_URL } from "../api";

const API = `${API_URL}/api`;

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/submit/my-submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // compute unique months (YYYY) and months-per-year present in submissions
        const yearSet = new Set();
        const monthSet = new Set();
        data.forEach((s) => {
          const d = new Date(s.createdAt);
          yearSet.add(String(d.getFullYear()));
          monthSet.add(
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
          );
        });
        const yearArr = Array.from(yearSet).sort((a, b) => b.localeCompare(a)); // newest year first
        setYears(yearArr);
        const monthArr = Array.from(monthSet).sort((a, b) =>
          b.localeCompare(a)
        ); // newest first
        setMonths(monthArr);
        // default selected year/month to newest available if present
        if (monthArr.length > 0) {
          const [newestYear, newestMonth] = monthArr[0].split("-");
          setSelectedYear(newestYear);
          setSelectedMonth(newestMonth);
        }
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  const monthNames = [
    "All months",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatMonthLabel = (m, y) => {
    if (!m) return "All months";
    return `${monthNames[Number(m)]} ${y}`;
  };

  // filter logic: if year selected, filter by year; if month selected (1-12), filter by month and (optionally) year
  const filtered = submissions.filter((sub) => {
    const d = new Date(sub.createdAt);
    const y = String(d.getFullYear());
    const m = String(d.getMonth() + 1).padStart(2, "0");
    if (selectedYear && selectedMonth) {
      return y === selectedYear && m === selectedMonth;
    }
    if (selectedYear && !selectedMonth) {
      return y === selectedYear;
    }
    if (!selectedYear && selectedMonth) {
      return m === selectedMonth;
    }
    return true;
  });

  // pagination
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Submissions</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Year:</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <label className="text-sm font-medium">Month:</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All months</option>
            {/* list months 01..12 */}
            {Array.from({ length: 12 }, (_, i) => {
              const code = String(i + 1).padStart(2, "0");
              return (
                <option key={code} value={code}>
                  {monthNames[i + 1]}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing <strong>{totalItems}</strong> result
            {totalItems !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Per page:</label>
            <select
              className="border rounded px-2 py-1"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>
      </div>
      {submissions.length === 0 ? (
        <div className="p-6 bg-yellow-50 border rounded">
          No submissions yet.
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6 bg-gray-50 border rounded">
          {selectedYear && selectedMonth ? (
            <div>
              No submissions in {monthNames[Number(selectedMonth)]}{" "}
              {selectedYear}.
            </div>
          ) : selectedYear ? (
            <div>No submissions in {selectedYear}.</div>
          ) : selectedMonth ? (
            <div>
              No submissions in {monthNames[Number(selectedMonth)]} across
              years.
            </div>
          ) : (
            <div>No submissions for selected period.</div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full divide-y">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Problem</th>
                <th className="px-4 py-2 border">Verdict</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((sub) => (
                <tr key={sub._id}>
                  <td className="px-4 py-2 border">
                    {sub.problemId?.title || "Deleted Problem"}
                  </td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        sub.verdict === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : sub.verdict.includes("Wrong")
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {sub.verdict}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div>
            Page {currentPage} / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`px-3 py-1 border rounded ${
                  p === currentPage ? "bg-blue-600 text-white" : ""
                }`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
