interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
    animation?: "pulse" | "wave" | "none";
}

export function Skeleton({ className = "", variant = "text", width, height, animation = "pulse" }: SkeletonProps) {
    const animationClass = animation === "pulse" ? "animate-pulse" : animation === "wave" ? "animate-shimmer" : "";

    const variantClass = variant === "circular" ? "rounded-full" : variant === "rectangular" ? "rounded-lg" : "rounded";

    const style: React.CSSProperties = {
        width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
        height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
    };

    return (
        <div
            className={`bg-gradient-to-r from-slate-200 via-slate-300/50 to-slate-200 dark:from-slate-700 dark:via-slate-600/50 dark:to-slate-700 ${variantClass} ${animationClass} ${className}`}
            style={{
                ...style,
                backgroundSize: animation === "wave" ? "200% 100%" : undefined,
            }}
            role="status"
            aria-label="Loading"
        />
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="group rounded-xl border border-slate-200/60 bg-white p-5 shadow-soft dark:border-slate-800/40 dark:bg-slate-900/90 sm:p-6">
            <div className="space-y-4">
                <Skeleton height={24} width="80%" animation="wave" />
                <div className="space-y-2">
                    <Skeleton height={16} width="100%" animation="wave" />
                    <Skeleton height={16} width="95%" animation="wave" />
                </div>
                <div className="flex gap-3 pt-2">
                    <Skeleton height={20} width={80} variant="rectangular" animation="wave" />
                    <Skeleton height={20} width={70} variant="rectangular" animation="wave" />
                    <Skeleton height={20} width={90} variant="rectangular" animation="wave" />
                </div>
            </div>
        </div>
    );
}

export function BlogPostSkeleton() {
    return (
        <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
            {/* Title */}
            <div className="space-y-3">
                <Skeleton height={44} width="90%" animation="wave" />
                <Skeleton height={44} width="70%" animation="wave" />
            </div>

            {/* Metadata */}
            <div className="flex gap-4">
                <Skeleton height={18} width={100} animation="wave" />
                <Skeleton height={18} width={80} animation="wave" />
                <Skeleton height={18} width={120} animation="wave" />
            </div>

            {/* Content blocks */}
            <div className="space-y-4 pt-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton height={18} width="100%" animation="wave" />
                        <Skeleton height={18} width="100%" animation="wave" />
                        <Skeleton height={18} width="95%" animation="wave" />
                        <Skeleton height={18} width="100%" animation="wave" />
                        <Skeleton height={18} width="85%" animation="wave" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function HeaderSkeleton() {
    return (
        <div className="flex items-center justify-between p-4">
            <Skeleton height={32} width={150} />
            <div className="flex gap-2">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
            </div>
        </div>
    );
}
