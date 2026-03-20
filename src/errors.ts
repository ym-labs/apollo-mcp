export class ApolloApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    public readonly endpoint: string,
  ) {
    super(`Apollo API error ${status} on ${endpoint}: ${body}`);
    this.name = "ApolloApiError";
  }
}

export function formatToolError(error: unknown): {
  content: Array<{ type: "text"; text: string }>;
  isError: true;
} {
  if (error instanceof ApolloApiError) {
    let message: string;
    switch (error.status) {
      case 401:
        message =
          "Authentication failed. The Apollo API key is invalid or expired.";
        break;
      case 403:
        message =
          "Access denied. Your Apollo API key does not have permission for this endpoint.";
        break;
      case 422:
        message = `Invalid request parameters: ${error.body}`;
        break;
      case 429:
        message =
          "Rate limit exceeded. Please wait before making more requests.";
        break;
      default:
        message = `Apollo API error (${error.status}): ${error.body}`;
    }
    return { content: [{ type: "text", text: message }], isError: true };
  }

  return {
    content: [{ type: "text", text: `Unexpected error: ${String(error)}` }],
    isError: true,
  };
}
