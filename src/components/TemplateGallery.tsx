
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play } from "lucide-react";
import { Template } from "@/types";

interface TemplateGalleryProps {
  onTemplateSelect: (template: Template) => void;
}

export default function TemplateGallery({ onTemplateSelect }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const templates: Template[] = [
    {
      id: "landing-page",
      name: "Landing Page",
      description: "Modern landing page with hero section and features",
      image: "/placeholder.svg",
      html: "<!DOCTYPE html><html><head><title>Landing Page</title></head><body><h1>Welcome</h1></body></html>",
      css: "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }",
      js: "console.log('Landing page loaded');",
      thumbnail: "/placeholder.svg",
      category: "business",
      tags: ["landing", "business", "modern"]
    },
    {
      id: "dashboard",
      name: "Dashboard",
      description: "Admin dashboard with charts and metrics",
      image: "/placeholder.svg",
      html: "<!DOCTYPE html><html><head><title>Dashboard</title></head><body><h1>Dashboard</h1></body></html>",
      css: "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }",
      js: "console.log('Dashboard loaded');",
      thumbnail: "/placeholder.svg",
      category: "admin",
      tags: ["dashboard", "admin", "charts"]
    },
    {
      id: "portfolio",
      name: "Portfolio",
      description: "Creative portfolio showcase",
      image: "/placeholder.svg",
      html: "<!DOCTYPE html><html><head><title>Portfolio</title></head><body><h1>Portfolio</h1></body></html>",
      css: "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }",
      js: "console.log('Portfolio loaded');",
      thumbnail: "/placeholder.svg",
      category: "creative",
      tags: ["portfolio", "creative", "showcase"]
    },
    {
      id: "ecommerce",
      name: "E-commerce",
      description: "Online store template",
      image: "/placeholder.svg",
      html: "<!DOCTYPE html><html><head><title>Store</title></head><body><h1>Store</h1></body></html>",
      css: "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }",
      js: "console.log('Store loaded');",
      thumbnail: "/placeholder.svg",
      category: "business",
      tags: ["ecommerce", "store", "business"]
    },
    {
      id: "blog",
      name: "Blog",
      description: "Personal or professional blog",
      image: "/placeholder.svg",
      html: "<!DOCTYPE html><html><head><title>Blog</title></head><body><h1>Blog</h1></body></html>",
      css: "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }",
      js: "console.log('Blog loaded');",
      thumbnail: "/placeholder.svg",
      category: "content",
      tags: ["blog", "content", "writing"]
    },
    {
      id: "todo-app",
      name: "Todo App",
      description: "Task management application",
      image: "/placeholder.svg",
      html: "<!DOCTYPE html><html><head><title>Todo</title></head><body><h1>Todo App</h1></body></html>",
      css: "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }",
      js: "console.log('Todo app loaded');",
      thumbnail: "/placeholder.svg",
      category: "productivity",
      tags: ["todo", "productivity", "app"]
    }
  ];

  const categories = ["all", ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
                {template.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                onClick={() => onTemplateSelect(template)}
                className="w-full"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
