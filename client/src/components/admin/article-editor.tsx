import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Upload, Bold, Italic, Underline, Heading, Quote, Code, Link, Image, List } from "lucide-react";
import type { Category, InsertArticle } from "@shared/schema";

interface ArticleEditorProps {
  categories: Category[];
  onSubmit: (data: InsertArticle) => void;
  isSubmitting: boolean;
}

export default function ArticleEditor({ categories, onSubmit, isSubmitting }: ArticleEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    categoryId: "",
    author: "",
    featured: false,
    published: true,
    seoTitle: "",
    metaDescription: "",
    tags: "",
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seoTitle: title,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const articleData: InsertArticle = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
    };

    onSubmit(articleData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Article Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-slate-700">
            Article Title
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter article title..."
            className="text-lg mt-1"
            required
          />
        </div>

        {/* Article Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-slate-700">
              Category
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="author" className="text-sm font-medium text-slate-700">
              Author
            </Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Author name..."
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="slug" className="text-sm font-medium text-slate-700">
              URL Slug
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="article-url-slug"
              className="mt-1"
              required
            />
          </div>
        </div>

        {/* Featured Image URL */}
        <div>
          <Label htmlFor="featuredImage" className="text-sm font-medium text-slate-700">
            Featured Image URL
          </Label>
          <Input
            id="featuredImage"
            value={formData.featuredImage}
            onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
        </div>

        {/* Article Excerpt */}
        <div>
          <Label htmlFor="excerpt" className="text-sm font-medium text-slate-700">
            Article Excerpt
          </Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Brief description of the article..."
            rows={3}
            className="mt-1"
            required
          />
        </div>

        {/* Rich Text Editor */}
        <div>
          <Label className="text-sm font-medium text-slate-700">Article Content</Label>
          
          {/* Editor Toolbar */}
          <div className="border border-slate-200 rounded-t-lg bg-slate-50 px-4 py-2 mt-1">
            <div className="flex items-center space-x-1">
              <Button type="button" variant="ghost" size="sm" className="p-2">
                <Bold className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="p-2">
                <Italic className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="p-2">
                <Underline className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <Button type="button" variant="ghost" size="sm" className="p-2">
                <Heading className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="p-2">
                <Quote className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="p-2">
                <Code className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <Button type="button" variant="ghost" size="sm" className="p-2">
                <Link className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="p-2">
                <Image className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" className="p-2">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Editor Content Area */}
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Write your article content here... You can use Markdown formatting."
            rows={20}
            className="border-x border-b border-slate-200 rounded-t-none font-mono text-sm resize-none"
            required
          />
        </div>

        {/* Article Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Article Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor="featured">Feature this article</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="seoTitle" className="text-sm font-medium text-slate-700">
                SEO Title
              </Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="SEO optimized title..."
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">Recommended: 50-60 characters</p>
            </div>

            <div>
              <Label htmlFor="metaDescription" className="text-sm font-medium text-slate-700">
                Meta Description
              </Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="Meta description for search engines..."
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">Recommended: 150-160 characters</p>
            </div>

            <div>
              <Label htmlFor="tags" className="text-sm font-medium text-slate-700">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Article"}
          </Button>
        </div>
      </form>
    </div>
  );
}
