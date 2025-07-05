import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      navigate("/");
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to AlgoQuest!</h1>
      <p className="mb-4">Choose a game to play and sharpen your algorithm skills 🔥</p>

      <div className="grid gap-4">
        <button
          onClick={() => navigate("/maze")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          🧭 Maze Solver (Dijkstra)
        </button>

        {/* Future games */}
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed"
          disabled
        >
          🔒 Knapsack Challenge (DP) – Coming soon
        </button>
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed"
          disabled
        >
          🔒 Greedy Scheduling – Coming soon
        </button>
      </div>
    </div>
  );
}
