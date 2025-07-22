import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import AdminSidebar from "@/components/admin/admin-sidebar";
import ArticleEditor from "@/components/admin/article-editor";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Article, Category, BreakingNews, InsertArticle, InsertBreakingNews } from "@shared/schema";

export default function AdminWriter() {
  const [activeTab, setActiveTab] = useState("write");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: articles } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: breakingNews } = useQuery<BreakingNews>({
    queryKey: ["/api/breaking-news"],
  });

  const createArticleMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      const response = await apiRequest("POST", "/api/articles", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Success",
        description: "Article published successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish article",
        variant: "destructive",
      });
    },
  });

  const updateBreakingNewsMutation = useMutation({
    mutationFn: async (data: InsertBreakingNews) => {
      const response = await apiRequest("POST", "/api/breaking-news", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/breaking-news"] });
      toast({
        title: "Success",
        description: "Breaking news updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update breaking news",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">
                {activeTab === "write" && "Write New Article"}
                {activeTab === "articles" && "All Articles"}
                {activeTab === "breaking" && "Breaking News"}
                {activeTab === "analytics" && "Analytics"}
              </h1>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === "write" && (
              <ArticleEditor
                categories={categories || []}
                onSubmit={(data) => createArticleMutation.mutate(data)}
                isSubmitting={createArticleMutation.isPending}
              />
            )}

            {activeTab === "articles" && (
              <div className="space-y-4">
                {articles?.map((article) => (
                  <Card key={article.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-slate-600 text-sm mb-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span>By {article.author}</span>
                            <span>{article.views || 0} views</span>
                            <span>
                              {article.publishedAt &&
                                new Date(article.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || <div>No articles found.</div>}
              </div>
            )}

            {activeTab === "breaking" && (
              <Card className="max-w-2xl">
                <CardHeader>
                  <CardTitle>Breaking News Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const title = formData.get("title") as string;
                      const url = formData.get("url") as string;
                      const active = formData.get("active") === "on";

                      updateBreakingNewsMutation.mutate({
                        title,
                        url,
                        active,
                      });
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="title">Breaking News Title</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={breakingNews?.title || ""}
                        placeholder="Enter breaking news title..."
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="url">Article URL</Label>
                      <Input
                        id="url"
                        name="url"
                        defaultValue={breakingNews?.url || ""}
                        placeholder="/article/slug-here or external URL"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        name="active"
                        defaultChecked={breakingNews?.active !== false}
                      />
                      <Label htmlFor="active">Display Breaking News Banner</Label>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={updateBreakingNewsMutation.isPending}
                    >
                      {updateBreakingNewsMutation.isPending ? "Updating..." : "Update Breaking News"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === "analytics" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
                <p className="text-slate-600">Analytics features coming soon...</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
