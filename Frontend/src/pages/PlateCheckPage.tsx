import { useState } from "react";
import type { Analysis } from "../types";
import type { CarGovData } from "../types";
import { PlateCheckForm } from "../components/PlateCheckPage/PlateCheckForm";
import { AnalysisDataByPlate } from "../components/PlateCheckPage/AnalysisDataByPlate";
import { GovReport } from "../components/PlateCheckPage/GovReport";


export function PlateCheckPage() {
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

          <PlateCheckForm plate={plate} setPlate={setPlate} km={km} setKm={setKm} error={error} loading={loading} handleCheck={handleCheck} price={price} setPrice={setPrice}/>
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

        {analysis &&  
        <AnalysisDataByPlate analysis={analysis}/>
        }

        {carData && <GovReport carData={carData}/>}
      </div>
    </div>
  );
}
