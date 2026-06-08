import express from "express";
import axios from "axios";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GOV_API = "https://data.gov.il/api/action/datastore_search"
const RESOURCE_MAIN = "053cea08-09bc-40ec-8f7a-156f0677aff3";  // המזהה החדש והמעודכן למאגר הרכב הפעיל
const RESOURCE_SPECS = "142a6c08-5bc8-4f9f-9e7d-eaae319f07a7"; // המזהה החדש למפרט הטכני

router.post("/plate", async (req, res) => {
  const { plate, km, price } = req.body;

  if (!plate || km === undefined || price === undefined) {
    return res
      .status(400)
      .json({ error: "נא לשלוח מספר רישוי, קילומטראז' ומחיר" });
  }

  // ניקוי מספר הרכב והשארתו כמחרוזת
  const cleanPlate = plate.replace(/-/g, "").trim();
  const parsedKm = parseInt(km) || 0;
  const parsedPrice = parseInt(price) || 0;

  try {
    // שלב 1: שליפה ממאגר הרכב המרכזי (שולחים את מספר הרכב כטקסט בתוך מערך)
    const mainRes = await axios.get(GOV_API, {
      params: {
        resource_id: RESOURCE_MAIN,
        filters: JSON.stringify({ mispar_rechev: [cleanPlate] }),
        limit: 1,
      },
    });

    const raw1 = mainRes.data?.result?.records?.[0];

    if (!raw1) {
      return res.status(404).json({ error: "רכב לא נמצא במאגר הממשלתי" });
    }

    // שלב 2: שליפה ממאגר המפרט הטכני לפי קוד דגם ושנת ייצור
    let raw2 = null;
    if (raw1.degem_cd && raw1.shnat_yitzur) {
      try {
        const specsRes = await axios.get(GOV_API, {
          params: {
            resource_id: RESOURCE_SPECS,
            filters: JSON.stringify({
              degem_cd: [String(raw1.degem_cd)],
              shnat_yitzur: [parseInt(raw1.shnat_yitzur)],
            }),
            limit: 1,
          },
        });

        raw2 = specsRes.data?.result?.records?.[0] || null;
      } catch (specsErr) {
        console.error(
          "Specs database fetch failed, continuing without specs:",
          specsErr
        );
      }
    }

    const carData = {
      plate: cleanPlate,
      make: raw1.tozeret_nm || "—",
      model: raw1.kinuy_mishari || "—",
      year: parseInt(raw1.shnat_yitzur) || null,
      color: raw1.tzeva_rechev || "—",
      fuelType: raw1.sug_delek_nm || "—",
      trim: raw1.ramat_gimur || "—",
      lastTest: raw1.mivchan_acharon_dt || null,
      licenseExpiry: raw1.tokef_dt || null,
      onRoadSince: raw1.moed_aliya_lakvish || null,
      ownership: raw1.baalut || "—",
      owners: parseInt(raw1.mispar_baalim) || null,
      tires: raw1.zmig_kidmi || "—",
      vin: raw1.misgeret || "—",
      engineSize: raw2?.nefach_manoa || null,
      horsepower: raw2?.hespek || null,
      seats: raw2?.mispar_mekomot || null,
      weight: raw2?.mishkal_kolel || null,
    };

    // חישובים מבוססי גיל עם הגנה מנפילות
    const currentYear = new Date().getFullYear();
    const age = carData.year ? currentYear - carData.year : 0;
    const expectedKm = age * 15000;
    const kmDiff = parsedKm - expectedKm;
    const ownersNote = carData.owners
      ? `מספר בעלים: ${carData.owners}`
      : "מספר בעלים לא ידוע";

    // יצירת ה-Prompt לבינה המלאכותית
    const prompt = `
You must respond with a valid JSON object. 
אתה מומחה לרכבים משומשים בישראל. נתח את הרכב הבא בהתבסס על נתוני המאגר הממשלתי.

נתוני הרכב:
- יצרן: ${carData.make}
- דגם: ${carData.model}
- רמת גימור: ${carData.trim}
- שנת ייצור: ${carData.year || "לא ידוע"} (${age ? `גיל: ${age} שנים` : "גיל לא ידוע"})
- צבע: ${carData.color}
- סוג דלק: ${carData.fuelType}
- ${ownersNote}
- בעלות נוכחית: ${carData.ownership}
${carData.engineSize ? `- נפח מנוע: ${carData.engineSize} סמ"ק` : ""}
${carData.horsepower ? `- הספק: ${carData.horsepower} כ"ס` : ""}
- קילומטראז' מדווח: ${parsedKm.toLocaleString()} ק"מ
- ממוצע לגיל הרכב: ${expectedKm.toLocaleString()} ק"מ
- סטייה מהממוצע: ${kmDiff > 0 ? "+" : ""}${kmDiff.toLocaleString()} ק"מ
- מחיר מבוקש: ${parsedPrice.toLocaleString()} ₪
- טסט אחרון: ${carData.lastTest || "לא ידוע"}
- תוקף רישיון: ${carData.licenseExpiry || "לא ידוע"}

חזור אך ורק עם פורמט ה-JSON הבא:
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
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 700,
      response_format: { type: "json_object" },
    });

    const rawText = completion.choices?.[0]?.message?.content || "";

    // ניתוח בטוח של תשובת ה-AI
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(rawText.trim());
    } catch (parseError) {
      console.error("AI JSON Parse Error:", parseError, "Raw text:", rawText);
      return res
        .status(500)
        .json({ error: "שגיאה בעיבוד נתוני הבינה המלאכותית" });
    }

    res.json({
      carData,
      analysis: aiAnalysis,
    });
  } catch (error) {
    if (error) {
      console.error("Gov API Error Details:", JSON.stringify(error));
    } else {
      console.error("Plate check error:", error || error);
    }
    res.status(500).json({ error: "שגיאה בבדיקת הרכב — נסה שוב" });
  }
});

export default router;
