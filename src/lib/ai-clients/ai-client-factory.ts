
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
      console.log("Using free API mode");
      return new FreeAPIClient({ 
        apiKey: FREE_API_KEY,
        // Using a model that doesn't require auth
        model: "google/flan-t5-small" 
      });
    }
    
    switch (provider) {
      case "OPENAI":
        return new OpenAIClient({ 
          apiKey, 
          model: "gpt-3.5-turbo" 
        });
      case "HUGGINGFACE":
        return new HuggingFaceClient({ 
          apiKey, 
          model: "HuggingFaceH4/zephyr-7b-beta" 
        });
      case "PERPLEXITY":
        return new PerplexityClient({ 
          apiKey, 
          model: modelType as keyof typeof PERPLEXITY_MODELS 
        });
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
}
