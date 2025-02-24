export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/15 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-bounce mb-4">
          <span className="text-6xl">✨</span>
        </div>
        <p className="text-3xl font-bold">Es wird gezaubert ...</p>
      </div>
    </div>
  );
}