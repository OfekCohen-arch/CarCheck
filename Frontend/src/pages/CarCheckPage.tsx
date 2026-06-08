import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { Analysis } from "../types";


const verdictConfig: Record<string, { emoji: string; bg: string; text: string; border: string }> = {
  "כדאי לקנות": {
    emoji: "✅",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  "שקול היטב": {
    emoji: "⚠️",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  "המשך לחפש": {
    emoji: "❌",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export default function CarCheckPage() {
  const location = useLocation();
  const prefillCar = location.state?.carName || "";

  const [form, setForm] = useState({
    make: prefillCar.split(" ")[0] || "",
    model: prefillCar.split(" ").slice(1).join(" ") || "",
    year: "",
    km: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.make || !form.model || !form.year || !form.km || !form.price) {
      setError("נא למלא את כל השדות");
      return;
    }
    setError("");
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch("http://localhost:3030/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
    } catch (err) {
      setError("שגיאה בניתוח הרכב — נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const verdict = analysis ? verdictConfig[analysis.verdict] || verdictConfig["שקול היטב"] : null;

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Heebo', sans-serif" }}
      dir="rtl"
    >
      <div className="bg-white border-b border-gray-100 px-6 py-8 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">בדיקת רכב ספציפי</h1>
        <p className="text-gray-400">הזן את פרטי הרכב וקבל ניתוח AI מפורט</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-5">פרטי הרכב</h2>
          
          <div className="flex flex-col gap-4"> 
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">יצרן</label>
                <input
                  name="make"
                  value={form.make}
                  onChange={handleChange}
                  placeholder="טויוטה"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">דגם</label>
                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="קורולה"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">שנת ייצור</label>
              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="2019"
                type="number"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">קילומטראז'</label>
              <input
                name="km"
                value={form.km}
                onChange={handleChange}
                placeholder="85000"
                type="number"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">מחיר מבוקש (₪)</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="75000"
                type="number"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "מנתח..." : "נתח את הרכב 🔍"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm">
            <div className="text-4xl mb-4 animate-bounce">🤖</div>
            <p className="text-gray-600 font-semibold">ה-AI מנתח את הרכב...</p>
            <p className="text-gray-400 text-sm mt-1">זה לוקח כמה שניות</p>
          </div>
        )}

        {analysis && verdict && (
          <div className="flex flex-col gap-4">
            <div className={`${verdict.bg} border-2 ${verdict.border} rounded-3xl p-6 text-center`}>
              <div className="text-5xl mb-3">{verdict.emoji}</div>
              <div className={`text-2xl font-black ${verdict.text} mb-2`}>
                {analysis.verdict}
              </div>
              <div className="text-gray-600 text-sm leading-relaxed">
                {analysis.summary}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-800">ציון כללי</span>
                <span className="text-2xl font-black text-blue-600">{analysis.score}/100</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                <div className="text-xs text-gray-400 mb-1">הערכת מחיר</div>
                <div className="text-sm font-bold text-gray-800">{analysis.priceAssessment}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                <div className="text-xs text-gray-400 mb-1">הערכת ק"מ</div>
                <div className="text-sm font-bold text-gray-800">{analysis.kmAssessment}</div>
              </div>
            </div>

            {analysis.warnings.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3">⚠️ נקודות לתשומת לב</h3>
                <div className="flex flex-col gap-2">
                  {analysis.warnings.map((w, i) => (
                    <div key={i} className="text-sm text-gray-600 bg-orange-50 px-4 py-2 rounded-xl">
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.tips.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3">💡 טיפים לפני הקנייה</h3>
                <div className="flex flex-col gap-2">
                  {analysis.tips.map((tip, i) => (
                    <div key={i} className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-xl">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}