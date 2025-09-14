import { useState } from "react";

export default function Journal() {
  const [entry, setEntry] = useState("");

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white px-8 py-10 max-w-3xl mx-auto">
      {/* Date and streak */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{formattedDate}</h1>
        <p className="text-gray-500 mt-2">1 day streak 🌱</p>
      </header>

      {/* Writing area - no border*/}
      <div
        className="prose prose-lg max-w-none focus:outline-none"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setEntry(e.currentTarget.textContent)}
        placeholder="Start writing here..."
        style={{
          minHeight: "70vh",
          lineHeight: "1.75",
          fontSize: "1.125rem",
          color: "#111827",
        }}
      ></div>

      {/* Word count at the bottom */}
      <footer className="mt-4 text-sm text-gray-500">
        {entry.trim().split(/\s+/).filter(Boolean).length} words
      </footer>
    </div>
  );
}

