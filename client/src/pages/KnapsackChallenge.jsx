// KnapsackChallenge.jsx
import React, { useState, useEffect } from 'react';
import '../styles/KnapsackChallenge.css';

const generateItems = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    weight: Math.floor(Math.random() * 10) + 1,
    value: Math.floor(Math.random() * 20) + 10,
    selected: false,
  }));
};

const capacityByDifficulty = {
  easy: 20,
  medium: 35,
  hard: 50,
};

const KnapsackChallenge = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [items, setItems] = useState([]);
  const [capacity, setCapacity] = useState(20);
  const [dpSolution, setDpSolution] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const count = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12;
    const cap = capacityByDifficulty[difficulty];
    const generatedItems = generateItems(count);
    setItems(generatedItems);
    setCapacity(cap);
    setDpSolution(solveKnapsack(generatedItems, cap));
    setScore(0);
  }, [difficulty]);

  const toggleSelect = (id) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setItems(newItems);
  };

  const evaluateSelection = () => {
    const totalWeight = items.reduce(
      (acc, item) => acc + (item.selected ? item.weight : 0),
      0
    );
    const totalValue = items.reduce(
      (acc, item) => acc + (item.selected ? item.value : 0),
      0
    );
    const optimalValue = dpSolution.maxValue;

    if (totalWeight > capacity) {
      alert('❌ Bag Overloaded! Try Again.');
      setScore(0);
    } else if (totalValue === optimalValue) {
      alert('✅ Perfect! You found the optimal set. +100 points');
      setScore(100);
    } else if (totalValue >= 0.9 * optimalValue) {
      alert('✅ Good job! You were close to optimal. +50 points');
      setScore(50);
    } else {
      alert('⚠ Keep trying to maximize your score!');
      setScore(0);
    }
  };

  return (
    <div className="knapsack-container">
      <h2 className="text-xl font-bold mb-2">🎒 Knapsack Challenge</h2>

      <div className="controls mb-4">
        <label className="mr-2">Select Difficulty:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="capacity">🧱 Capacity: {capacity}</div>

      <div className="items-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`item-card ${item.selected ? 'selected' : ''}`}
            onClick={() => toggleSelect(item.id)}
          >
            <div>⚖ {item.weight}kg</div>
            <div>💰 {item.value}</div>
          </div>
        ))}
      </div>

      <button className="evaluate-btn" onClick={evaluateSelection}>✅ Evaluate Selection</button>

      <div className="score mt-4">🏆 Score: {score}</div>
    </div>
  );
};

function solveKnapsack(items, capacity) {
  const n = items.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (items[i - 1].weight <= w) {
        dp[i][w] = Math.max(
          items[i - 1].value + dp[i - 1][w - items[i - 1].weight],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return { maxValue: dp[n][capacity], table: dp };
}

export default KnapsackChallenge;
