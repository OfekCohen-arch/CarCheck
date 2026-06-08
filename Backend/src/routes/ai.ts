import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/analyze", async (req, res) => {
  const { make, model, year, km, price } = req.body;

  if (!make || !model || !year || !km || !price) {
    return res.status(400).json({ error: "חסרים פרטי רכב" });
  }

  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(year);
  const expectedKm = age * 15000;
  const kmDiff = parseInt(km) - expectedKm;

  const prompt = `
אתה מומחה לרכבים משומשים בישראל. נתח את הרכב הבא ותן המלצה ברורה.

פרטי הרכב:
- יצרן: ${make}
- דגם: ${model}
- שנת ייצור: ${year} (גיל: ${age} שנים)
- קילומטראז': ${parseInt(km).toLocaleString()} ק"מ
- מחיר מבוקש: ${parseInt(price).toLocaleString()} ₪
- קילומטראז' ממוצע לגיל זה: ${expectedKm.toLocaleString()} ק"מ
- סטייה מהממוצע: ${kmDiff > 0 ? "+" : ""}${kmDiff.toLocaleString()} ק"מ

החזר תשובה ב-JSON בלבד (ללא markdown, ללא קוד, רק JSON):
{
  "verdict": "כדאי לקנות" או "שקול היטב" או "המשך לחפש",
  "score": מספר בין 0 ל-100,
  "priceAssessment": "מחיר נמוך מהשוק" או "מחיר הוגן" או "מחיר גבוה מהשוק",
  "kmAssessment": "קילומטראז' נמוך" או "קילומטראז' תקין" או "קילומטראז' גבוה",
  "summary": "סיכום קצר של 2-3 משפטים בעברית",
  "warnings": ["אזהרה 1", "אזהרה 2"],
  "tips": ["טיפ לפני קנייה 1", "טיפ לפני קנייה 2"]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 600,
    });

    const raw = completion.choices[0]!.message.content || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(clean);

    res.json(analysis);
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "שגיאה בניתוח הרכב" });
  }
});

export default router;