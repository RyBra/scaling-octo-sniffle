import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useConstructionSite } from '@/hooks/use-catalog';
import { useDeleteEntry, useJournalEntries } from '@/hooks/use-journal';
import {
  useJournalFiltersQuery,
  useJournalFiltersStore,
} from '@/stores/journal-filters.store';

function formatWorkDate(date: string) {
  return format(parseISO(date), 'd MMMM yyyy', { locale: ru });
}

export function EntriesListPage() {
  const { siteId = '' } = useParams<{ siteId: string }>();
  const { data: site } = useConstructionSite(siteId);
  const filters = useJournalFiltersQuery();
  const { dateFrom, dateTo, sort, setDateFrom, setDateTo, setSort, reset } =
    useJournalFiltersStore();
  const { data: entries = [], isLoading, isError, error } = useJournalEntries(siteId, filters);
  const deleteEntry = useDeleteEntry(siteId);

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm(`Удалить запись «${label}»?`)) return;
    await deleteEntry.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            <Link to="/sites" className="hover:text-blue-700">
              ← Объекты
            </Link>
          </p>
          <h1 className="text-2xl font-bold">{site?.name ?? 'Журнал работ'}</h1>
          {site?.address && <p className="text-sm text-slate-500">{site.address}</p>}
        </div>
        <Button asChild>
          <Link to={`/sites/${siteId}/entries/new`}>Добавить запись</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Дата от</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Дата до</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Сортировка</Label>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workDate:desc">Сначала новые</SelectItem>
                  <SelectItem value="workDate:asc">Сначала старые</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={reset}>
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading && <p className="p-6 text-slate-500">Загрузка…</p>}
          {isError && (
            <p className="p-6 text-red-600">
              {error instanceof Error ? error.message : 'Ошибка загрузки'}
            </p>
          )}
          {!isLoading && !isError && entries.length === 0 && (
            <p className="p-6 text-slate-500">Записей пока нет.</p>
          )}
          {!isLoading && !isError && entries.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Вид работ</TableHead>
                  <TableHead>Объём</TableHead>
                  <TableHead>Исполнитель</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatWorkDate(entry.workDate)}</TableCell>
                    <TableCell>{entry.workTypeName}</TableCell>
                    <TableCell>
                      {entry.volume} {entry.unit}
                    </TableCell>
                    <TableCell>{entry.employeeName}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/sites/${siteId}/entries/${entry.id}/edit`}>
                            Редактировать
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteEntry.isPending}
                          onClick={() =>
                            handleDelete(
                              entry.id,
                              `${entry.workTypeName}, ${formatWorkDate(entry.workDate)}`,
                            )
                          }
                        >
                          Удалить
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
