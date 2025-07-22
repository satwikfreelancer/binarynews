import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function TrendingSidebar() {
  const { data: articles } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    select: (data) => data?.slice(0, 5) || [],
  });

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trending Now</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {articles.map((article, index) => (
          <div key={article.id} className="flex space-x-3">
            <div className="text-2xl font-bold text-slate-300">{index + 1}</div>
            <div className="flex-1">
              <Link href={`/article/${article.slug}`}>
                <h4 className="font-semibold text-sm text-slate-800 leading-snug mb-1 hover:text-primary cursor-pointer">
                  {article.title}
                </h4>
              </Link>
              <p className="text-xs text-slate-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(article.publishedAt!), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
