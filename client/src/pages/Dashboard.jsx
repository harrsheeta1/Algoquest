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
    onClick={() => navigate("/knapsack")}
    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
  >
    🎒 Knapsack Challenge (DP)
  </button>
         <button
        onClick={() => navigate("/greedy")}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
      >
        💰 Greedy Treasure Game
      </button>
      <button
    onClick={() => navigate("/sudoku")}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
  >
    🧩 Sudoku Solver
  </button>
      </div>
    </div>
  );
}
