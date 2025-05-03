
import { Template } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
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
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden flex flex-col">
          <div className="h-32 bg-muted overflow-hidden">
            <img 
              src={template.thumbnail} 
              alt={template.name} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardContent className="p-4 flex-1">
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onSelectTemplate(template)}
            >
              Use Template
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
