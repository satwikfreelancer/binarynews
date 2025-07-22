import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, User, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo-head";
import { apiRequest } from "@/lib/queryClient";
import type { Article, Category } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";
import { useEffect } from "react";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const { data: article, isLoading } = useQuery<Article>({
  queryKey: ["/api/articles", slug],
  queryFn: async () => {
    const response = await fetch(`/api/articles/${slug}`);
    if (!response.ok) {
      throw new Error('Article not found');
    }
    return response.json();
  },
  enabled: !!slug,
});

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const category = categories?.find(cat => cat.id === article?.categoryId);

  // Increment views on page load
  useEffect(() => {
  if (article?.id) { // Check specifically for article.id
    const timer = setTimeout(() => {
      fetch(`/api/articles/${article.id}/view`, { 
        method: 'POST',
      }).catch(error => console.error('Failed to increment views:', error));
    }, 1000);
    
    return () => clearTimeout(timer);
  }
}, [article]);

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Article Not Found</h1>
          <p className="text-slate-600">The article you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }

  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : new Date();

  return (
    <>
      <SEOHead
        title={article.seoTitle || `${article.title} | BinaryNews`}
        description={article.metaDescription || article.excerpt}
        keywords={article.tags?.join(", ")}
        image={article.featuredImage || undefined}
        type="article"
        publishedAt={article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined}
        author={article.author}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article>
          {/* Article Header */}
          <header className="mb-8">
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
            
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(publishedDate, "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{article.views || 0} views</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-8">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-64 lg:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Excerpt */}
          <div className="text-xl text-slate-700 mb-8 leading-relaxed font-medium">
            {article.excerpt}
          </div>

          {/* Article Content */}
          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: (article.content || "").replace(/\n/g, "<br />"),
              }}
            />
          </div>

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </>
  );
}
