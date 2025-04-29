
import { AIResponse } from "@/types";
import { TemplateColors, TemplateFeatures } from "@/types/templates";
import * as templates from "./templates";

// Define templates metadata
const TEMPLATES = {
  landing: {
    name: "Landing Page",
    tags: ["marketing", "homepage", "business"],
  },
  portfolio: {
    name: "Portfolio",
    tags: ["personal", "showcase", "resume"],
  },
  blog: {
    name: "Blog",
    tags: ["content", "articles", "posts"],
  },
  ecommerce: {
    name: "E-commerce",
    tags: ["shop", "store", "products", "cart"],
  },
  dashboard: {
    name: "Dashboard",
    tags: ["admin", "analytics", "data", "metrics"],
  },
  social: {
    name: "Social Network",
    tags: ["community", "profiles", "feed"],
  },
  todo: {
    name: "Todo App",
    tags: ["productivity", "tasks", "checklist"],
  },
};

// Enhanced smart fallback generator that's more context-aware
export async function smartFallbackGenerator(
  prompt: string, 
  history: Array<{role: string, content: string}>
): Promise<AIResponse> {
  // Analyze prompt to determine what kind of website to generate
  const promptLower = prompt.toLowerCase();
  const historyText = history.map(msg => msg.content).join(" ").toLowerCase();
  const combinedText = promptLower + " " + historyText;
  
  // Determine the best template match based on keywords
  let bestMatch = "landing"; // Default template
  let bestScore = 0;
  
  Object.entries(TEMPLATES).forEach(([templateKey, template]) => {
    let score = 0;
    
    // Check for exact template mentions
    if (combinedText.includes(templateKey)) score += 10;
    
    // Check for tag matches
    template.tags.forEach(tag => {
      if (combinedText.includes(tag)) score += 5;
    });
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = templateKey;
    }
  });
  
  // Extract color preferences
  const colorMatches = {
    blue: combinedText.includes("blue"),
    green: combinedText.includes("green"),
    red: combinedText.includes("red"),
    purple: combinedText.includes("purple"),
    dark: combinedText.includes("dark"),
    light: combinedText.includes("light"),
  };
  
  // Extract feature preferences
  const features = {
    responsive: !combinedText.includes("not responsive"),
    animation: combinedText.includes("animation") || combinedText.includes("animate"),
    form: combinedText.includes("form") || combinedText.includes("contact") || combinedText.includes("input"),
    navigation: !combinedText.includes("no navigation"),
  };
  
  // Now generate the appropriate template with customizations
  switch (bestMatch) {
    case "landing":
      return templates.generateLandingPage(colorMatches, features);
    case "portfolio":
      return templates.generatePortfolioPage(colorMatches, features);
    case "blog":
      return templates.generateBlogPage(colorMatches, features);
    case "ecommerce":
      return templates.generateEcommercePage(colorMatches, features);
    case "dashboard":
      return templates.generateDashboardPage(colorMatches, features);
    case "social":
      return templates.generateSocialPage(colorMatches, features);
    case "todo":
      return templates.generateTodoPage(colorMatches, features);
    default:
      return templates.generateLandingPage(colorMatches, features);
  }
}
