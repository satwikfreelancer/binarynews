import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedAt?: string;
  author?: string;
}

export default function SEOHead({
  title,
  description,
  keywords,
  image = "/og-image.jpg",
  url,
  type = "website",
  publishedAt,
  author,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.name = name;
        document.head.appendChild(element);
      }
      element.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    updateMetaTag("description", description);
    if (keywords) updateMetaTag("keywords", keywords);
    if (author) updateMetaTag("author", author);

    // Open Graph tags
    updatePropertyTag("og:title", title);
    updatePropertyTag("og:description", description);
    updatePropertyTag("og:type", type);
    updatePropertyTag("og:image", image);
    if (url) updatePropertyTag("og:url", url);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);

    // Article specific tags
    if (type === "article" && publishedAt) {
      updatePropertyTag("article:published_time", publishedAt);
      if (author) updatePropertyTag("article:author", author);
    }

    // Structured data for articles
    if (type === "article") {
      const existingScript = document.querySelector('script[type="application/ld+json"]#article-schema');
      if (existingScript) {
        existingScript.remove();
      }

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": title,
        "description": description,
        "image": image,
        "datePublished": publishedAt,
        "author": {
          "@type": "Person",
          "name": author,
        },
        "publisher": {
          "@type": "Organization",
          "name": "BinaryNews",
          "logo": {
            "@type": "ImageObject",
            "url": "https://binarynews.com/logo.png",
          },
        },
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "article-schema";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, image, url, type, publishedAt, author]);

  return null;
}
