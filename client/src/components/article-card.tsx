import { Link } from "wouter";
import { Eye, MessageCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Article, Category } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: Article;
  category?: Category;
}

export default function ArticleCard({ article, category }: ArticleCardProps) {
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="sm:flex">
          <div className="sm:w-1/3 mb-4 sm:mb-0 sm:mr-6">
            {article.featuredImage && (
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-48 sm:h-32 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="sm:w-2/3">
            <div className="flex items-center space-x-2 mb-2">
              {category && (
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: category.color + "20", color: category.color }}
                >
                  {category.name}
                </Badge>
              )}
              <span className="text-slate-500 text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(publishedDate, { addSuffix: true })}
              </span>
            </div>
            <Link href={`/article/${article.slug}`}>
              <h3 className="text-lg font-semibold text-slate-800 mb-2 hover:text-primary cursor-pointer">
                {article.title}
              </h3>
            </Link>
            <p className="text-slate-600 text-sm mb-3 leading-relaxed">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{article.author}</span>
              <div className="flex items-center space-x-4 text-slate-500 text-sm">
                <span className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views || 0}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>0</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
