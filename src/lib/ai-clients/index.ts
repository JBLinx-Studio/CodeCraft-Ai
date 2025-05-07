
import { AIClientConfig } from "@/types";
import { BaseClient } from "./base-client";
import { PerplexityClient } from "./perplexity-client";
import { FreeClient } from "./free-client";

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
