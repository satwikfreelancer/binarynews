import { Link } from "wouter";
import { ArrowRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article, Category } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface FeaturedArticleProps {
  article: Article;
  category?: Category;
}

export default function FeaturedArticle({ article, category }: FeaturedArticleProps) {
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <section className="mb-12">
      <Card className="shadow-lg overflow-hidden">
        <div className="lg:flex">
          <div className="lg:w-1/2">
            {article.featuredImage && (
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-64 lg:h-full object-cover"
              />
            )}
          </div>
          <CardContent className="lg:w-1/2 p-8">
            <div className="flex items-center space-x-2 mb-4">
              {category && (
                <Badge
                  style={{ backgroundColor: category.color, color: "white" }}
                >
                  {category.name}
                </Badge>
              )}
              <span className="text-slate-500 text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(publishedDate, { addSuffix: true })}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-medium text-sm">{article.author}</p>
                  <p className="text-slate-500 text-xs">Tech Reporter</p>
                </div>
              </div>
              <Link href={`/article/${article.slug}`}>
                <Button className="inline-flex items-center">
                  Read Full Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
}
