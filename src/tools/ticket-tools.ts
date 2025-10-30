import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { LeantimeClient } from '../leantime-client.js';

/**
 * Registra las tools relacionadas con tickets en el servidor MCP
 */
export function registerTicketTools(server: McpServer, client: LeantimeClient) {
  // Tool: get_ticket - Gets a ticket by its ID
  server.tool(
    'get_ticket',
    'Retrieves complete information about a Leantime ticket by its ID',
    {
      id: z.number().describe('The ticket ID to retrieve'),
    },
    async (args) => {
      try {
        const ticket = await client.getTicket(args.id);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(ticket, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving ticket';

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: search_tickets - Search tickets by criteria
  server.tool(
    'search_tickets',
    'Searches for tickets in Leantime based on search criteria. Can filter by project, user, status, etc.',
    {
      searchCriteria: z
        .record(z.unknown())
        .optional()
        .describe(
          'Search criteria as JSON object. Examples: {"currentProject": 1}, {"users": [2]}, {"status": 3}'
        ),
    },
    async (args) => {
      try {
        const tickets = await client.getAllTickets(args.searchCriteria);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tickets, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error searching tickets';

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: create_ticket - Creates a new ticket
  server.tool(
    'create_ticket',
    'Creates a new ticket in Leantime with the specified values',
    {
      headline: z.string().describe('Ticket title (required)'),
      description: z.string().optional().describe('Ticket description'),
      projectId: z.number().optional().describe('Project ID'),
      type: z.string().optional().describe('Ticket type (task, bug, milestone, etc.)'),
      status: z.number().optional().describe('Ticket status (number)'),
      priority: z.string().optional().describe('Ticket priority'),
      userId: z.number().optional().describe('Assigned user ID'),
      dateToFinish: z.string().optional().describe('Due date (format: YYYY-MM-DD)'),
      planHours: z.number().optional().describe('Planned hours'),
      tags: z.string().optional().describe('Tags separated by comma'),
      sprint: z.string().optional().describe('Assigned sprint'),
      storypoints: z.string().optional().describe('Story points'),
      milestoneid: z.number().optional().describe('Associated milestone ID'),
    },
    async (args) => {
      try {
        // Preparar valores del ticket
        const values: Record<string, unknown> = {
          headline: args.headline,
        };

        // Añadir campos opcionales solo si están presentes
        if (args.description !== undefined) values.description = args.description;
        if (args.projectId !== undefined) values.projectId = args.projectId;
        if (args.type !== undefined) values.type = args.type;
        if (args.status !== undefined) values.status = args.status;
        if (args.priority !== undefined) values.priority = args.priority;
        if (args.userId !== undefined) values.userId = args.userId;
        if (args.dateToFinish !== undefined) values.dateToFinish = args.dateToFinish;
        if (args.planHours !== undefined) values.planHours = args.planHours;
        if (args.tags !== undefined) values.tags = args.tags;
        if (args.sprint !== undefined) values.sprint = args.sprint;
        if (args.storypoints !== undefined) values.storypoints = args.storypoints;
        if (args.milestoneid !== undefined) values.milestoneid = args.milestoneid;

        const result = await client.addTicket(values);

        return {
          content: [
            {
              type: 'text',
              text: `Ticket created successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error creating ticket';

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: update_ticket - Updates an existing ticket
  server.tool(
    'update_ticket',
    'Updates an existing ticket in Leantime with the specified values. The ticket ID must be included in the update.',
    {
      id: z.number().describe('Ticket ID to update (required)'),
      headline: z.string().optional().describe('New ticket title'),
      description: z.string().optional().describe('New ticket description'),
      type: z.string().optional().describe('New ticket type'),
      status: z.number().optional().describe('New ticket status'),
      priority: z.string().optional().describe('New priority'),
      userId: z.number().optional().describe('New assigned user ID'),
      dateToFinish: z.string().optional().describe('New due date'),
      planHours: z.number().optional().describe('New planned hours'),
      tags: z.string().optional().describe('New tags'),
      sprint: z.string().optional().describe('New sprint'),
      storypoints: z.string().optional().describe('New story points'),
    },
    async (args) => {
      try {
        // First, get the current ticket to preserve existing values
        const currentTicket = (await client.getTicket(args.id)) as Record<string, unknown>;

        if (!currentTicket || typeof currentTicket !== 'object') {
          throw new Error('Ticket not found or invalid response');
        }

        // Build the values object starting with essential fields from current ticket
        const values: Record<string, unknown> = {
          id: args.id,
          projectId: currentTicket.projectId,
          headline: args.headline ?? currentTicket.headline,
          type: args.type ?? currentTicket.type,
        };

        // Add optional fields only if provided, otherwise preserve current values
        if (args.description !== undefined) values.description = args.description;
        else if (currentTicket.description !== undefined)
          values.description = currentTicket.description;

        if (args.status !== undefined) values.status = args.status;
        else if (currentTicket.status !== undefined) values.status = currentTicket.status;

        if (args.priority !== undefined) values.priority = args.priority;
        else if (currentTicket.priority !== undefined) values.priority = currentTicket.priority;

        if (args.userId !== undefined) values.userId = args.userId;
        else if (currentTicket.userId !== undefined) values.userId = currentTicket.userId;

        if (args.dateToFinish !== undefined) values.dateToFinish = args.dateToFinish;
        else if (currentTicket.dateToFinish !== undefined)
          values.dateToFinish = currentTicket.dateToFinish;

        if (args.planHours !== undefined) values.planHours = args.planHours;
        else if (currentTicket.planHours !== undefined) values.planHours = currentTicket.planHours;

        if (args.tags !== undefined) values.tags = args.tags;
        else if (currentTicket.tags !== undefined) values.tags = currentTicket.tags;

        if (args.sprint !== undefined) values.sprint = args.sprint;
        else if (currentTicket.sprint !== undefined) values.sprint = currentTicket.sprint;

        if (args.storypoints !== undefined) values.storypoints = args.storypoints;
        else if (currentTicket.storypoints !== undefined)
          values.storypoints = currentTicket.storypoints;

        const result = await client.updateTicket(values);

        return {
          content: [
            {
              type: 'text',
              text: `Ticket updated successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error updating ticket';

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: delete_ticket - Deletes a ticket
  server.tool(
    'delete_ticket',
    'Deletes a ticket from Leantime by its ID',
    {
      id: z.number().describe('Ticket ID to delete'),
    },
    async (args) => {
      try {
        const result = await client.deleteTicket(args.id);

        return {
          content: [
            {
              type: 'text',
              text: `Ticket deleted successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error deleting ticket';

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: find_ticket - Searches tickets by search term
  server.tool(
    'find_ticket',
    'Searches for tickets in Leantime by search term in the headline',
    {
      term: z.string().describe('Search term'),
      projectId: z.number().describe('Project ID to search in'),
      userId: z.number().optional().describe('User ID to filter by (optional)'),
    },
    async (args) => {
      try {
        const tickets = await client.findTicket(args.term, args.projectId, args.userId);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tickets, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error searching tickets';

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: get_ticket_types - Gets available ticket types
  server.tool(
    'get_ticket_types',
    'Retrieves the list of available ticket types in Leantime (task, bug, milestone, etc.)',
    {},
    async () => {
      try {
        const types = await client.getTicketTypes();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(types, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving ticket types';

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: get_priority_labels - Gets priority labels
  server.tool(
    'get_priority_labels',
    'Retrieves the list of available priority labels in Leantime',
    {},
    async () => {
      try {
        const priorities = await client.getPriorityLabels();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(priorities, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving priority labels';

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool: get_status_labels - Gets status labels for a project
  server.tool(
    'get_status_labels',
    'Retrieves the available status labels for a specific project in Leantime',
    {
      projectId: z.number().describe('Project ID'),
    },
    async (args) => {
      try {
        const statuses = await client.getStatusLabels(args.projectId);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(statuses, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving status labels';

        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
