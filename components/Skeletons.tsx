import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />
    );
};

export const StoryCardSkeleton: React.FC = () => {
    return (
        <div className="w-40 md:w-48 flex-shrink-0 flex flex-col gap-3">
            {/* Cover Image Skeleton */}
            <Skeleton className="w-full aspect-square rounded-2xl" />
            {/* Title Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
};

export const ListSkeleton: React.FC = () => {
    return (
        <div className="flex gap-4 overflow-hidden py-2">
            <StoryCardSkeleton />
            <StoryCardSkeleton />
            <StoryCardSkeleton />
            <StoryCardSkeleton />
        </div>
    );
};
