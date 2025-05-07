
import { BaseClient } from "./base-client";
import { PerplexityClient } from "./perplexity-client";
import { FreeClient } from "./free-client";

// Define the client configuration type
export interface AIClientConfig {
  apiKey: string;
  provider: "PERPLEXITY" | "FREE" | "OPENAI" | "HUGGINGFACE";
  modelType?: string;
}

export class AIClientFactory {
  static createClient(config: AIClientConfig): BaseClient {
    switch (config.provider) {
      case "PERPLEXITY":
        return new PerplexityClient(config);
      case "FREE":
        return new FreeClient();
      default:
        return new FreeClient();
    }
  }
}
