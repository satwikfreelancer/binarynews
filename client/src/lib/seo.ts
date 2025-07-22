export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedAt?: string;
  author?: string;
}

export const generateStructuredData = (data: SEOData) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": data.type === "article" ? "NewsArticle" : "WebSite",
    name: data.title,
    description: data.description,
    url: data.url,
    image: data.image,
  };

  if (data.type === "article") {
    return {
      ...baseStructuredData,
      "@type": "NewsArticle",
      headline: data.title,
      datePublished: data.publishedAt,
      author: {
        "@type": "Person",
        name: data.author,
      },
      publisher: {
        "@type": "Organization",
        name: "BinaryNews",
        logo: {
          "@type": "ImageObject",
          url: "https://binarynews.com/logo.png",
        },
      },
    };
  }

  return baseStructuredData;
};

export const updateMetaTags = (data: SEOData) => {
  // Update document title
  document.title = data.title;

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

  updateMetaTag("description", data.description);
  if (data.keywords) updateMetaTag("keywords", data.keywords);
  if (data.author) updateMetaTag("author", data.author);

  // Open Graph tags
  updatePropertyTag("og:title", data.title);
  updatePropertyTag("og:description", data.description);
  updatePropertyTag("og:type", data.type || "website");
  if (data.image) updatePropertyTag("og:image", data.image);
  if (data.url) updatePropertyTag("og:url", data.url);

  // Twitter Card tags
  updateMetaTag("twitter:card", "summary_large_image");
  updateMetaTag("twitter:title", data.title);
  updateMetaTag("twitter:description", data.description);
  if (data.image) updateMetaTag("twitter:image", data.image);

  // Update structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]#dynamic-schema');
  if (existingScript) {
    existingScript.remove();
  }

  const structuredData = generateStructuredData(data);
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "dynamic-schema";
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};
