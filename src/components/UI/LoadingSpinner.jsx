export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-dark-600 border-t-muted-400 rounded-full animate-spin mb-4"></div>
      <p className="text-muted-400 animate-pulse">{message}</p>
    </div>
  );
}
