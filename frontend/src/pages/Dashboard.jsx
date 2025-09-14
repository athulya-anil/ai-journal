import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import WordCloud from "react-d3-cloud";

// ====================== Utility Functions ======================
const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const keyFor = (date) => date.toISOString().split("T")[0];

const countWords = (text) => {
  if (!text) return 0;
  return text
    .replace(/\u200B/g, "")
    .replace(/\u00A0/g, " ")
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const streakEmoji = (count) => {
  if (count === 0) return "🌱";
  if (count < 3) return "🌱";
  if (count < 7) return "🌿";
  if (count < 14) return "🌳";
  return "🌲";
};

// ====================== Heatmap ======================
const ActivityHeatmap = ({ dailyCounts }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Last 30 Days</h2>
    <div className="grid grid-cols-10 gap-2">
      {dailyCounts.map((day) => {
        const color =
          day.wordCount === 0
            ? "bg-gray-100"
            : day.wordCount < 200
            ? "bg-green-200"
            : day.wordCount < 750
            ? "bg-green-400"
            : "bg-green-600";

        return (
          <div
            key={day.date}
            className={`h-10 w-10 rounded-lg flex items-center justify-center text-xs text-gray-800 cursor-pointer hover:scale-105 hover:opacity-90 transition ${color}`}
            title={`${formatDate(new Date(day.date))}: ${day.wordCount} words`}
          >
            {new Date(day.date).getDate()}
          </div>
        );
      })}
    </div>
  </div>
);

// ====================== Badges ======================
const Badges = ({ badges }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Achievements</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
        >
          <div className="text-4xl mb-2">{badge.emoji}</div>
          <h3 className="font-semibold text-gray-800">{badge.name}</h3>
          <p className="text-gray-500 text-sm text-center mt-1">
            {badge.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// ====================== Charts ======================
const Charts = ({ moodData, focusData }) => {
  const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Mindset</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={moodData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {moodData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Focus Areas</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={focusData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#34D399" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ====================== Word Cloud ======================
const WordCloudSection = ({ words }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Most Used Words</h2>
    <div className="flex justify-center">
      <WordCloud
        data={words}
        width={600}
        height={300}
        font="sans-serif"
        fontSize={(word) => Math.log2(word.value) * 10}
        rotate={0}
        padding={2}
      />
    </div>
  </div>
);

// ====================== Main Dashboard ======================
export default function Dashboard() {
  const [stats, setStats] = useState({
    totalWords: 0,
    activeDays: 0,
    longestStreak: 0,
    dailyCounts: [],
    badges: [],
    moodData: [],
    focusData: [],
    wordCloud: [],
  });

  useEffect(() => {
    const journalData = window.journalStorage || {};
    let totalWords = 0;
    let activeDays = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    const today = new Date();
    const last30Days = [];
    const wordFrequency = {};

    for (let i = 29; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const key = keyFor(day);
      const text = journalData[key] || "";
      const wordCount = countWords(text);

      text
        .toLowerCase()
        .split(/\s+/)
        .forEach((word) => {
          if (!word) return;
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });

      if (wordCount > 0) {
        totalWords += wordCount;
        activeDays++;
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }

      last30Days.push({ date: key, wordCount });
    }

    const badges = [
      { name: "Egg", description: "1 day streak", emoji: "🥚" },
      { name: "Flamingo", description: "10 days total", emoji: "🦩" },
      { name: "Novella", description: "10K words written", emoji: "📖" },
    ];

    const moodData = [
      { name: "Positive", value: 60 },
      { name: "Negative", value: 20 },
      { name: "Certain", value: 15 },
      { name: "Uncertain", value: 5 },
    ];

    const focusData = [
      { name: "Work", value: 40 },
      { name: "Health", value: 20 },
      { name: "Family", value: 15 },
      { name: "Travel", value: 10 },
      { name: "Other", value: 5 },
    ];

    const wordCloudData = Object.entries(wordFrequency)
      .map(([word, count]) => ({ text: word, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 40);

    setStats({
      totalWords,
      activeDays,
      longestStreak: maxStreak,
      dailyCounts: last30Days,
      badges,
      moodData,
      focusData,
      wordCloud: wordCloudData,
    });
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Athulya's Writing Dashboard {streakEmoji(stats.longestStreak)}
        </h1>
        <p className="text-gray-600">
          Tracking your writing journey, one day at a time
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Words", value: stats.totalWords, color: "text-emerald-600" },
          { label: "Active Days", value: stats.activeDays, color: "text-blue-600" },
          {
            label: "Longest Streak",
            value: `${stats.longestStreak} ${streakEmoji(stats.longestStreak)}`,
            color: "text-orange-600",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-gray-700">{item.label}</h2>
            <p className={`mt-2 text-3xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap dailyCounts={stats.dailyCounts} />

      {/* Badges */}
      <Badges badges={stats.badges} />

      {/* Charts */}
      <Charts moodData={stats.moodData} focusData={stats.focusData} />

      {/* Word Cloud */}
      <WordCloudSection words={stats.wordCloud} />

      {/* Back Button */}
      <div className="mt-10 text-center">
        <button
          onClick={() => (window.location.href = "/journal")}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          ← Back to Journal
        </button>
      </div>
    </div>
  );
}
