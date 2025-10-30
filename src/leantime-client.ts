import { Config } from './config.js';

/**
 * Estructura de una petición JSON-RPC 2.0
 */
interface JsonRpcRequest {
  method: string;
  jsonrpc: '2.0';
  id: number | string;
  params?: Record<string, unknown>;
}

/**
 * Estructura de una respuesta JSON-RPC 2.0 exitosa
 */
interface JsonRpcSuccessResponse<T = unknown> {
  jsonrpc: '2.0';
  id: number | string;
  result: T;
}

/**
 * Estructura de una respuesta JSON-RPC 2.0 con error
 */
interface JsonRpcErrorResponse {
  jsonrpc: '2.0';
  id: number | string;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
}

type JsonRpcResponse<T = unknown> = JsonRpcSuccessResponse<T> | JsonRpcErrorResponse;

/**
 * Cliente para interactuar con la API JSON-RPC de Leantime
 */
export class LeantimeClient {
  private config: Config;
  private requestId = 1;

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Realiza una llamada JSON-RPC a la API de Leantime
   */
  private async call<T = unknown>(method: string, params?: Record<string, unknown>): Promise<T> {
    const requestId = this.requestId++;

    const request: JsonRpcRequest = {
      method,
      jsonrpc: '2.0',
      id: requestId,
      params,
    };

    const response = await fetch(`${this.config.leantimeUrl}/api/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.leantimeApiKey,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `Error HTTP ${response.status}: ${response.statusText || 'Error desconocido'}`
      );
    }

    const json = (await response.json()) as JsonRpcResponse<T>;

    if ('error' in json) {
      throw new Error(`Error JSON-RPC: ${json.error.message} (code: ${json.error.code})`);
    }

    return json.result;
  }

  /**
   * Gets a ticket by its ID
   */
  async getTicket(id: number) {
    return this.call('leantime.rpc.Tickets.Tickets.getTicket', { id });
  }

  /**
   * Gets all tickets based on search criteria
   */
  async getAllTickets(searchCriteria?: Record<string, unknown>) {
    return this.call('leantime.rpc.Tickets.Tickets.getAll', { searchCriteria });
  }

  /**
   * Adds a new ticket
   */
  async addTicket(values: Record<string, unknown>) {
    return this.call('leantime.rpc.Tickets.Tickets.addTicket', { values });
  }

  /**
   * Updates an existing ticket
   */
  async updateTicket(values: Record<string, unknown>) {
    return this.call('leantime.rpc.Tickets.Tickets.updateTicket', { values });
  }

  /**
   * Deletes a ticket by its ID
   */
  async deleteTicket(id: number) {
    return this.call('leantime.rpc.Tickets.Tickets.delete', { id });
  }

  /**
   * Obtiene las etiquetas de estado para un proyecto
   */
  async getStatusLabels(projectId: number) {
    return this.call('leantime.rpc.Tickets.Tickets.getStatusLabels', { projectId });
  }

  /**
   * Obtiene todos los milestones según criterios de búsqueda
   */
  async getAllMilestones(searchCriteria?: Record<string, unknown>, sortBy?: string) {
    return this.call('leantime.rpc.Tickets.Tickets.getAllMilestones', {
      searchCriteria,
      sortBy,
    });
  }

  /**
   * Busca tickets por término de búsqueda
   */
  async findTicket(term: string, projectId: number, userId?: number | null) {
    return this.call('leantime.rpc.Tickets.Tickets.findTicket', {
      term,
      projectId,
      userId,
    });
  }

  /**
   * Obtiene las etiquetas de prioridad
   */
  async getPriorityLabels() {
    return this.call('leantime.rpc.Tickets.Tickets.getPriorityLabels');
  }

  /**
   * Obtiene los tipos de ticket disponibles
   */
  async getTicketTypes() {
    return this.call('leantime.rpc.Tickets.Tickets.getTicketTypes');
  }

  // ==================== Projects Methods ====================

  /**
   * Gets all projects
   */
  async getAllProjects() {
    return this.call('leantime.rpc.Projects.Projects.getAllProjects');
  }

  /**
   * Gets a project by ID
   */
  async getProject(id: number) {
    return this.call('leantime.rpc.Projects.Projects.getProject', { id });
  }

  /**
   * Gets all projects for the current user
   */
  async getAll(showClosedProjects?: boolean) {
    return this.call('leantime.rpc.Projects.Projects.getAll', { showClosedProjects });
  }

  /**
   * Adds a new project
   */
  async addProject(values: Record<string, unknown>) {
    return this.call('leantime.rpc.Projects.Projects.addProject', { values });
  }

  /**
   * Updates a project with given parameters
   */
  async patchProject(id: number, params: Record<string, unknown>) {
    return this.call('leantime.rpc.Projects.Projects.patch', { id, params });
  }

  /**
   * Gets project types
   */
  async getProjectTypes() {
    return this.call('leantime.rpc.Projects.Projects.getProjectTypes');
  }

  /**
   * Gets project progress
   */
  async getProjectProgress(projectId: number) {
    return this.call('leantime.rpc.Projects.Projects.getProjectProgress', { projectId });
  }

  /**
   * Gets users assigned to a project
   */
  async getUsersAssignedToProject(projectId: number) {
    return this.call('leantime.rpc.Projects.Projects.getUsersAssignedToProject', { projectId });
  }

  /**
   * Gets projects assigned to a user
   */
  async getProjectsAssignedToUser(
    userId: number,
    projectStatus?: string,
    clientId?: number | null
  ) {
    return this.call('leantime.rpc.Projects.Projects.getProjectsAssignedToUser', {
      userId,
      projectStatus,
      clientId,
    });
  }

  /**
   * Checks if user is assigned to a project
   */
  async isUserAssignedToProject(userId: number, projectId: number) {
    return this.call('leantime.rpc.Projects.Projects.isUserAssignedToProject', {
      userId,
      projectId,
    });
  }

  /**
   * Gets project role for a user
   */
  async getProjectRole(userId: number, projectId: number) {
    return this.call('leantime.rpc.Projects.Projects.getProjectRole', { userId, projectId });
  }

  /**
   * Finds projects by search term
   */
  async findProject(term: string) {
    return this.call('leantime.rpc.Projects.Projects.findProject', { term });
  }

  /**
   * Duplicates a project
   */
  async duplicateProject(
    projectId: number,
    clientId: number,
    projectName: string,
    userStartDate: string,
    assignSameUsers: boolean
  ) {
    return this.call('leantime.rpc.Projects.Projects.duplicateProject', {
      projectId,
      clientId,
      projectName,
      userStartDate,
      assignSameUsers,
    });
  }

  /**
   * Gets project hierarchy assigned to user
   */
  async getProjectHierarchyAssignedToUser(
    userId: number,
    projectStatus?: string,
    clientId?: number | null
  ) {
    return this.call('leantime.rpc.Projects.Projects.getProjectHierarchyAssignedToUser', {
      userId,
      projectStatus,
      clientId,
    });
  }

  /**
   * Gets all clients available to user
   */
  async getAllClientsAvailableToUser(userId: number, projectStatus?: string) {
    return this.call('leantime.rpc.Projects.Projects.getAllClientsAvailableToUser', {
      userId,
      projectStatus,
    });
  }
}
