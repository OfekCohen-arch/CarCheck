import type { Analysis } from "../../types"

interface Props{
analysis : Analysis
}
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
export function AnalysisData({analysis}: Props){
    const verdict = analysis ? verdictConfig[analysis.verdict] || verdictConfig["שקול היטב"] : null;
return( verdict &&
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
)
}