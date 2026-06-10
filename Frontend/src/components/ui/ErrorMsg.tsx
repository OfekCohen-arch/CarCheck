interface Props {
  error: string;
}
export function ErrorMsg({ error }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold mb-4 flex items-center gap-2">
      ⚠️ {error}
    </div>
  );
}
