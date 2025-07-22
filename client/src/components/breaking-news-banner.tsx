import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import type { BreakingNews } from "@shared/schema";

export default function BreakingNewsBanner() {
  const { data: breakingNews } = useQuery<BreakingNews>({
    queryKey: ["/api/breaking-news"],
  });

  if (!breakingNews) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold uppercase">
            Breaking
          </span>
          <div className="flex-1 overflow-hidden">
            <span className="text-sm font-medium">{breakingNews.title}</span>
          </div>
          <Link href={breakingNews.url}>
            <div className="flex items-center text-sm hover:underline whitespace-nowrap">
              Read More
              <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
