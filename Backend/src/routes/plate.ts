import express from "express";
import axios from "axios";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/check", async (req, res) => {
  const { plate, km, price } = req.body;

  if (!plate || !km || !price) {
    return res.status(400).json({ error: "נא לשלוח מספר רישוי, קילומטראז' ומחיר" });
  }

  try {
    // שלב 1 — שליפת נתונים מהממשלה
    const cleanPlate = plate.replace(/-/g, "");

    const govResponse = await axios.get(
      "https://data.gov.il/api/3/action/datastore_search",
      {
        params: {
          resource_id: "053cea08-09bc-40ec-8f7a-156f0677aff3",
          q: cleanPlate,
          limit: 1,
        },
      }
    );

    const records = govResponse.data?.result?.records;
    if (!records || records.length === 0) {
      return res.status(404).json({ error: "רכב לא נמצא במאגר הממשלתי" });
    }

    const raw = records[0];

    // מיפוי שדות ממשלתיים לעברית ברורה
    const carData = {
      plate: cleanPlate,
      make: raw.tozeret_nm || "—",
      model: raw.kinuy_mishari || "—",
      year: raw.shnat_yitzur || "—",
      color: raw.tzeva_rechev || "—",
      engineSize: raw.nefach_manoa || "—",
      owners: raw.mispar_baalim || "—",
      lastTest: raw.mivchan_acharon_dt || null,
      fuelType: raw.sug_delek_nm || "—",
      bodyType: raw.degem_nm || "—",
      country: raw.tozeret_cd ? raw.tozeret_nm : "—",
    };

    // שלב 2 — ניתוח AI
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(carData.year);
    const expectedKm = age * 15000;
    const kmDiff = parseInt(km) - expectedKm;

    const prompt = `
אתה מומחה לרכבים משומשים בישראל. נתח את הרכב הבא בהתבסס על נתוני המאגר הממשלתי.

נתוני הרכב:
- יצרן: ${carData.make}
- דגם: ${carData.model}
- שנת ייצור: ${carData.year} (גיל: ${age} שנים)
- צבע: ${carData.color}
- נפח מנוע: ${carData.engineSize} סמ"ק
- סוג דלק: ${carData.fuelType}
- מספר בעלים קודמים: ${carData.owners}
- קילומטראז' מדווח: ${parseInt(km).toLocaleString()} ק"מ
- ממוצע לגיל הרכב: ${expectedKm.toLocaleString()} ק"מ
- סטייה מהממוצע: ${kmDiff > 0 ? "+" : ""}${kmDiff.toLocaleString()} ק"מ
- מחיר מבוקש: ${parseInt(price).toLocaleString()} ₪

החזר JSON בלבד ללא markdown:
{
  "verdict": "כדאי לקנות" או "שקול היטב" או "המשך לחפש",
  "score": מספר בין 0 ל-100,
  "priceAssessment": "מחיר נמוך מהשוק" או "מחיר הוגן" או "מחיר גבוה מהשוק",
  "kmAssessment": "קילומטראז' נמוך" או "קילומטראז' תקין" או "קילומטראז' גבוה",
  "ownersAssessment": "מספר בעלים תקין" או "מספר בעלים גבוה — בדוק היסטוריה",
  "summary": "סיכום של 2-3 משפטים בעברית",
  "warnings": ["אזהרה 1", "אזהרה 2"],
  "tips": ["טיפ 1", "טיפ 2", "טיפ 3"]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 700,
    });

    const rawText = completion.choices[0]!.message.content || "";
    const clean = rawText.replace(/```json|```/g, "").trim();
    const aiAnalysis = JSON.parse(clean);

    // שלב 3 — החזר הכל ביחד
    res.json({
      carData,
      analysis: aiAnalysis,
    });

  } catch (error: any) {
    console.error("Plate check error:", error.message);
    res.status(500).json({ error: "שגיאה בבדיקת הרכב — נסה שוב" });
  }
});

export default router;