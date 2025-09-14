import React, { useEffect, useRef, useState } from "react";

// Format date like "Sunday, September 14, 2025"
const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// Generate a storage key like "2025-09-14"
const keyFor = (date) => date.toISOString().split("T")[0];

// Build days for the current month
const buildMonthDays = (selectedDate, streakDays) => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let d = 1; d <= lastDay; d++) {
    const dateObj = new Date(year, month, d);
    const key = keyFor(dateObj);
    days.push({
      date: dateObj,
      day: d,
      hasEntry: Boolean(streakDays[key]),
      key,
    });
  }
  return days;
};

// Fixed word count to handle first word of each line correctly
const countWords = (text) => {
  if (!text) return 0;

  const normalized = text
    .replace(/\u200B/g, "")   // zero-width space
    .replace(/\u00A0/g, " ")  // non-breaking space -> normal space
    .trim();

  const words = normalized.split(/\s+/).filter((word) => word.length > 0);
  return words.length;
};

// Choose streak emoji
const streakEmoji = (count) => {
  if (count === 0) return "🌱";
  if (count < 3) return "🌱";
  if (count < 7) return "🌿";
  if (count < 14) return "🌳";
  return "🌲";
};

export default function Journal() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [text, setText] = useState("");
  const [streakDays, setStreakDays] = useState({});
  const [saveStatus, setSaveStatus] = useState("Saved ✔️");
  const editorRef = useRef(null);

  // Load text and streaks for the selected date
  useEffect(() => {
    const key = keyFor(selectedDate);
    setText(localStorage.getItem(key) || "");

    const storedStreaks = JSON.parse(localStorage.getItem("streakDays") || "{}");
    setStreakDays(storedStreaks);

    // Place cursor at end of editor
    requestAnimationFrame(() => {
      const el = editorRef.current;
      if (!el) return;

      el.innerText = localStorage.getItem(key) || "";
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      el.focus();
    });
  }, [selectedDate]);

  // Auto-save text with debounce
  useEffect(() => {
    setSaveStatus("Saving…");

    const timeout = setTimeout(() => {
      const key = keyFor(selectedDate);

      // Save or clear today's entry
      if (text.trim()) {
        localStorage.setItem(key, text);
      } else {
        localStorage.removeItem(key);
      }

      // Update streak tracking
      const updatedStreaks = { ...streakDays };
      if (text.trim()) updatedStreaks[key] = true;
      else delete updatedStreaks[key];

      setStreakDays(updatedStreaks);
      localStorage.setItem("streakDays", JSON.stringify(updatedStreaks));

      setSaveStatus("Saved ✔️");
    }, 500);

    return () => clearTimeout(timeout);
  }, [text, selectedDate]);

  const wordCount = countWords(text);

  // Day navigation
  const shiftDay = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  // Month navigation
  const goPrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1, 1);
    setSelectedDate(newDate);
  };

  const goNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1, 1);
    setSelectedDate(newDate);
  };

  const days = buildMonthDays(selectedDate, streakDays);
  const currentStreak = Object.keys(streakDays).filter((key) => streakDays[key]).length || 0;

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="text-sm text-gray-500">
          <button className="px-2 hover:text-gray-800" onClick={() => shiftDay(-1)} aria-label="Previous day">
            ◀
          </button>
          <button className="px-2 hover:text-gray-800" onClick={() => shiftDay(1)} aria-label="Next day">
            ▶
          </button>
        </div>

        <h1 className="text-center text-3xl font-bold">{formatDate(selectedDate)}</h1>

        <div className="text-sm text-gray-500">{saveStatus}</div>
      </div>

      {/* Month Strip */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 text-gray-600">
          <button onClick={goPrevMonth} className="px-2 py-1 hover:text-black" aria-label="Previous month">
            ◀
          </button>
          <span className="font-medium">
            {selectedDate.toLocaleString("en-US", { month: "short" })} {selectedDate.getFullYear()}
          </span>
          <button onClick={goNextMonth} className="px-2 py-1 hover:text-black" aria-label="Next month">
            ▶
          </button>
        </div>

        <div className="text-gray-700">
          {currentStreak} day streak <span className="text-lg">{streakEmoji(currentStreak)}</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex flex-wrap gap-1 mb-6">
        {days.map((d) => {
          const isActive = keyFor(d.date) === keyFor(selectedDate);
          const base =
            "w-6 h-6 rounded-md flex items-center justify-center text-[11px] cursor-pointer select-none transition-colors";
          const cls = isActive
            ? "bg-emerald-600 text-white"
            : d.hasEntry
            ? "bg-emerald-300 text-emerald-900"
            : "bg-gray-200 text-gray-500 hover:bg-gray-300";

          return (
            <div
              key={d.key}
              className={`${base} ${cls}`}
              title={d.date.toDateString()}
              onClick={() => setSelectedDate(d.date)}
            >
              {d.day}
            </div>
          );
        })}
      </div>

      {/* Writing Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-96 p-4 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 leading-relaxed"
        style={{ fontSize: "16px", lineHeight: "1.6" }}
        placeholder="Write something here..."
        onInput={(e) => setText(e.currentTarget.innerText)}
      ></div>

      {/* Footer Stats Bar */}
      <div className="mt-8 flex items-center gap-4 text-sm text-gray-600">
        <button
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          onClick={() => {
            window.location.href = "/dashboard"; // navigate to dashboard
          }}
        >
          📊 SEE STATS
        </button>

        <span className="font-medium">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </span>

        <span>•</span>

        <span>{saveStatus.replace("✔️", "Saved")}</span>
      </div>
    </div>
  );
}
