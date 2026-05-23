import type {
  CreateConstructionSiteDto,
  CreateEmployeeDto,
  CreateWorkTypeDto,
  UpdateConstructionSiteDto,
  UpdateEmployeeDto,
  UpdateWorkTypeDto,
} from '@construction-journal/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';

export const catalogKeys = {
  sites: ['construction-sites'] as const,
  site: (id: string) => ['construction-sites', id] as const,
  employees: ['employees'] as const,
  employee: (id: string) => ['employees', id] as const,
  workTypes: ['work-types'] as const,
  workType: (id: string) => ['work-types', id] as const,
};

export function useConstructionSites() {
  return useQuery({
    queryKey: catalogKeys.sites,
    queryFn: () => api.constructionSites.list(),
  });
}

export function useConstructionSite(id: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.site(id ?? ''),
    queryFn: () => api.constructionSites.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateConstructionSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateConstructionSiteDto) => api.constructionSites.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: catalogKeys.sites }),
  });
}

export function useUpdateConstructionSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConstructionSiteDto }) =>
      api.constructionSites.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: catalogKeys.sites });
      qc.invalidateQueries({ queryKey: catalogKeys.site(id) });
    },
  });
}

export function useDeleteConstructionSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.constructionSites.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: catalogKeys.sites }),
  });
}

export function useEmployees() {
  return useQuery({
    queryKey: catalogKeys.employees,
    queryFn: () => api.employees.list(),
  });
}

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.employee(id ?? ''),
    queryFn: () => api.employees.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployeeDto) => api.employees.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: catalogKeys.employees }),
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeDto }) =>
      api.employees.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: catalogKeys.employees });
      qc.invalidateQueries({ queryKey: catalogKeys.employee(id) });
    },
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.employees.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: catalogKeys.employees }),
  });
}

export function useWorkTypes() {
  return useQuery({
    queryKey: catalogKeys.workTypes,
    queryFn: () => api.workTypes.list(),
  });
}

export function useWorkType(id: string | undefined) {
  return useQuery({
    queryKey: catalogKeys.workType(id ?? ''),
    queryFn: () => api.workTypes.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateWorkType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkTypeDto) => api.workTypes.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: catalogKeys.workTypes }),
  });
}

export function useUpdateWorkType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkTypeDto }) =>
      api.workTypes.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: catalogKeys.workTypes });
      qc.invalidateQueries({ queryKey: catalogKeys.workType(id) });
    },
  });
}

export function useDeleteWorkType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.workTypes.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: catalogKeys.workTypes }),
  });
}
