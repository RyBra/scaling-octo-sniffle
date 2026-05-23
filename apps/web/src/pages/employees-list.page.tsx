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
import { useDeleteEmployee, useEmployees } from '@/hooks/use-catalog';

export function EmployeesListPage() {
  const { data: employees = [], isLoading, isError, error } = useEmployees();
  const deleteEmployee = useDeleteEmployee();

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Удалить сотрудника «${name}»?`)) return;
    await deleteEmployee.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Сотрудники</h1>
          <p className="text-sm text-slate-500">Исполнители работ на объектах</p>
        </div>
        <Button asChild>
          <Link to="/employees/new">Добавить сотрудника</Link>
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
                  <TableHead>ФИО</TableHead>
                  <TableHead>Должность</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.fullName}</TableCell>
                    <TableCell className="capitalize">{emp.position}</TableCell>
                    <TableCell>{emp.isActive ? 'Активен' : 'Неактивен'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/employees/${emp.id}/edit`}>Редактировать</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteEmployee.isPending}
                          onClick={() => handleDelete(emp.id, emp.fullName)}
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
