import { initialCompletionKey } from "@/constants/storage";
import type { NullableCompletion } from "@/models/completion";
import { readForage } from "@/utils/local-storage";

class InitialCompletionService {
  private cache: NullableCompletion[] | null = null;

  async get(): Promise<NullableCompletion[]> {
    if (this.cache !== null) return this.cache;
    const completion = await readForage(initialCompletionKey, []);
    this.cache = completion;
    return completion;
  }

  invalidate(): void {
    this.cache = null;
  }
}

export const InitialCompletion = new InitialCompletionService();
