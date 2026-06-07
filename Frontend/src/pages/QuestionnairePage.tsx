import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Answer } from "../types";


const questions = [
  {
    id: "budget",
    title: "מה התקציב שלך?",
    subtitle: "כולל כל העלויות הנלוות",
    emoji: "💰",
    options: [
      { label: "עד 40,000 ₪", value: "40000" },
      { label: "40,000 – 70,000 ₪", value: "70000" },
      { label: "70,000 – 100,000 ₪", value: "100000" },
      { label: "מעל 100,000 ₪", value: "150000" },
    ],
  },
  {
    id: "usage",
    title: "איך תשתמש ברכב?",
    subtitle: "בחר את השימוש העיקרי",
    emoji: "🛣️",
    options: [
      { label: "🏙️ נסיעות עיר בלבד", value: "city" },
      { label: "🛣️ כביש מהיר / בינעירוני", value: "highway" },
      { label: "🔀 שילוב של שניהם", value: "mixed" },
      { label: "🏕️ טיולים / שטח", value: "offroad" },
    ],
  },
  {
    id: "familySize",
    title: "כמה נוסעים בדרך כלל?",
    subtitle: "זה ישפיע על גודל הרכב המומלץ",
    emoji: "👨‍👩‍👧",
    options: [
      { label: "🧍 רק אני", value: "1" },
      { label: "👫 זוג", value: "2" },
      { label: "👨‍👩‍👦 משפחה קטנה (3-4)", value: "4" },
      { label: "👨‍👩‍👧‍👦 משפחה גדולה (5+)", value: "5" },
    ],
  },
  {
    id: "priority",
    title: "מה הכי חשוב לך?",
    subtitle: "בחר עדיפות אחת מרכזית",
    emoji: "🎯",
    options: [
      { label: "⛽ חיסכון בדלק", value: "fuel" },
      { label: "🔧 אמינות ועלות תחזוקה נמוכה", value: "reliability" },
      { label: "💸 מחיר נמוך ככל האפשר", value: "price" },
      { label: "🛋️ נוחות ואיכות נסיעה", value: "comfort" },
    ],
  },
  {
    id: "maxAge",
    title: "עד כמה ישן הרכב יכול להיות?",
    subtitle: "רכב ישן יותר = מחיר נמוך יותר",
    emoji: "📅",
    options: [
      { label: "עד 3 שנים", value: "3" },
      { label: "עד 5 שנים", value: "5" },
      { label: "עד 8 שנים", value: "8" },
      { label: "לא משנה לי", value: "15" },
    ],
  },
  {
    id: "maxKm",
    title: "קילומטראז' מקסימלי?",
    subtitle: "15,000 ק\"מ לשנה זה ממוצע נורמלי",
    emoji: "📍",
    options: [
      { label: "עד 50,000 ק\"מ", value: "50000" },
      { label: "עד 80,000 ק\"מ", value: "80000" },
      { label: "עד 120,000 ק\"מ", value: "120000" },
      { label: "לא משנה לי", value: "999999" },
    ],
  },
];

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [animating, setAnimating] = useState(false);

  const question = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep((s) => s + 1);
        setAnimating(false);
      }, 300);
    } else {
      navigate("/results", { state: { answers: newAnswers } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ fontFamily: "'Heebo', sans-serif" }}
      dir="rtl"
    >
      <div className="w-full h-1.5 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={handleBack}
          className={`text-gray-400 text-sm hover:text-gray-600 transition-colors ${
            currentStep === 0 ? "invisible" : ""
          }`}
        >
          ← חזור
        </button>
        <span className="text-sm text-gray-400">
          {currentStep + 1} / {questions.length}
        </span>
      </div>

      <div
        className={`flex-1 flex flex-col items-center justify-center px-6 py-8 transition-opacity duration-300 ${
          animating ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-full max-w-lg">
          <div className="text-6xl text-center mb-6">{question.emoji}</div>

          <h1 className="text-3xl font-black text-gray-900 text-center mb-2">
            {question.title}
          </h1>
          <p className="text-gray-400 text-center mb-10">{question.subtitle}</p>

          <div className="flex flex-col gap-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-right text-gray-800 font-semibold hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all text-lg"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}