import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UnifiedCard } from "@/components/shared/page-layout";
import { cn } from "@/lib/utils";

export interface StoryCardProps {
    id: number;
    location: string;
    place: string;
    author: string;
    authorBadge?: string;
    tags: string[];
    bgGradient: string;
    image?: string;
}

export function StoryCard({
    id,
    location,
    place,
    author,
    authorBadge,
    tags,
    bgGradient,
    image
}: StoryCardProps) {
    const imagePath = image
        ? image.startsWith("http") || image.startsWith("/")
            ? image
            : `/community/${image}`
        : null;

    return (
        <Link href={`/community/stories/${id}`}>
            <UnifiedCard className="group p-0 gap-0">
                <div className="p-6 space-y-1 min-h-[88px] flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <MapPin className="size-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-100">{location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">{author}</span>
                        {authorBadge && (
                            <Badge
                                variant="outline"
                                className="rounded-lg border-orange-500/30 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs"
                            >
                                {authorBadge}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className={cn("h-[400px] md:h-[432px] relative overflow-hidden", !imagePath && bgGradient)}>
                    {imagePath && (
                        <Image
                            src={imagePath}
                            alt={place}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            {tags.map((tag, i) => (
                                <Badge
                                    key={i}
                                    variant="secondary"
                                    className="rounded-lg bg-white/90 dark:bg-black/50 backdrop-blur-sm text-neutral-700 dark:text-neutral-200 border-0 text-xs"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <span className="text-sm font-semibold text-white">{place}</span>
                    </div>
                </div>
            </UnifiedCard>
        </Link>
    );
}
