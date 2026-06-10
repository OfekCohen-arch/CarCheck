import type { CarGovData } from "../../types"

interface Props{
carData : CarGovData
}
export function GovReport({carData} : Props ){
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
return (
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
        )
}