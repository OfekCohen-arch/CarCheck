import { ErrorMsg } from "../ui/ErrorMsg";

interface Props {
  plate: string;
  setPlate: (value: string) => void;
  km: string;
  setKm: (km : string) => void;
  error: string;
  loading: boolean;
  handleCheck: () => void;
  price : string
  setPrice: (price: string)=>void
}
export function PlateCheckForm({
  plate,
  setPlate,
  km,
  setKm,
  error,
  loading,
  handleCheck,
  price,
  setPrice
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-gray-400 font-semibold mb-1 block">
          מספר רישוי
        </label>
        <input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="12-345-67"
          className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 font-semibold mb-1 block">
            קילומטראז'
          </label>
          <input
            value={km}
            onChange={(e) => setKm(e.target.value)}
            placeholder="85000"
            type="number"
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-semibold mb-1 block">
            מחיר מבוקש ₪
          </label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="75000"
            type="number"
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:border-blue-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {error && <ErrorMsg error={error} />}

      <button
        onClick={handleCheck}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {loading ? "בודק..." : "בדוק רכב 🔍"}
      </button>
    </div>
  );
}
