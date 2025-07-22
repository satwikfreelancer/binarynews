import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/article-card";
import FeaturedArticle from "@/components/featured-article";
import TrendingSidebar from "@/components/trending-sidebar";
import NewsletterSignup from "@/components/newsletter-signup";
import SEOHead from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import type { Article, Category } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredArticles } = useQuery<Article[]>({
    queryKey: ["/api/articles", { featured: true }],
    select: (data) => data?.slice(0, 1) || [],
  });

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: selectedCategory 
      ? ["/api/articles", { categoryId: parseInt(selectedCategory) }]
      : ["/api/articles"],
    select: (data) => data?.filter(article => !article.featured) || [],
  });

  const featuredArticle = featuredArticles?.[0];
  const featuredCategory = categories?.find(cat => cat.id === featuredArticle?.categoryId);

  const categoryMap = categories?.reduce((acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {} as Record<number, Category>) || {};

  const filterCategories = [
    { id: null, name: "All", color: "#3B82F6" },
    ...(categories || []),
  ];

  return (
    <>
      <SEOHead
        title="BinaryNews - Latest Technology News & Insights"
        description="Stay updated with the latest technology news, insights, and trends. Your trusted source for tech journalism and industry analysis."
        keywords="technology news, tech trends, software, hardware, startup news, AI, cybersecurity"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Article */}
        {featuredArticle && (
          <FeaturedArticle article={featuredArticle} category={featuredCategory} />
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Latest News</h2>
              <div className="flex flex-wrap gap-2">
                {filterCategories.map((category) => (
                  <Button
                    key={category.id || "all"}
                    variant={selectedCategory === (category.id ? category.id.toString() : null) ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id ? category.id.toString() : null)}
                    className="text-xs"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="space-y-8">
              {isLoading ? (
                <div>Loading articles...</div>
              ) : articles?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">No articles found.</p>
                </div>
              ) : (
                articles?.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    category={categoryMap[article.categoryId!]}
                  />
                ))
              )}
            </div>

            {/* Load More Button */}
            {articles && articles.length > 0 && (
              <div className="text-center mt-12">
                <Button>Load More Articles</Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-12 lg:mt-0 space-y-8">
            <TrendingSidebar />
            <NewsletterSignup />
            
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories?.map((category) => (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <div className="flex items-center justify-between text-slate-600 hover:text-primary py-2 border-b border-slate-100 cursor-pointer">
                      <span>{category.name}</span>
                      <span className="text-sm text-slate-400">--</span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
