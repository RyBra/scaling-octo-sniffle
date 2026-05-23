import type {
  CreateJournalEntryDto,
  ListJournalEntriesQuery,
  UpdateJournalEntryDto,
} from '@construction-journal/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';

export const journalKeys = {
  all: (siteId: string) => ['journal-entries', siteId] as const,
  list: (siteId: string, filters: ListJournalEntriesQuery) =>
    ['journal-entries', siteId, 'list', filters] as const,
  detail: (siteId: string, id: string) => ['journal-entries', siteId, 'detail', id] as const,
};

export function useJournalEntries(siteId: string, filters: ListJournalEntriesQuery) {
  return useQuery({
    queryKey: journalKeys.list(siteId, filters),
    queryFn: () => api.journal.list(siteId, filters),
    enabled: Boolean(siteId),
  });
}

export function useJournalEntry(siteId: string, id: string | undefined) {
  return useQuery({
    queryKey: journalKeys.detail(siteId, id ?? ''),
    queryFn: () => api.journal.get(siteId, id!),
    enabled: Boolean(siteId && id),
  });
}

export function useCreateEntry(siteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJournalEntryDto) => api.journal.create(siteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.all(siteId) });
    },
  });
}

export function useUpdateEntry(siteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJournalEntryDto }) =>
      api.journal.update(siteId, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.all(siteId) });
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(siteId, id) });
    },
  });
}

export function useDeleteEntry(siteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.journal.delete(siteId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.all(siteId) });
    },
  });
}
