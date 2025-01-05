export function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative w-20 h-20">
        <div className="w-20 h-20 border-8 border-black animate-[spin_3s_linear_infinite]" />
        <div className="absolute top-0 w-20 h-20 border-8 border-[#FF90E8] animate-[spin_1.5s_linear_infinite]" />
      </div>
    </div>
  );
}
