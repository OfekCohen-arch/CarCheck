import type { CarFormData } from "../../types"
import { ErrorMsg } from "../ui/ErrorMsg"

interface Props{
form : CarFormData,
handleChange : (e: React.ChangeEvent<HTMLInputElement>) => void
handleSubmit: ()=>Promise<void>
error : string
loading: boolean
}
export function CarCheckForm({form, handleChange,handleSubmit,error,loading} : Props){
return (
<div>
  

  <div className="grid grid-cols-2 gap-4 mb-4">
    <div className="flex flex-col">
      <label className="text-xs text-gray-400 font-semibold mb-1.5 text-right px-1">יצרן</label>
      <input
        name="make"
        value={form.make}
        onChange={handleChange}
        placeholder="טויוטה"
        dir="rtl"
        className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors text-right"
      />
    </div>
    <div className="flex flex-col">
      <label className="text-xs text-gray-400 font-semibold mb-1.5 text-right px-1">דגם</label>
      <input
        name="model"
        value={form.model}
        onChange={handleChange}
        placeholder="קורולה"
        dir="rtl"
        className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors text-right"
      />
    </div>
  </div>

  <div className="mb-4 flex flex-col">
    <label className="text-xs text-gray-400 font-semibold mb-1.5 text-right px-1">שנת ייצור</label>
    <input
      name="year"
      value={form.year}
      onChange={handleChange}
      placeholder="2019"
      type="number"
      dir="rtl"
      className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>

  <div className="mb-4 flex flex-col">
    <label className="text-xs text-gray-400 font-semibold mb-1.5 text-right px-1">קילומטראז'</label>
    <input
      name="km"
      value={form.km}
      onChange={handleChange}
      placeholder="85000"
      type="number"
      dir="rtl"
      className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>

  <div className="mb-6 flex flex-col">
    <label className="text-xs text-gray-400 font-semibold mb-1.5 text-right px-1">מחיר מבוקש (₪)</label>
    <input
      name="price"
      value={form.price}
      onChange={handleChange}
      placeholder="75000"
      type="number"
      dir="rtl"
      className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>

{error && (
    <ErrorMsg error={error}/>
  )}

  <button
    onClick={handleSubmit}
    disabled={loading}
    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
  >
    {loading ? "מנתח..." : "נתח את הרכב 🔍"}
  </button>
</div>


)
}