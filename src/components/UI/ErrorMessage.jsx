export default function ErrorMessage({
  message = "Something went wrong",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 mb-6 rounded-full bg-dark-700 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-muted-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-muted-300 mb-2">
        Failed to Load Data
      </h3>
      <p className="text-muted-400 text-center max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-dark-600 hover:bg-dark-500 text-muted-200 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
