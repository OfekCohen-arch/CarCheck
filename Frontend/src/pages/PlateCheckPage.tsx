import { useState } from "react";

interface CarGovData {
  make: string;
  model: string;
  year: string;
  color: string;
  engineSize: string;
  owners: string;
  lastTest: string;
}

interface Analysis {
  verdict: string;
  score: number;
  priceAssessment: string;
  kmAssessment: string;
  summary: string;
  warnings: string[];
  tips: string[];
}

const verdictConfig: Record<string, { emoji: string; bg: string; text: string; border: string }> = {
  "כדאי לקנות": { emoji: "✅", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "שקול היטב": { emoji: "⚠️", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  "המשך לחפש": { emoji: "❌", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

export  function PlateCheckPage() {
  const [plate, setPlate] = useState("");
  const [km, setKm] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState<CarGovData | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "gov" | "ai" | "done">("form");

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
      const plateRes = await fetch(
        `http://localhost:3030/plate/${plate.replace(/-/g, "")}`
      );
      const govData = await plateRes.json();
      if (govData.error) throw new Error("רכב לא נמצא במאגר");
      setCarData(govData);

      setStep("ai");
      const analyzeRes = await fetch("http://localhost:3030/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make: govData.make,
          model: govData.model,
          year: govData.year,
          km,
          price,
        }),
      });
      const aiData = await analyzeRes.json();
      if (aiData.error) throw new Error(aiData.error);
      setAnalysis(aiData);
      setStep("done");
    } catch (err: any) {
      setError(err.message || "שגיאה — נסה שוב");
      setStep("form");
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
        <div className="text-4xl mb-3">🔎</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          בדיקה לפי מספר רישוי
        </h1>
        <p className="text-gray-400">
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

        {carData && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              📋 דוח ממשלתי
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "יצרן", value: carData.make },
                { label: "דגם", value: carData.model },
                { label: "שנת ייצור", value: carData.year },
                { label: "צבע", value: carData.color },
                { label: "נפח מנוע", value: carData.engineSize ? `${carData.engineSize} סמ"ק` : "—" },
                { label: "מספר בעלים", value: carData.owners || "—" },
                { label: "טסט אחרון", value: carData.lastTest ? new Date(carData.lastTest).toLocaleDateString("he-IL") : "—" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-2xl px-4 py-3">
                  <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                  <div className="text-sm font-bold text-gray-800">{item.value || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis && verdict && (
          <div className="flex flex-col gap-4">
            <div className={`${verdict.bg} border-2 ${verdict.border} rounded-3xl p-6 text-center`}>
              <div className="text-5xl mb-3">{verdict.emoji}</div>
              <div className={`text-2xl font-black ${verdict.text} mb-2`}>
                {analysis.verdict}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-800">ציון כללי</span>
                <span className="text-2xl font-black text-blue-600">
                  {analysis.score}/100
                </span>
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

            <button
              onClick={() => { setCarData(null); setAnalysis(null); setPlate(""); setKm(""); setPrice(""); setStep("form"); }}
              className="w-full bg-white border-2 border-gray-200 text-gray-600 py-3 rounded-2xl font-bold hover:border-blue-300 transition-colors"
            >
              🔄 בדוק רכב אחר
            </button>
          </div>
        )}
      </div>
    </div>
  );
}