import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { LeantimeClient } from '../leantime-client.js';

/**
 * Registers project-related tools in the MCP server
 */
export function registerProjectTools(server: McpServer, client: LeantimeClient) {
  // Tool: get_all_projects - Gets all projects
  server.tool('get_all_projects', 'Retrieves all projects from Leantime', {}, async () => {
    try {
      const projects = await client.getAllProjects();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error retrieving all projects';

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
  });

  // Tool: get_project - Gets a project by ID
  server.tool(
    'get_project',
    'Retrieves detailed information about a specific project by its ID',
    {
      id: z.number().describe('The project ID'),
    },
    async (args) => {
      try {
        const project = await client.getProject(args.id);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(project, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving project';

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

  // Tool: get_user_projects - Gets all projects for current user
  server.tool(
    'get_user_projects',
    'Retrieves all projects for the current user. By default, closed projects are not included.',
    {
      showClosedProjects: z.boolean().optional().describe('Set to true to include closed projects'),
    },
    async (args) => {
      try {
        const projects = await client.getAll(args.showClosedProjects);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(projects, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving user projects';

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

  // Tool: create_project - Creates a new project
  server.tool(
    'create_project',
    'Creates a new project in Leantime with the specified values',
    {
      name: z.string().describe('Project name (required)'),
      clientId: z.number().describe('Client ID associated with the project (required)'),
      details: z.string().optional().describe('Additional project details'),
      hourBudget: z.number().optional().describe('Hour budget for the project'),
      dollarBudget: z.number().optional().describe('Dollar budget for the project'),
      assignedUsers: z.string().optional().describe('List of assigned users'),
      psettings: z
        .string()
        .optional()
        .describe("Project settings (e.g., 'restricted'), defaults to 'restricted'"),
      start: z.string().optional().describe('Start date in user format (YYYY-MM-DD) or null'),
      end: z.string().optional().describe('End date in user format (YYYY-MM-DD) or null'),
    },
    async (args) => {
      try {
        const values: Record<string, unknown> = {
          name: args.name,
          clientId: args.clientId,
          type: 'project',
        };

        if (args.details !== undefined) values.details = args.details;
        if (args.hourBudget !== undefined) values.hourBudget = args.hourBudget;
        if (args.dollarBudget !== undefined) values.dollarBudget = args.dollarBudget;
        if (args.assignedUsers !== undefined) values.assignedUsers = args.assignedUsers;
        if (args.psettings !== undefined) values.psettings = args.psettings;
        if (args.start !== undefined) values.start = args.start;
        if (args.end !== undefined) values.end = args.end;

        const result = await client.addProject(values);

        return {
          content: [
            {
              type: 'text',
              text: `Project created successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error creating project';

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

  // Tool: update_project - Updates a project
  server.tool(
    'update_project',
    'Updates an existing project with the given parameters',
    {
      id: z.number().describe('Project ID to update (required)'),
      name: z.string().optional().describe('New project name'),
      details: z.string().optional().describe('New project details'),
      clientId: z.number().optional().describe('New client ID'),
      hourBudget: z.number().optional().describe('New hour budget'),
      dollarBudget: z.number().optional().describe('New dollar budget'),
      start: z.string().optional().describe('New start date'),
      end: z.string().optional().describe('New end date'),
      status: z.string().optional().describe('New project status'),
    },
    async (args) => {
      try {
        const params: Record<string, unknown> = {};

        if (args.name !== undefined) params.name = args.name;
        if (args.details !== undefined) params.details = args.details;
        if (args.clientId !== undefined) params.clientId = args.clientId;
        if (args.hourBudget !== undefined) params.hourBudget = args.hourBudget;
        if (args.dollarBudget !== undefined) params.dollarBudget = args.dollarBudget;
        if (args.start !== undefined) params.start = args.start;
        if (args.end !== undefined) params.end = args.end;
        if (args.status !== undefined) params.status = args.status;

        const result = await client.patchProject(args.id, params);

        return {
          content: [
            {
              type: 'text',
              text: `Project updated successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error updating project';

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

  // Tool: get_project_progress - Gets project progress
  server.tool(
    'get_project_progress',
    'Retrieves the progress of a project including completion percentage, estimated completion date, and planned completion date',
    {
      projectId: z.number().describe('The project ID'),
    },
    async (args) => {
      try {
        const progress = await client.getProjectProgress(args.projectId);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(progress, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving project progress';

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

  // Tool: get_project_users - Gets users assigned to a project
  server.tool(
    'get_project_users',
    'Retrieves all users assigned to a specific project',
    {
      projectId: z.number().describe('The project ID'),
    },
    async (args) => {
      try {
        const users = await client.getUsersAssignedToProject(args.projectId);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(users, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving project users';

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

  // Tool: get_user_assigned_projects - Gets projects assigned to a user
  server.tool(
    'get_user_assigned_projects',
    'Retrieves projects assigned to a specific user',
    {
      userId: z.number().describe('The user ID'),
      projectStatus: z.string().optional().describe('Project status filter (defaults to "open")'),
      clientId: z.number().optional().describe('Client ID filter (optional)'),
    },
    async (args) => {
      try {
        const projects = await client.getProjectsAssignedToUser(
          args.userId,
          args.projectStatus,
          args.clientId
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(projects, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving user projects';

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

  // Tool: check_user_project_assignment - Checks if user is assigned to project
  server.tool(
    'check_user_project_assignment',
    'Checks if a user is assigned to a particular project',
    {
      userId: z.number().describe('The user ID'),
      projectId: z.number().describe('The project ID'),
    },
    async (args) => {
      try {
        const isAssigned = await client.isUserAssignedToProject(args.userId, args.projectId);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ isAssigned }, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error checking user assignment';

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

  // Tool: get_project_role - Gets user's role in a project
  server.tool(
    'get_project_role',
    'Retrieves the role of a user in a specific project',
    {
      userId: z.number().describe('The user ID'),
      projectId: z.number().describe('The project ID'),
    },
    async (args) => {
      try {
        const role = await client.getProjectRole(args.userId, args.projectId);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ role }, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving project role';

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

  // Tool: search_projects - Searches projects by term
  server.tool(
    'search_projects',
    'Searches for projects based on a search term in project names',
    {
      term: z.string().describe('The search term'),
    },
    async (args) => {
      try {
        const projects = await client.findProject(args.term);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(projects, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error searching projects';

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

  // Tool: get_project_types - Gets available project types
  server.tool(
    'get_project_types',
    'Retrieves the list of available project types in Leantime',
    {},
    async () => {
      try {
        const types = await client.getProjectTypes();

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
          error instanceof Error ? error.message : 'Unknown error retrieving project types';

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

  // Tool: duplicate_project - Duplicates a project
  server.tool(
    'duplicate_project',
    'Duplicates an existing project with specified details',
    {
      projectId: z.number().describe('The ID of the project to duplicate'),
      clientId: z.number().describe('The client ID for the duplicate project'),
      projectName: z.string().describe('The name of the duplicate project'),
      userStartDate: z
        .string()
        .describe('The start date in user format (e.g., YYYY-MM-DD or locale format)'),
      assignSameUsers: z
        .boolean()
        .describe('Whether to assign the same users as the original project'),
    },
    async (args) => {
      try {
        const result = await client.duplicateProject(
          args.projectId,
          args.clientId,
          args.projectName,
          args.userStartDate,
          args.assignSameUsers
        );

        return {
          content: [
            {
              type: 'text',
              text: `Project duplicated successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error duplicating project';

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

  // Tool: get_project_hierarchy - Gets project hierarchy for a user
  server.tool(
    'get_project_hierarchy',
    'Retrieves the hierarchy of projects assigned to a user, including parent-child relationships',
    {
      userId: z.number().describe('The user ID'),
      projectStatus: z.string().optional().describe('Project status filter (defaults to "open")'),
      clientId: z.number().optional().describe('Client ID filter (optional)'),
    },
    async (args) => {
      try {
        const hierarchy = await client.getProjectHierarchyAssignedToUser(
          args.userId,
          args.projectStatus,
          args.clientId
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(hierarchy, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving project hierarchy';

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

  // Tool: get_available_clients - Gets clients available to user
  server.tool(
    'get_available_clients',
    'Retrieves all clients available to a user based on project access',
    {
      userId: z.number().describe('The user ID'),
      projectStatus: z.string().optional().describe('Project status filter (defaults to "open")'),
    },
    async (args) => {
      try {
        const clients = await client.getAllClientsAvailableToUser(args.userId, args.projectStatus);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(clients, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error retrieving available clients';

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
