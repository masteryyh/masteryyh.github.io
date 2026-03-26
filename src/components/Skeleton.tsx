import { memo } from "react";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
    animation?: "pulse" | "none";
}

export const Skeleton = memo(function Skeleton({ className = "", variant = "text", width, height, animation = "pulse" }: SkeletonProps) {
    const animationClass = animation === "pulse" ? "animate-pulse" : "";
    const variantClass = variant === "circular" ? "rounded-full" : variant === "rectangular" ? "rounded-lg" : "rounded";

    const style: React.CSSProperties = {
        width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
        height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
    };

    return (
        <div
            className={`bg-border ${variantClass} ${animationClass} ${className}`}
            style={style}
            role="status"
            aria-label="Loading"
        />
    );
});

export const BlogCardSkeleton = memo(function BlogCardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="space-y-4">
                <Skeleton height={24} width="80%" />
                <div className="space-y-2">
                    <Skeleton height={16} width="100%" />
                    <Skeleton height={16} width="95%" />
                </div>
                <div className="flex gap-3 pt-2">
                    <Skeleton height={20} width={80} variant="rectangular" />
                    <Skeleton height={20} width={70} variant="rectangular" />
                    <Skeleton height={20} width={90} variant="rectangular" />
                </div>
            </div>
        </div>
    );
});

export const BlogPostSkeleton = memo(function BlogPostSkeleton() {
    return (
        <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
            <div className="space-y-3">
                <Skeleton height={44} width="90%" />
                <Skeleton height={44} width="70%" />
            </div>

            <div className="flex gap-4">
                <Skeleton height={18} width={100} />
                <Skeleton height={18} width={80} />
                <Skeleton height={18} width={120} />
            </div>

            <div className="space-y-4 pt-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton height={18} width="100%" />
                        <Skeleton height={18} width="100%" />
                        <Skeleton height={18} width="95%" />
                        <Skeleton height={18} width="100%" />
                        <Skeleton height={18} width="85%" />
                    </div>
                ))}
            </div>
        </div>
    );
});

export const HeaderSkeleton = memo(function HeaderSkeleton() {
    return (
        <div className="flex items-center justify-between p-4">
            <Skeleton height={32} width={150} />
            <div className="flex gap-2">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
            </div>
        </div>
    );
});
