import { useState } from "react";
import { useLocation } from "react-router-dom";
import { type CarFormData, type Analysis } from "../types";
import { CarCheckForm } from "../components/CarCheck/CarCheckForm";
import { AnalysisData } from "../components/CarCheck/AnalysisData.tsx";
import { LoadingState } from "../components/ui/LoadingState.tsx";

export default function CarCheckPage() {
  const location = useLocation();
  const prefillCar = location.state?.carName || "";

  const [form, setForm] = useState<CarFormData>({
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

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Heebo', sans-serif" }}
      dir="rtl"
    >
      <div className="bg-white border-b border-gray-100 px-6 py-8 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          בדיקת רכב ספציפי
        </h1>
        <p className="text-gray-400">הזן את פרטי הרכב וקבל ניתוח AI מפורט</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-5">פרטי הרכב</h2>
          <div className="flex flex-col gap-4">
            <CarCheckForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              error={error}
              loading={loading}
            />
          </div>
        </div>
      

      {loading && (
        <LoadingState msg={'ה-AI מנתח את הרכב...'}/>
      )}

      {analysis && <AnalysisData analysis={analysis} />}
      </div>
    </div>
  );
}
