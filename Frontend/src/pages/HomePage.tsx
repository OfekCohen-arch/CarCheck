import { useNavigate } from "react-router-dom"
const steps = [
    {
    number: "01",
    title: 'ספר לנו מה אתה צריך',
    description: "תקציב, שימוש, גודל משפחה - שאלון קצר של 5 שאלות"
    },
    {
    number: '02',
    title: 'קבל המלצות מותאמות אישית',
    description: "האלגוריתם שלנו מוצא את הרכבים שהכי מתאימים לך"
    },
    {
    number: '03',
    title: 'בדוק רכב ספציפי',
    description: 'הזן פרטי רכב וקבל ציון וניתוח AI מפורט'
    }
]
const features = [
    {
    icon:'🎯',
    title:"המלצה מותאמת אישית",
    description: "לא רשימה גנרית - רכבים שמתאימים בדיוק לצרכים שלך"
    },
    {
    icon:'📊',
    title: "ציון 0-100 לכל רכב",
    description:"אלגוריתם שמשקלל מחיר, קילומטראז' אמינות דגם וגיל"
    },
    {
    icon: '🤖',
    title:"ניתוח AI חכם",
    description: 'verdict  כדאי לקנות" או "תמשיך לחפש" — עם הסבר'
    },
    {
    icon:"",
    title:"צ'קליסט בדיקה",
    description: "מה לבדוק לפני שאתה חותם - כדי שלא תתחרט אחרי"
    }
]
export function HomePage(){
    const navigate = useNavigate()
    return (
    <div className="min-h-screen bg-white"
    style={{fontFamily: "'Heebo',sans-serif"}}
    dir="rtl"
    >
    <link
    href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap"
    rel="stylesheet"
    />
    <section className="relative overflow-hidden bg-gradient-to-bl from-blue-50 via-white to-white px-6 py-24 text-center">
    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"/>
    <div className="absolue bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full opacity-40 translate-x-1/3 translate-y-1/3"/>

    <div className="relative max-w-2xl mx-auto">
    <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
        🎯 יועץ הרכב החכם שלך
    </div>
    <h1 className="text-5xl font-black text-gray-900 leading-tight mb-6">
        האם הרכב הזה
    <br/>
    <span className="text-blue-600">שווה את הכסף?</span>
    </h1>
    <p className="text-lg text-gray-500 mb-10 leading-relaxed">
    הפסק לנחש. CarCheck מנתח את הרכב שאתה שוקל, משווה למחירי השוק,
    <br/>
    ואומר לך בדיוק אם זו עסקה טובה - או לא.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
    <button
    onClick={()=>navigate("/questionnaire")}
    className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 translation-all hover:scale-105 shadow-lg shadow-blue-200"
    >
 מצא לי רכב מתאים ←
    </button>
    <button
    onClick={()=>navigate("/car-check")}
    className="bg-white text-blue-600 border-2 border-blue-200 px-8 py-4 rounded-2xl text-lg font-bold hover:border-blue-400 transition-all"
    >
        בדוק רכב ספציפי
    </button>
    </div>
    </div>
    </section>

    <section className="px-6 py-20 max-w-4xl mx-auto">
    <h2 className="text-3xl font-black text-gray-900 text-center mb-4">
        איך זה עובד?
    </h2>
    <p className="text-gray-400 text-center mb-14">שלושה צעדים פשוטים</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
     {steps.map((step)=>(
        <div key={step.number} className="relative text-center">
        <div className="text-6xl font-black text-blue-100 mb-2">
        {step.number}
         </div>
         <h3 className="text-lg font-bold text-gray-800 mb-2">
        {step.title}
         </h3>
         <p className="text-gray-400 text-sm leading-relaxed">
        {step.description}
         </p>
        </div>
     ))}
    </div>
    </section>
    <section className="bg-gray-50 px-6 py-20">
    <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-black text-gray-900 text-center mb-14">
מה CarCheck עושה בשבילך
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {features.map((feature)=>(
        <div 
        key={feature.title}
        className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
        >
        <div className="text-3xl mb-3">{feature.icon}</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">
            {feature.title}
            </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
            {feature.description}
        </p>
        </div>
    ))}
    </div>
    </div>
    </section>
    <section className="px-6 py-20 text-center">
        <div className="max-w-xl mx-auto bg-blue-600 rounded-3xl p-12 text-white">  
        <h2 className="text-3xl font-black mb-4">מוכן לקנות רכב בחוכמה?</h2>
        <p className="text-blue-100 mb-8">
אל תקנה רכב בלי לבדוק אותו קודם - זה לוקח 2 דקות
        </p>
        <button 
        onClick={()=>navigate("/questionnaire")}
        className="bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-50 transition-all hover:scale-105"
        >
 התחל עכשיו - בחינם 🚗
        </button>
        </div>
      
    </section>
    </div>
    )
}