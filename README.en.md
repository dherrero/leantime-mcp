# MyLeantime MCP

[Leer en Español](README.md)

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Server-6C47FF)
![npm](https://img.shields.io/npm/v/myleantime-mcp?logo=npm)

MCP (Model Context Protocol) server to manage tickets and projects in [Leantime](https://leantime.io/) from AI assistants.

## Installation

### Using npx (recommended)

No installation needed. Use `npx` directly in your AI agent configuration:

```bash
npx myleantime-mcp --url https://YOUR_LEANTIME_HOST --api-key YOUR_API_KEY
```

### Global installation

```bash
npm install -g myleantime-mcp
myleantime-mcp --url https://YOUR_LEANTIME_HOST --api-key YOUR_API_KEY
```

### From source

```bash
git clone https://github.com/dherrero/leantime-mcp.git
cd leantime-mcp
npm install
npm run build
```

## Configuration for AI agents

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "leantime": {
      "command": "npx",
      "args": [
        "myleantime-mcp",
        "--url", "https://YOUR_LEANTIME_HOST",
        "--api-key", "YOUR_API_KEY"
      ]
    }
  }
}
```

### Claude Code (CLI)

```bash
claude mcp add leantime -- npx myleantime-mcp --url https://YOUR_LEANTIME_HOST --api-key YOUR_API_KEY
```

Or edit `.claude/settings.json` in your project:

```json
{
  "mcpServers": {
    "leantime": {
      "command": "npx",
      "args": [
        "myleantime-mcp",
        "--url", "https://YOUR_LEANTIME_HOST",
        "--api-key", "YOUR_API_KEY"
      ]
    }
  }
}
```

### Cursor

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "leantime": {
      "command": "npx",
      "args": [
        "myleantime-mcp",
        "--url", "https://YOUR_LEANTIME_HOST",
        "--api-key", "YOUR_API_KEY"
      ]
    }
  }
}
```

### VS Code (GitHub Copilot)

Edit `.vscode/mcp.json` in your project or in your global user settings:

```json
{
  "servers": {
    "leantime": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "myleantime-mcp",
        "--url", "https://YOUR_LEANTIME_HOST",
        "--api-key", "YOUR_API_KEY"
      ]
    }
  }
}
```

### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "leantime": {
      "command": "npx",
      "args": [
        "myleantime-mcp",
        "--url", "https://YOUR_LEANTIME_HOST",
        "--api-key", "YOUR_API_KEY"
      ]
    }
  }
}
```

### Zed

Edit Zed's settings (`.zed/settings.json` or global settings):

```json
{
  "context_servers": {
    "leantime": {
      "command": {
        "path": "npx",
        "args": [
          "myleantime-mcp",
          "--url", "https://YOUR_LEANTIME_HOST",
          "--api-key", "YOUR_API_KEY"
        ]
      }
    }
  }
}
```

## Configuration options

| Parameter | Environment variable | Description |
|-----------|----------------------|-------------|
| `--url` | `LEANTIME_URL` | Base URL of your Leantime instance (`https://host`) — without `/api/jsonrpc` |
| `--api-key` | `LEANTIME_API_KEY` | Leantime API Key |

CLI arguments take precedence over environment variables.

## Available tools

- **Tickets**: create, list, update and manage tickets in Leantime.
- **Projects**: list and query projects.

## Requirements

- Node.js 18+
- A Leantime instance with API enabled and a valid API Key.
