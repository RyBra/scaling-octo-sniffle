import type { ListJournalEntriesQuery } from '@construction-journal/shared';
import { create } from 'zustand';

interface JournalFiltersState {
  dateFrom: string;
  dateTo: string;
  sort: NonNullable<ListJournalEntriesQuery['sort']>;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  setSort: (value: NonNullable<ListJournalEntriesQuery['sort']>) => void;
  reset: () => void;
}

const initialState = {
  dateFrom: '',
  dateTo: '',
  sort: 'workDate:desc' as const,
};

export const useJournalFiltersStore = create<JournalFiltersState>((set) => ({
  ...initialState,
  setDateFrom: (dateFrom) => set({ dateFrom }),
  setDateTo: (dateTo) => set({ dateTo }),
  setSort: (sort) => set({ sort }),
  reset: () => set(initialState),
}));

export function useJournalFiltersQuery(): ListJournalEntriesQuery {
  const { dateFrom, dateTo, sort } = useJournalFiltersStore();
  return {
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sort,
  };
}
