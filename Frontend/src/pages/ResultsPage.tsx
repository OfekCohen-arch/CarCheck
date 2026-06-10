import { useLocation, useNavigate } from "react-router-dom";
import type { Answer, Car } from "../types/index.ts";
import { useEffect, useState } from "react";
import { RecommendationList } from "../components/Results/RecommendationList.tsx";
import { LoadingState } from "../components/ui/LoadingState.tsx";


export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const answers: Answer = location.state?.answers || {};

  const [scoredCars, setScoredCars] = useState<Car[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (answers && !hasLoaded){
        setHasLoaded(true)
         loadResults();
        }
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
        <LoadingState msg={'ה-AI בודק עבורך רכבים...'}/>
      )}
      <RecommendationList scoredCars={scoredCars}/>

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
