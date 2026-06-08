import { useState } from "react";
import type { Analysis } from "../types";
import type { CarGovData } from "../types";

const verdictConfig: Record<
  string,
  { emoji: string; bg: string; text: string; border: string }
> = {
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

export function PlateCheckPage() {
  const [plate, setPlate] = useState("");
  const [km, setKm] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState<CarGovData | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "gov" | "ai" | "done">("form");

  const formatDate = (dateStr: any) => {
    if (!dateStr) return "—";
    try {
      if (typeof dateStr === "string" && dateStr.length === 8 && !dateStr.includes("-")) {
        const y = dateStr.substring(0, 4);
        const m = dateStr.substring(4, 6);
        const d = dateStr.substring(6, 8);
        return `${d}/${m}/${y}`;
      }
      return new Date(dateStr).toLocaleDateString("he-IL");
    } catch {
      return "—";
    }
  };

  const handleCheck = async () => {
    if (!plate || !km || !price) {
      setError("נא למלא את כל השדות");
      return;
    }
    setError("");
    setLoading(true);
    setCarData(null);
    setAnalysis(null);

    try {
      setStep("gov");
      const res = await fetch("http://localhost:3030/plate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate, km, price }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "שגיאה בשרת");
      }

      setStep("ai");
      const data = await res.json();
      
      if (!data.carData || data.carData.error) throw new Error("רכב לא נמצא במאגר");
      
      setCarData(data.carData);
      setAnalysis(data.analysis);
      setStep("done");
    } catch (err: any) {
      setError(err.message || "שגיאה — נסה שוב");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const verdict = analysis
    ? verdictConfig[analysis.verdict] || verdictConfig["שקול היטב"]
    : null;

  return (
    <div
      className="min-h-screen bg-gray-50 pb-12"
      style={{ fontFamily: "'Heebo', sans-serif" }}
      dir="rtl"
    >
      <div className="bg-white border-b border-gray-100 px-6 py-8 text-center">
        <div className="text-4xl mb-3">🔎</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          בדיקה לפי מספר רישוי
        </h1>
        <p className="text-gray-500">
          הזן מספר רישוי וקבל דוח מלא מהמאגר הממשלתי + ניתוח AI
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-5">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-5">פרטי הבדיקה</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">
                מספר רישוי
              </label>
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="12-345-67"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">
                  קילומטראז'
                </label>
                <input
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  placeholder="85000"
                  type="number"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">
                  מחיר מבוקש ₪
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="75000"
                  type="number"
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            )}

            <button
              onClick={handleCheck}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? "בודק..." : "בדוק רכב 🔍"}
            </button>
          </div>
        </div>
                {/* שלבי טעינה דינמיים */}
        {loading && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className={`flex items-center gap-3 ${step === "gov" ? "opacity-100" : "opacity-40"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "gov" ? "bg-blue-600 text-white animate-pulse" : "bg-gray-100 text-gray-400"}`}>
                  1
                </div>
                <span className="text-sm font-semibold text-gray-700">שולף נתונים מהמאגר הממשלתי...</span>
              </div>
              <div className={`flex items-center gap-3 ${step === "ai" ? "opacity-100" : "opacity-40"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "ai" ? "bg-blue-600 text-white animate-pulse" : "bg-gray-100 text-gray-400"}`}>
                  2
                </div>
                <span className="text-sm font-semibold text-gray-700">מנתח עם AI...</span>
              </div>
            </div>
          </div>
        )}

        {/* תצוגת דוח AI חכם */}
        {analysis && verdict && (
          <div className={`rounded-3xl border ${verdict.border} ${verdict.bg} p-6 shadow-sm flex flex-col gap-4`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{verdict.emoji}</span>
                <h2 className={`text-xl font-black ${verdict.text}`}>{analysis.verdict}</h2>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-xl border font-bold text-gray-800 shadow-xs">
                ציון: {analysis.score}/100
              </div>
            </div>
            
            <p className="text-sm text-gray-700 leading-relaxed font-medium">{analysis.summary}</p>
            
            {/* תגיות הערכה מהירות */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold mt-1">
              <div className="bg-white p-2 rounded-xl border border-gray-100 text-gray-600 shadow-3xs">{analysis.priceAssessment}</div>
              <div className="bg-white p-2 rounded-xl border border-gray-100 text-gray-600 shadow-3xs">{analysis.kmAssessment}</div>
              <div className="bg-white p-2 rounded-xl border border-gray-100 text-gray-600 shadow-3xs">{analysis.ownersAssessment}</div>
            </div>

                        {analysis.warnings && analysis.warnings.length > 0 && (
              <div className="mt-2 border-t border-gray-100 pt-3">
                <h4 className="text-xs font-bold text-red-800 mb-1">⚠️ לשים לב:</h4>
                <ul className="list-disc list-inside text-xs text-red-700 flex flex-col gap-1">
                  {analysis.warnings.map((warning: string, i: number) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* טיפים לבדיקה בשטח */}
            {analysis.tips && analysis.tips.length > 0 && (
              <div className="mt-1">
                <h4 className="text-xs font-bold text-gray-800 mb-1">💡 טיפים לבדיקת הרכב במציאות:</h4>
                <ul className="list-disc list-inside text-xs text-gray-600 flex flex-col gap-1">
                  {analysis.tips.map((tip: string, i: number) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* תצוגת דוח המידע הממשלתי */}
        {carData && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📋 דוח ממשלתי גולמי</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: "יצרן", value: carData.make },
                { label: "דגם", value: carData.model },
                { label: "רמת גימור", value: carData.trim },
                { label: "שנת ייצור", value: carData.year },
                { label: "צבע", value: carData.color },
                { label: "סוג דלק", value: carData.fuelType },
                { label: "בעלות נוכחית", value: carData.ownership },
                { label: "מספר בעלים", value: carData.owners ?? "—" },
                { label: "נפח מנוע", value: carData.engineSize ? `${carData.engineSize} סמ"ק` : "—" },
                { label: "הספק", value: carData.horsepower ? `${carData.horsepower} כ"ס` : "—" },
                { label: "מושבים", value: carData.seats ?? "—" },
                { label: "משקל", value: carData.weight ? `${carData.weight} ק"ג` : "—" },
                { label: "צמיגים", value: carData.tires },
                { label: "עלייה לכביש", value: formatDate(carData.onRoadSince) },
                { label: "טסט אחרון", value: formatDate(carData.lastTest) },
                { label: "תוקף רישיון", value: formatDate(carData.licenseExpiry) },
              ].map((item, idx) => (
                <div key={idx} className="border-b border-gray-50 pb-2 flex flex-col">
                  <span className="text-[11px] text-gray-400 font-semibold">{item.label}</span>
                  <span className="text-sm font-bold text-gray-800 mt-0.5">{item.value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
