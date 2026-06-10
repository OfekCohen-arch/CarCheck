import { useNavigate } from "react-router-dom"

export function AppHeader(){
    const navigate = useNavigate()
return(
<header>
    <link
    href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap"
    rel="stylesheet"
    />
    <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2 cursor-pointer" onClick={()=>navigate('/')}>
    <span className="text-2xl font-black text-blue-600">Car</span>
    <span className="text-2xl font-black text-gray-800">Check</span>
    <span className="text-xl">🚗</span>
    </div>
    <button onClick={()=>navigate('/questionnaire')}
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
        התחל עכשיו
    </button>
    </nav>
     
</header>
)
}