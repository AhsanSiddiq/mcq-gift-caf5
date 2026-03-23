export default function AdBanner() {
  return (
    <div className="w-full max-w-4xl mx-auto my-8 border-2 border-dashed border-gray-700/30 rounded-lg p-6 bg-gray-800/10 flex flex-col items-center justify-center min-h-[120px] backdrop-blur-sm transition-all hover:bg-gray-800/20">
      <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-1">Advertisement</p>
      <p className="text-gray-500 text-xs">Space reserved for AdSense</p>
    </div>
  );
}
