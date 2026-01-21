export function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="text-center">
                {/* Modern spinner with gradient */}
                <div className="relative inline-block">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-transparent dark:border-slate-700 dark:border-t-transparent"></div>
                    <div
                        className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-emerald-500 dark:border-t-emerald-400"
                        style={{ animationDuration: "0.6s" }}
                    ></div>
                </div>
                <p className="mt-6 text-sm font-medium text-slate-600 dark:text-slate-400">Loading...</p>
            </div>
        </div>
    );
}
