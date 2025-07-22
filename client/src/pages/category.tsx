import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "@/components/article-card";
import SEOHead from "@/components/seo-head";
import type { Article, Category } from "@shared/schema";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const category = categories?.find(cat => cat.slug === slug);

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles", { categoryId: category?.id }],
    enabled: !!category,
  });

  if (!category && categories) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Category Not Found</h1>
          <p className="text-slate-600">The category you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }

  if (isLoading || !category) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEOHead
        title={`${category.name} News | BinaryNews`}
        description={`Latest ${category.name.toLowerCase()} news, insights, and trends from BinaryNews.`}
        keywords={`${category.name.toLowerCase()}, technology news, tech trends`}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{category.name}</h1>
          <p className="text-slate-600">
            Latest {category.name.toLowerCase()} news and insights
          </p>
        </div>

        <div className="space-y-8">
          {articles?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No articles found in this category.</p>
            </div>
          ) : (
            articles?.map((article) => (
              <ArticleCard key={article.id} article={article} category={category} />
            ))
          )}
        </div>
      </main>
    </>
  );
}
