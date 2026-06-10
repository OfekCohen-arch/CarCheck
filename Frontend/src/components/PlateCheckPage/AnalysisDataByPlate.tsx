import type { Analysis } from "../../types"

interface Props{
analysis : Analysis
}

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
export function AnalysisDataByPlate({analysis}: Props){
      const verdict = analysis
    ? verdictConfig[analysis.verdict] || verdictConfig["שקול היטב"]
    : null;
    return ( verdict &&
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
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold mt-1">
              <div className="bg-white p-2 rounded-xl border border-gray-100 text-gray-600 shadow-3xs flex items-center justify-center">{analysis.priceAssessment}</div>
              <div className="bg-white p-2 rounded-xl border border-gray-100 text-gray-600 shadow-3xs flex items-center justify-center">{analysis.kmAssessment}</div>
              <div className="bg-white p-2 rounded-xl border border-gray-100 text-gray-600 shadow-3xs flex items-center justify-center">{analysis.ownersAssessment}</div>
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
        )
}