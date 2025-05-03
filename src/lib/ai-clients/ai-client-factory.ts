
import { AIClient, AIClientOptions, FREE_API_KEY } from "./base-client";
import { OpenAIClient, OpenAIClientOptions } from "./openai-client";
import { HuggingFaceClient, HuggingFaceClientOptions } from "./huggingface-client";
import { PerplexityClient, PERPLEXITY_MODELS, PerplexityClientOptions } from "./perplexity-client";
import { FreeAPIClient, FreeClientOptions } from "./free-client";
import { AIProvider } from "@/types";

export interface AIClientFactoryOptions {
  apiKey: string;
  provider: AIProvider;
  modelType?: string;
}

export class AIClientFactory {
  static createClient(options: AIClientFactoryOptions): AIClient {
    const { apiKey, provider, modelType } = options;
    
    // If using free API, automatically switch to the FreeAPIClient
    if (provider === "FREE" || apiKey === FREE_API_KEY) {
      console.log("Using free API mode with default model");
      return new FreeAPIClient({ 
        apiKey: FREE_API_KEY,
        // Using a model that doesn't require auth
        model: "google/flan-t5-small" 
      });
    }
    
    // Check for empty or invalid API keys
    if (!apiKey || apiKey.trim() === '') {
      console.warn("No API key provided, falling back to free API");
      return new FreeAPIClient({ 
        apiKey: FREE_API_KEY,
        model: "google/flan-t5-small" 
      });
    }
    
    try {
      switch (provider) {
        case "OPENAI":
          console.log("Creating OpenAI client with model: gpt-3.5-turbo");
          return new OpenAIClient({ 
            apiKey, 
            model: "gpt-3.5-turbo" 
          });
        case "HUGGINGFACE":
          console.log("Creating HuggingFace client with model: HuggingFaceH4/zephyr-7b-beta");
          return new HuggingFaceClient({ 
            apiKey, 
            model: "HuggingFaceH4/zephyr-7b-beta" 
          });
        case "PERPLEXITY":
          console.log(`Creating Perplexity client with model type: ${modelType || 'SMALL'}`);
          return new PerplexityClient({ 
            apiKey, 
            model: modelType as keyof typeof PERPLEXITY_MODELS || "SMALL" 
          });
        default:
          console.warn(`Unsupported AI provider: ${provider}, falling back to free API`);
          return new FreeAPIClient({ 
            apiKey: FREE_API_KEY, 
            model: "google/flan-t5-small" 
          });
      }
    } catch (error) {
      console.error("Error creating AI client:", error);
      console.log("Falling back to free API due to client creation error");
      return new FreeAPIClient({ 
        apiKey: FREE_API_KEY,
        model: "google/flan-t5-small" 
      });
    }
  }
}
