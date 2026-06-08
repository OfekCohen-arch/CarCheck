import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
})

router.post("/recommend", async (req, res) => {
  const { budget, usage, familySize, priority, maxAge, maxKm } = req.body;
  
  const prompt = `
אתה מומחה לרכבים משומשים בישראל.
בהתאם לצרכים הבאים, המלץ על 4 רכבים מתאימים.

פרטי המשתמש:
- תקציב: עד ${budget} ₪
- שימוש: ${usage}
- גודל משפחה: ${familySize} נפשות
- עדיפות: ${priority}
- גיל רכב מקסימלי: ${maxAge} שנים
- קילומטראז' מקסימלי: ${maxKm} ק"מ

החזר JSON בלבד, ללא markdown:
{
  "cars": [
    {
      "name": "שם הרכב",
      "years": "2017–2022",
      "priceRange": "65,000 – 95,000 ₪",
      "avgKm": "70,000 – 110,000",
      "reliability": 90,
      "fuelEconomy": 85,
      "comfort": 80,
      "pros": ["יתרון 1", "יתרון 2", "יתרון 3"],
      "cons": ["חיסרון 1", "חיסרון 2"],
      "bestFor": "למי מתאים",
      "score": 88
    }
  ]
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 1500,
  });

  const raw = completion.choices[0]!.message.content || "";
  const clean = raw.replace(/```json|```/g, "").trim();
  const data = JSON.parse(clean);
  res.json(data);
});
export default router