# MyLeantime MCP

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Server-6C47FF)
![ESLint](https://img.shields.io/badge/ESLint-Configured-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-Configured-F7B93E?logo=prettier&logoColor=black)

Servidor MCP (Model Context Protocol) para gestionar tickets y proyectos en Leantime desde asistentes de IA.

## Instalación

```bash
git clone https://github.com/dherrero/leantime-mcp.git
cd leantime-mcp
npm install
npm run build
npm install -g .
```

Opcional (variables de entorno):

```bash
# .env
LEANTIME_URL=https://tu-dominio-leantime.com/api/jsonrpc
LEANTIME_API_KEY=tu-api-key
```

## Uso

- Ejecutar el servidor (CLI):

```bash
myleantime-mcp --url https://YOUR_LEANTIME_HOST/api/jsonrpc --api-key YOUR_API_KEY
# o si prefieres usar el build local
npm start -- --url https://YOUR_LEANTIME_HOST/api/jsonrpc --api-key YOUR_API_KEY

# Ayuda
myleantime-mcp --help
```

- Integrarlo en tu cliente MCP (por ejemplo, Cursor/Claude Desktop):

```json
{
  "mcpServers": {
    "leantime": {
      "command": "myleantime-mcp",
      "args": ["--url", "https://YOUR_LEANTIME_HOST/api/jsonrpc", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

Notas:

- Los argumentos de CLI tienen prioridad sobre las variables de entorno.
- Requisitos: Node.js 18+ y una API Key válida de Leantime.
