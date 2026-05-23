import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useConstructionSites,
  useDeleteConstructionSite,
} from '@/hooks/use-catalog';

export function SitesListPage() {
  const { data: sites = [], isLoading, isError, error } = useConstructionSites();
  const deleteSite = useDeleteConstructionSite();

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Удалить объект «${name}» и все записи журнала?`)) return;
    await deleteSite.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Строительные объекты</h1>
          <p className="text-sm text-slate-500">У каждого объекта свой журнал работ</p>
        </div>
        <Button asChild>
          <Link to="/sites/new">Добавить объект</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading && <p className="p-6 text-slate-500">Загрузка…</p>}
          {isError && (
            <p className="p-6 text-red-600">
              {error instanceof Error ? error.message : 'Ошибка загрузки'}
            </p>
          )}
          {!isLoading && !isError && sites.length === 0 && (
            <p className="p-6 text-slate-500">Объектов пока нет.</p>
          )}
          {!isLoading && !isError && sites.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Адрес</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>{site.address ?? '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="default" size="sm" asChild>
                          <Link to={`/sites/${site.id}`}>Журнал</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/sites/${site.id}/edit`}>Редактировать</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteSite.isPending}
                          onClick={() => handleDelete(site.id, site.name)}
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
