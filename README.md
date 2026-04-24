# MyLeantime MCP

[Read this in English](README.en.md)

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Server-6C47FF)
![npm](https://img.shields.io/npm/v/myleantime-mcp?logo=npm)

Servidor MCP (Model Context Protocol) para gestionar tickets y proyectos en [Leantime](https://leantime.io/) desde asistentes de IA.

## Instalación

### Usando npx (recomendado)

No necesitas instalar nada. Usa `npx` directamente en la configuración de tu agente de IA:

```bash
npx myleantime-mcp --url https://TU_LEANTIME_HOST --api-key TU_API_KEY
```

### Instalación global

```bash
npm install -g myleantime-mcp
myleantime-mcp --url https://TU_LEANTIME_HOST --api-key TU_API_KEY
```

### Desde el código fuente

```bash
git clone https://github.com/dherrero/leantime-mcp.git
cd leantime-mcp
npm install
npm run build
```

## Configuración en agentes de IA

### Claude Desktop

Edita `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) o `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "leantime": {
      "command": "npx",
      "args": [
        "myleantime-mcp",
        "--url", "https://TU_LEANTIME_HOST",
        "--api-key", "TU_API_KEY"
      ]
    }
  }
}
```

### Claude Code (CLI)

```bash
claude mcp add leantime -- npx myleantime-mcp --url https://TU_LEANTIME_HOST --api-key TU_API_KEY
```

O edita `.claude/settings.json` en tu proyecto:

```json
{
  "mcpServers": {
    "leantime": {
      "command": "npx",
      "args": [
        "myleantime-mcp",
        "--url", "https://TU_LEANTIME_HOST",
        "--api-key", "TU_API_KEY"
      ]
    }
  }
}
```

### Cursor

Edita `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "leantime": {
      "command": "npx",
      "args": [
        "myleantime-mcp",
        "--url", "https://TU_LEANTIME_HOST",
        "--api-key", "TU_API_KEY"
      ]
    }
  }
}
```

### VS Code (GitHub Copilot)

Edita `.vscode/mcp.json` en tu proyecto o la configuración global de usuario:

```json
{
  "servers": {
    "leantime": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "myleantime-mcp",
        "--url", "https://TU_LEANTIME_HOST",
        "--api-key", "TU_API_KEY"
      ]
    }
  }
}
```

### Windsurf

Edita `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "leantime": {
      "command": "npx",
      "args": [
        "myleantime-mcp",
        "--url", "https://TU_LEANTIME_HOST",
        "--api-key", "TU_API_KEY"
      ]
    }
  }
}
```

### Zed

Edita la configuración de Zed (`.zed/settings.json` o configuración global):

```json
{
  "context_servers": {
    "leantime": {
      "command": {
        "path": "npx",
        "args": [
          "myleantime-mcp",
          "--url", "https://TU_LEANTIME_HOST",
          "--api-key", "TU_API_KEY"
        ]
      }
    }
  }
}
```

## Opciones de configuración

| Parámetro | Variable de entorno | Descripción |
|-----------|---------------------|-------------|
| `--url` | `LEANTIME_URL` | URL base de tu instancia de Leantime (`https://host`) — sin `/api/jsonrpc` |
| `--api-key` | `LEANTIME_API_KEY` | API Key de Leantime |

Los argumentos de CLI tienen prioridad sobre las variables de entorno.

## Herramientas disponibles

- **Tickets**: crear, listar, actualizar y gestionar tickets en Leantime.
- **Proyectos**: listar y consultar proyectos.

## Requisitos

- Node.js 18+
- Una instancia de Leantime con API habilitada y una API Key válida.
