import { EMPLOYEE_POSITIONS } from '@construction-journal/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
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
import { useCreateEmployee, useEmployee, useUpdateEmployee } from '@/hooks/use-catalog';

const schema = z.object({
  fullName: z.string().min(2, 'Минимум 2 символа'),
  position: z.enum(EMPLOYEE_POSITIONS),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: employee, isLoading } = useEmployee(id);
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: employee
      ? { fullName: employee.fullName, position: employee.position, isActive: employee.isActive }
      : undefined,
    defaultValues: { fullName: '', position: 'рабочий', isActive: true },
  });

  const position = watch('position');
  const isActive = watch('isActive');

  if (isEdit && isLoading) return <p className="text-slate-500">Загрузка…</p>;

  const onSubmit = async (values: FormValues) => {
    setErrorMessage(undefined);
    try {
      if (isEdit && id) {
        await updateEmployee.mutateAsync({ id, data: values });
      } else {
        await createEmployee.mutateAsync(values);
      }
      navigate('/employees');
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Ошибка сохранения');
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Редактирование сотрудника' : 'Новый сотрудник'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="fullName">ФИО</Label>
              <Input id="fullName" {...register('fullName')} />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Должность</Label>
              <Select
                value={position}
                onValueChange={(v) =>
                  setValue('position', v as FormValues['position'], { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_POSITIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setValue('isActive', e.target.checked)}
              />
              <Label htmlFor="isActive">Активен</Label>
            </div>
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={createEmployee.isPending || updateEmployee.isPending}>
                Сохранить
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/employees">Отмена</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
