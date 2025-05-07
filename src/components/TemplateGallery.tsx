
import { Template } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  searchQuery?: string;
  selectedTemplateId?: string;
  isLoading?: boolean;
  categoryFilter?: string;
}

export default function TemplateGallery({ 
  onSelectTemplate, 
  searchQuery = "", 
  selectedTemplateId,
  isLoading = false,
  categoryFilter
}: TemplateGalleryProps) {
  const templates: Template[] = [
    {
      id: "landing-page",
      name: "Landing Page",
      description: "A responsive landing page with hero section and features",
      thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
      category: "Marketing",
      tags: ["responsive", "hero", "features"]
    },
    {
      id: "portfolio",
      name: "Portfolio",
      description: "A personal portfolio to showcase your work and skills",
      thumbnail: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
      category: "Personal",
      tags: ["gallery", "about", "contact"]
    },
    {
      id: "blog",
      name: "Blog",
      description: "A simple blog layout with articles and sidebar",
      thumbnail: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww",
      category: "Content",
      tags: ["articles", "comments", "categories"]
    },
    {
      id: "ecommerce",
      name: "E-commerce",
      description: "Product listing with cart functionality",
      thumbnail: "https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D",
      category: "E-commerce",
      tags: ["products", "cart", "checkout"]
    },
    {
      id: "dashboard",
      name: "Dashboard",
      description: "Interactive admin dashboard with charts and statistics",
      thumbnail: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D",
      category: "Admin",
      tags: ["analytics", "charts", "statistics"]
    },
    {
      id: "social-network",
      name: "Social Network",
      description: "Social media platform with user profiles and feeds",
      thumbnail: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D",
      category: "Social",
      tags: ["profiles", "messaging", "timeline"]
    }
  ];

  // Filter templates based on search query
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery.trim() === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !categoryFilter || 
      template.id === categoryFilter ||
      template.id.includes(categoryFilter) ||
      template.category.toLowerCase().includes(categoryFilter.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  if (filteredTemplates.length === 0) {
    return (
      <div className="text-center py-16 glassmorphism-card bg-white/30 dark:bg-slate-900/30">
        <p className="text-slate-600 dark:text-slate-300">
          No templates match your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredTemplates.map((template) => (
        <Card 
          key={template.id} 
          className={cn(
            "overflow-hidden flex flex-col transition-all duration-300 glassmorphism-card",
            selectedTemplateId === template.id ? "ring-2 ring-theme-blue ring-offset-2" : "hover:shadow-lg"
          )}
        >
          <div className="h-40 overflow-hidden">
            <img 
              src={template.thumbnail} 
              alt={template.name} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardContent className="p-4 flex-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold flex items-center gap-1.5">
                {template.name}
                {selectedTemplateId === template.id && (
                  <CheckCircle className="h-4 w-4 text-theme-blue ml-1" />
                )}
              </h3>
              <Badge variant="outline" className="text-xs">
                {template.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              variant={selectedTemplateId === template.id ? "default" : "outline"} 
              className={cn(
                "w-full gap-2", 
                selectedTemplateId === template.id ? 
                "bg-gradient-to-r from-theme-blue to-theme-green hover:opacity-90" : ""
              )}
              onClick={() => onSelectTemplate(template)}
              disabled={isLoading}
            >
              {isLoading && selectedTemplateId === template.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : selectedTemplateId === template.id ? (
                "Selected"
              ) : (
                "Preview Template"
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
