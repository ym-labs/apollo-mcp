import { config } from "../config.js";
import { ApolloApiError } from "../errors.js";

export class ApolloClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = config.APOLLO_BASE_URL;
    this.apiKey = config.APOLLO_API_KEY;
  }

  async post<T>(
    path: string,
    body: Record<string, unknown>,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, api_key: this.apiKey }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new ApolloApiError(response.status, text, path);
    }

    return response.json() as Promise<T>;
  }

  async get<T>(
    path: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    const searchParams = new URLSearchParams({
      ...params,
      api_key: this.apiKey,
    });
    const url = `${this.baseUrl}${path}?${searchParams.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new ApolloApiError(response.status, text, path);
    }

    return response.json() as Promise<T>;
  }
}

export const apolloClient = new ApolloClient();
