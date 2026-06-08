import { useLocation, useNavigate } from "react-router-dom";
import type { Answer, Car } from "../types/index.ts";
import { useEffect, useState } from "react";

function getScoreColor(score: number) {
  if (score >= 80)
    return { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500" };
  if (score >= 65)
    return { bg: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-500" };
  return { bg: "bg-orange-100", text: "text-orange-700", bar: "bg-orange-400" };
}

function getMedalEmoji(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return "🔹";
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const answers: Answer = location.state?.answers || {};

  const [scoredCars, setScoredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (answers) loadResults();
  }, []);
  async function loadResults() {
    try {
      const res = await fetch("http://localhost:3030/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      setScoredCars(data.cars);
    } catch (error) {
      console.error("שגיאה בטעינת ההמלצות", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Heebo', sans-serif" }}
      dir="rtl"
    >
      <div className="bg-white border-b border-gray-100 px-6 py-8 text-center">
        <div className="text-4xl mb-3">🎯</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          הרכבים המומלצים עבורך
        </h1>
        <p className="text-gray-400">בחרנו את הרכבים שהכי מתאימים לצרכים שלך</p>
      </div>
      {loading && (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm">
          <div className="text-4xl mb-4 animate-bounce">🤖</div>
          <p className="text-gray-600 font-semibold">ה-AI בודק עבורך רכבים...</p>
          <p className="text-gray-400 text-sm mt-1">זה לוקח כמה שניות</p>
        </div>
      )}
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        {scoredCars.map((car, index) => {
          const colors = getScoreColor(car.score);
          return (
            <div
              key={car.name}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{getMedalEmoji(index)}</span>
                      <h2 className="text-xl font-black text-gray-900">
                        {car.name}
                      </h2>
                    </div>
                    <p className="text-gray-400 text-sm">{car.years}</p>
                  </div>

                  <div
                    className={`${colors.bg} ${colors.text} px-4 py-2 rounded-2xl text-center`}
                  >
                    <div className="text-2xl font-black">{car.score}</div>
                    <div className="text-xs font-semibold">ציון התאמה</div>
                  </div>
                </div>

                <div className="bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-xl mb-4">
                  ✅ {car.bestFor}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <div className="text-xs text-gray-400 mb-1">טווח מחיר</div>
                    <div className="text-sm font-bold text-gray-800">
                      {car.priceRange}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <div className="text-xs text-gray-400 mb-1">
                      קילומטראז' ממוצע
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {car.avgKm}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { label: "אמינות", value: car.reliability },
                    { label: "חיסכון בדלק", value: car.fuelEconomy },
                    { label: "נוחות", value: car.comfort },
                  ].map((rating) => (
                    <div key={rating.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-24">
                        {rating.label}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors.bar} rounded-full transition-all`}
                          style={{ width: `${rating.value}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600 w-6">
                        {rating.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div>
                    <div className="text-xs font-bold text-green-600 mb-2">
                      ✅ יתרונות
                    </div>
                    {car.pros.map((pro) => (
                      <div key={pro} className="text-xs text-gray-600 mb-1">
                        • {pro}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-500 mb-2">
                      ⚠️ חסרונות
                    </div>
                    {car.cons.map((con) => (
                      <div key={con} className="text-xs text-gray-600 mb-1">
                        • {con}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/car-check", { state: { carName: car.name } })
                  }
                  className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors text-sm"
                >
                  בדוק רכב ספציפי מסוג זה ←
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-12 flex flex-col gap-3">
        <button
          onClick={() => navigate("/questionnaire")}
          className="w-full bg-white border-2 border-gray-200 text-gray-600 py-3 rounded-2xl font-bold hover:border-blue-300 transition-colors"
        >
          🔄 התחל שאלון מחדש
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full text-gray-400 py-2 text-sm hover:text-gray-600 transition-colors"
        >
          חזור לדף הבית
        </button>
      </div>
    </div>
  );
}
