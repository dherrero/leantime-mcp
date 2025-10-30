#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig, ConfigOptions } from './config.js';
import { LeantimeClient } from './leantime-client.js';
import { registerTicketTools } from './tools/ticket-tools.js';
import { registerProjectTools } from './tools/project-tools.js';

/**
 * Parsea los argumentos de línea de comandos
 */
function parseArguments(): ConfigOptions {
  const args = process.argv.slice(2);
  const options: ConfigOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: myleantime-mcp [options]

Options:
  --url <url>              Leantime server URL (overrides LEANTIME_URL env var)
  --api-key <key>          Leantime API key (overrides LEANTIME_API_KEY env var)
  -h, --help               Show this help message

Examples:
  # Using environment variables (from .env file)
  myleantime-mcp

  # Using command line arguments
  myleantime-mcp --url https://leantime.example.com --api-key your-api-key

  # Mixing both (CLI args take precedence)
  myleantime-mcp --url https://leantime.example.com

Configuration priority:
  1. Command line arguments
  2. Environment variables (.env file or system env vars)
      `);
      process.exit(0);
    }

    if (arg === '--url' && i + 1 < args.length) {
      options.leantimeUrl = args[i + 1];
      i++;
    } else if (arg === '--api-key' && i + 1 < args.length) {
      options.leantimeApiKey = args[i + 1];
      i++;
    }
  }

  return options;
}

/**
 * Crea y configura el servidor MCP de Leantime
 */
const server = new McpServer(
  {
    name: 'myleantime-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Inicializa el cliente de Leantime y registra las tools
 */
function initializeTools(configOptions?: ConfigOptions) {
  try {
    // Cargar configuración desde parámetros CLI o variables de entorno
    const config = loadConfig(configOptions);

    // Crear cliente de Leantime
    const leantimeClient = new LeantimeClient(config);

    // Registrar todas las tools de tickets
    registerTicketTools(server, leantimeClient);

    // Registrar todas las tools de proyectos
    registerProjectTools(server, leantimeClient);

    const urlSource = configOptions?.leantimeUrl ? 'CLI argument' : 'environment variable';
    console.error(
      `MCP Server configured successfully with URL: ${config.leantimeUrl.replace(/^https?:\/\//, '')} (from ${urlSource})`
    );
  } catch (error) {
    console.error('Error initializing server:');
    console.error(error instanceof Error ? error.message : 'Unknown error');
    console.error(
      '\nMake sure to create a .env file based on .env.example with the required variables,'
    );
    console.error('or provide the configuration via command line arguments (--url and --api-key).');
    console.error('\nRun with --help for more information.');
    process.exit(1);
  }
}

/**
 * Manejador de errores del servidor
 */
server.server.onerror = (error) => console.error('[MCP Error]', error);

/**
 * Manejador de señal SIGINT para cerrar el servidor correctamente
 */
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

/**
 * Inicia el servidor MCP con transporte stdio
 */
async function main() {
  // Parsear argumentos de línea de comandos
  const cliOptions = parseArguments();

  // Inicializar tools antes de conectar el transporte
  initializeTools(cliOptions);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Leantime server started and ready to receive requests');
}

main().catch((error) => {
  console.error('Fatal error starting server:');
  console.error(error);
  process.exit(1);
});
