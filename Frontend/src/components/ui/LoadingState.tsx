interface Props{
msg: string
}
export function LoadingState({msg} : Props){
return(
    <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm">
              <div className="text-4xl mb-4 animate-bounce">🤖</div>
              <p className="text-gray-600 font-semibold">{msg}</p>
              <p className="text-gray-400 text-sm mt-1">זה לוקח כמה שניות</p>
            </div>
)
}