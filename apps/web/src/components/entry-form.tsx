import { VOLUME_UNITS } from '@construction-journal/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { useEmployees, useWorkTypes } from '@/hooks/use-catalog';

const entrySchema = z.object({
  workDate: z.string().min(1, 'Укажите дату'),
  workTypeId: z.string().min(1, 'Выберите вид работ'),
  employeeId: z.string().min(1, 'Выберите сотрудника'),
  volume: z.coerce.number().positive('Объём должен быть больше нуля'),
  unit: z.enum(VOLUME_UNITS),
});

export type EntryFormValues = z.infer<typeof entrySchema>;

interface EntryFormProps {
  defaultValues?: Partial<EntryFormValues>;
  submitLabel: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

export function EntryForm({
  defaultValues,
  submitLabel,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}: EntryFormProps) {
  const { data: workTypes = [] } = useWorkTypes();
  const { data: employees = [] } = useEmployees();

  const activeWorkTypes = workTypes.filter((t) => t.isActive);
  const activeEmployees = employees.filter((e) => e.isActive);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      workDate: '',
      workTypeId: '',
      employeeId: '',
      volume: 1,
      unit: 'м³',
      ...defaultValues,
    },
  });

  const workTypeId = watch('workTypeId');
  const employeeId = watch('employeeId');
  const unit = watch('unit');

  useEffect(() => {
    const selected = activeWorkTypes.find((t) => t.id === workTypeId);
    if (selected?.defaultUnit) {
      setValue('unit', selected.defaultUnit);
    }
  }, [workTypeId, activeWorkTypes, setValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitLabel === 'Сохранить' ? 'Редактирование записи' : 'Новая запись'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="workDate">Дата выполнения</Label>
            <Input id="workDate" type="date" {...register('workDate')} />
            {errors.workDate && (
              <p className="text-sm text-red-600">{errors.workDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Вид работ</Label>
            <Select
              value={workTypeId}
              onValueChange={(v) => setValue('workTypeId', v, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите вид работ" />
              </SelectTrigger>
              <SelectContent>
                {activeWorkTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.workTypeId && (
              <p className="text-sm text-red-600">{errors.workTypeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Исполнитель</Label>
            <Select
              value={employeeId}
              onValueChange={(v) => setValue('employeeId', v, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите сотрудника" />
              </SelectTrigger>
              <SelectContent>
                {activeEmployees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.position})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeeId && (
              <p className="text-sm text-red-600">{errors.employeeId.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="volume">Объём</Label>
              <Input id="volume" type="number" step="0.001" min="0" {...register('volume')} />
              {errors.volume && (
                <p className="text-sm text-red-600">{errors.volume.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Единица измерения</Label>
              <Select
                value={unit}
                onValueChange={(v) =>
                  setValue('unit', v as EntryFormValues['unit'], { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOLUME_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение…' : submitLabel}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
