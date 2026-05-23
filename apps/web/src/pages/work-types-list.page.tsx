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
import { useDeleteWorkType, useWorkTypes } from '@/hooks/use-catalog';

export function WorkTypesListPage() {
  const { data: workTypes = [], isLoading, isError, error } = useWorkTypes();
  const deleteWorkType = useDeleteWorkType();

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Удалить вид работ «${name}»?`)) return;
    await deleteWorkType.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Виды работ</h1>
          <p className="text-sm text-slate-500">Справочник для журнала</p>
        </div>
        <Button asChild>
          <Link to="/work-types/new">Добавить вид работ</Link>
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
          {!isLoading && !isError && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Код</TableHead>
                  <TableHead>Ед. по умолчанию</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workTypes.map((wt) => (
                  <TableRow key={wt.id}>
                    <TableCell>{wt.name}</TableCell>
                    <TableCell>{wt.code}</TableCell>
                    <TableCell>{wt.defaultUnit ?? '—'}</TableCell>
                    <TableCell>{wt.isActive ? 'Активен' : 'Неактивен'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/work-types/${wt.id}/edit`}>Редактировать</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteWorkType.isPending}
                          onClick={() => handleDelete(wt.id, wt.name)}
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
