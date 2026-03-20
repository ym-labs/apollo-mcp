# Apollo MCP

MCP server for the [Apollo.io](https://apollo.io) API. Lets LLMs search and enrich people and company data.

## Tools

| Tool | Description | Credits |
|------|-------------|---------|
| `search_people` | Search contacts by title, location, seniority, company | No |
| `search_organizations` | Search companies by industry, size, location | Yes |
| `enrich_person` | Enrich a person by email, LinkedIn URL, or name+domain | Yes |
| `enrich_organization` | Enrich a company by domain | Yes |
| `bulk_enrich_people` | Enrich up to 10 people at once | Yes |
| `bulk_enrich_organizations` | Enrich up to 10 companies at once | Yes |

## Setup

### Prerequisites

- Node.js 20+
- An [Apollo.io API key](https://app.apollo.io/#/settings/integrations/api)

### Local development

```bash
cp .env.example .env
# Edit .env and add your APOLLO_API_KEY

npm install
npm run dev
```

The server starts on `http://localhost:3000` with:
- `POST /mcp` — MCP endpoint (Streamable HTTP)
- `GET /health` — Health check

### Docker

```bash
cp .env.example .env
# Edit .env and add your APOLLO_API_KEY

docker compose up --build
```

## Connecting an MCP client

Add this to your MCP client configuration (e.g. Claude Desktop):

```json
{
  "mcpServers": {
    "apollo": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

For a remote server, replace `localhost:3000` with your server's address.

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APOLLO_API_KEY` | Yes | — | Your Apollo.io API key |
| `PORT` | No | `3000` | Server port |
| `APOLLO_BASE_URL` | No | `https://api.apollo.io` | Apollo API base URL |
