# MyLeantime MCP

[Leer en Español](README.md)

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Server-6C47FF)
![ESLint](https://img.shields.io/badge/ESLint-Configured-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-Configured-F7B93E?logo=prettier&logoColor=black)

MCP (Model Context Protocol) server to manage tickets and projects in Leantime from AI assistants.

## Installation

```bash
git clone https://github.com/dherrero/leantime-mcp.git
cd leantime-mcp
npm install
npm run build
# optional to install it as a binary
npm install -g .
```

Optional (environment variables):

```bash
# .env
LEANTIME_URL=https://your-leantime-domain.com/api/jsonrpc
LEANTIME_API_KEY=your-api-key
```

## Usage

- Run the server (CLI):

```bash
myleantime-mcp --url https://YOUR_LEANTIME_HOST/api/jsonrpc --api-key YOUR_API_KEY
# or using the local build
npm start -- --url https://YOUR_LEANTIME_HOST/api/jsonrpc --api-key YOUR_API_KEY

# Help
myleantime-mcp --help
```

- Integrate it into your MCP client (e.g., Cursor/Claude Desktop):

```json
{
  "mcpServers": {
    "leantime": {
      "command": "myleantime-mcp", // alternative: node /path_to/dist/index.js
      "args": ["--url", "https://YOUR_LEANTIME_HOST/api/jsonrpc", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

Notes:

- CLI arguments take precedence over environment variables.
- Requirements: Node.js 18+ and a valid Leantime API Key.
