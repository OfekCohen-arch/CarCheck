import { useLocation, useNavigate } from "react-router-dom";
import type {Answer,Car} from "../types/index.ts"



const carDatabase: Car[] = [
  {
    name: "טויוטה קורולה",
    years: "2017–2022",
    priceRange: "65,000 – 95,000 ₪",
    avgKm: "70,000 – 110,000",
    reliability: 95,
    fuelEconomy: 88,
    comfort: 80,
    pros: ["אמינות מעולה", "עלות תחזוקה נמוכה", "ערך שימור גבוה"],
    cons: ["נהיגה לא מרגשת", "עיצוב שמרני"],
    bestFor: "מי שרוצה רכב סולידי לטווח ארוך",
    score: 0,
  },
  {
    name: "טויוטה יאריס",
    years: "2016–2021",
    priceRange: "45,000 – 70,000 ₪",
    avgKm: "60,000 – 100,000",
    reliability: 92,
    fuelEconomy: 95,
    comfort: 72,
    pros: ["חיסכון בדלק מצוין", "קל לחנייה בעיר", "תחזוקה זולה"],
    cons: ["קטן למשפחה", "מנוע חלש יחסית"],
    bestFor: "נסיעות עיר ותקציב מצומצם",
    score: 0,
  },
  {
    name: "מאזדה 3",
    years: "2017–2022",
    priceRange: "70,000 – 105,000 ₪",
    avgKm: "65,000 – 105,000",
    reliability: 88,
    fuelEconomy: 82,
    comfort: 90,
    pros: ["נהיגה מהנה", "עיצוב יפה", "פנים מטופח"],
    cons: ["קצת יקר יותר", "חלקים יקרים לתיקון"],
    bestFor: "מי שרוצה גם נוחות וגם כיף בנהיגה",
    score: 0,
  },
  {
    name: "הונדה סיוויק",
    years: "2016–2021",
    priceRange: "65,000 – 95,000 ₪",
    avgKm: "70,000 – 115,000",
    reliability: 90,
    fuelEconomy: 85,
    comfort: 83,
    pros: ["חיסכון בדלק טוב", "מרחב פנימי גדול", "אמינות גבוהה"],
    cons: ["קשה למצוא במחיר טוב", "חלקי חילוף יקרים"],
    bestFor: "משפחה קטנה שרוצה חיסכון",
    score: 0,
  },
  {
    name: "יונדאי i35",
    years: "2015–2020",
    priceRange: "50,000 – 80,000 ₪",
    avgKm: "70,000 – 120,000",
    reliability: 82,
    fuelEconomy: 80,
    comfort: 85,
    pros: ["מרחב פנימי גדול", "אחריות טובה", "מחיר שוק אטרקטיבי"],
    cons: ["ערך שימור נמוך יותר", "תחזוקה בינונית"],
    bestFor: "משפחה שצריכה מקום בתקציב סביר",
    score: 0,
  },
  {
    name: "קיה ספורטאז'",
    years: "2016–2021",
    priceRange: "80,000 – 120,000 ₪",
    avgKm: "60,000 – 100,000",
    reliability: 84,
    fuelEconomy: 75,
    comfort: 92,
    pros: ["SUV מרווח", "טכנולוגיה מתקדמת", "נוחות גבוהה"],
    cons: ["צריכת דלק גבוהה יותר", "יקר לתחזוקה"],
    bestFor: "משפחה גדולה שרוצה SUV נוח",
    score: 0,
  },
  {
    name: "סקודה אוקטביה",
    years: "2016–2021",
    priceRange: "60,000 – 90,000 ₪",
    avgKm: "70,000 – 110,000",
    reliability: 85,
    fuelEconomy: 83,
    comfort: 88,
    pros: ["מרחב תא מטען ענק", "מחיר אטרקטיבי", "נוח לנסיעות ארוכות"],
    cons: ["פחות מוכר בישראל", "חלקי חילוף"],
    bestFor: "נסיעות בינעירוניות ומשפחה",
    score: 0,
  },
  {
    name: "פולקסווגן גולף",
    years: "2016–2021",
    priceRange: "70,000 – 105,000 ₪",
    avgKm: "65,000 – 105,000",
    reliability: 80,
    fuelEconomy: 84,
    comfort: 89,
    pros: ["נהיגה איכותית", "פנים מרשים", "תחושת רכב גרמני"],
    cons: ["תחזוקה יקרה", "אמינות פחות מיפניות"],
    bestFor: "מי שרוצה איכות אירופאית",
    score: 0,
  },
];

function scoreCarForUser(car: Car, answers: Answer): number {
  let score = 50;
  const budget = parseInt(answers.budget || "500000");
  const maxKm = parseInt(answers.maxKm || "999999");
  const maxAge = parseInt(answers.maxAge || "15");

  const carMinPrice = parseInt(car.priceRange.replace(/[^0-9]/g, "").slice(0, 6));
  if (carMinPrice <= budget) score += 15;
  else if (carMinPrice <= budget * 1.15) score += 5;
  else score -= 20;

  if (answers.priority === "fuel") score += (car.fuelEconomy - 80) * 0.5;
  if (answers.priority === "reliability") score += (car.reliability - 80) * 0.5;
  if (answers.priority === "comfort") score += (car.comfort - 80) * 0.5;
  if (answers.priority === "price") {
    if (carMinPrice < 60000) score += 15;
    else if (carMinPrice < 80000) score += 8;
  }

  const familySize = parseInt(answers.familySize || "2");
  if (familySize >= 4 && (car.name.includes("ספורטאז") || car.name.includes("i35") || car.name.includes("אוקטביה"))) score += 12;
  if (familySize <= 2 && (car.name.includes("יאריס") || car.name.includes("גולף"))) score += 8;

  if (answers.usage === "city" && car.name.includes("יאריס")) score += 10;
  if (answers.usage === "highway" && (car.name.includes("אוקטביה") || car.name.includes("קורולה"))) score += 10;
  if (answers.usage === "offroad" && car.name.includes("ספורטאז")) score += 15;

  return Math.min(99, Math.max(30, Math.round(score)));
}

function getScoreColor(score: number) {
  if (score >= 80) return { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500" };
  if (score >= 65) return { bg: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-500" };
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

  const scoredCars = carDatabase
    .map((car) => ({ ...car, score: scoreCarForUser(car, answers) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

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
        <p className="text-gray-400">
          בחרנו את הרכבים שהכי מתאימים לצרכים שלך
        </p>
      </div>

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

                  <div className={`${colors.bg} ${colors.text} px-4 py-2 rounded-2xl text-center`}>
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
                    <div className="text-sm font-bold text-gray-800">{car.priceRange}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <div className="text-xs text-gray-400 mb-1">קילומטראז' ממוצע</div>
                    <div className="text-sm font-bold text-gray-800">{car.avgKm}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { label: "אמינות", value: car.reliability },
                    { label: "חיסכון בדלק", value: car.fuelEconomy },
                    { label: "נוחות", value: car.comfort },
                  ].map((rating) => (
                    <div key={rating.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-24">{rating.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors.bar} rounded-full transition-all`}
                          style={{ width: `${rating.value}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-600 w-6">{rating.value}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div>
                    <div className="text-xs font-bold text-green-600 mb-2">✅ יתרונות</div>
                    {car.pros.map((pro) => (
                      <div key={pro} className="text-xs text-gray-600 mb-1">• {pro}</div>
                    ))}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-500 mb-2">⚠️ חסרונות</div>
                    {car.cons.map((con) => (
                      <div key={con} className="text-xs text-gray-600 mb-1">• {con}</div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate("/car-check", { state: { carName: car.name } })}
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