import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      {/* Simple top navigation */}
      <nav className="flex justify-center gap-6 p-4 border-b bg-gray-50">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/journal" className="hover:underline">Journal</Link>
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      </nav>

      {/* Page content */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<JournalWrapper />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

/* 
  JournalWrapper:
  - Displays current streak
  - Editable writing area
  - Word count tracker
*/
function JournalWrapper() {
  const [streak] = useState(1); // Only displaying, not update yet
  const [text, setText] = useState("");

  // Function to pick emoji based on streak count
  const getStreakEmoji = (streak) => {
    if (streak < 3) return "🌱";  // Sapling
    if (streak < 7) return "🌿";  // Growing
    if (streak < 14) return "🌳"; // Full tree
    return "🌲";                    // Mighty tree
  };

  // Word count logic
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  return (
    <div style={{ textAlign: "center" }}>
      {/* Date */}
      <h1 className="text-3xl font-bold mb-2">Sunday, September 14, 2025</h1>

      {/* Streak display */}
      <div className="text-lg mb-6">
        {streak} day streak <span>{getStreakEmoji(streak)}</span>
      </div>

      {/* Writing area */}
      <div
        contentEditable
        placeholder="Start writing your thoughts..."
        onInput={(e) => setText(e.currentTarget.textContent)}
        style={{
          minHeight: "60vh",
          padding: "20px",
          outline: "none",
          fontSize: "1.1rem",
          lineHeight: "1.8",
          color: "#333",
          border: "none",
          textAlign: "left",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      ></div>

      {/* Word count */}
      <div
        style={{
          textAlign: "left",
          marginTop: "20px",
          fontSize: "0.9rem",
          color: "#555",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {wordCount} words
      </div>
    </div>
  );
}
