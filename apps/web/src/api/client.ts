import type {
  ConstructionSiteDto,
  CreateConstructionSiteDto,
  CreateEmployeeDto,
  CreateJournalEntryDto,
  CreateWorkTypeDto,
  EmployeeDto,
  JournalEntryDto,
  ListJournalEntriesQuery,
  UpdateConstructionSiteDto,
  UpdateEmployeeDto,
  UpdateJournalEntryDto,
  UpdateWorkTypeDto,
  WorkTypeDto,
} from '@construction-journal/shared';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      ...init,
    });
  } catch {
    throw new Error(
      'Не удалось подключиться к API. Запустите проект: docker compose up -d --build',
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body.message === 'string'
        ? body.message
        : Array.isArray(body.message)
          ? body.message.join(', ')
          : `Ошибка ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function buildQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

export const api = {
  constructionSites: {
    list: () => request<ConstructionSiteDto[]>('/construction-sites'),
    get: (id: string) => request<ConstructionSiteDto>(`/construction-sites/${id}`),
    create: (data: CreateConstructionSiteDto) =>
      request<ConstructionSiteDto>('/construction-sites', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: UpdateConstructionSiteDto) =>
      request<ConstructionSiteDto>(`/construction-sites/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/construction-sites/${id}`, { method: 'DELETE' }),
  },

  employees: {
    list: () => request<EmployeeDto[]>('/employees'),
    get: (id: string) => request<EmployeeDto>(`/employees/${id}`),
    create: (data: CreateEmployeeDto) =>
      request<EmployeeDto>('/employees', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: UpdateEmployeeDto) =>
      request<EmployeeDto>(`/employees/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/employees/${id}`, { method: 'DELETE' }),
  },

  workTypes: {
    list: () => request<WorkTypeDto[]>('/work-types'),
    get: (id: string) => request<WorkTypeDto>(`/work-types/${id}`),
    create: (data: CreateWorkTypeDto) =>
      request<WorkTypeDto>('/work-types', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: UpdateWorkTypeDto) =>
      request<WorkTypeDto>(`/work-types/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/work-types/${id}`, { method: 'DELETE' }),
  },

  journal: {
    list: (siteId: string, query: ListJournalEntriesQuery) =>
      request<JournalEntryDto[]>(
        `/construction-sites/${siteId}/journal-entries${buildQuery({
          dateFrom: query.dateFrom,
          dateTo: query.dateTo,
          sort: query.sort,
        })}`,
      ),
    get: (siteId: string, id: string) =>
      request<JournalEntryDto>(`/construction-sites/${siteId}/journal-entries/${id}`),
    create: (siteId: string, data: CreateJournalEntryDto) =>
      request<JournalEntryDto>(`/construction-sites/${siteId}/journal-entries`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (siteId: string, id: string, data: UpdateJournalEntryDto) =>
      request<JournalEntryDto>(`/construction-sites/${siteId}/journal-entries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (siteId: string, id: string) =>
      request<{ success: boolean }>(`/construction-sites/${siteId}/journal-entries/${id}`, {
        method: 'DELETE',
      }),
  },
};
