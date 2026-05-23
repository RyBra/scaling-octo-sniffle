import { VOLUME_UNITS } from '@construction-journal/shared';
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
import { useCreateWorkType, useUpdateWorkType, useWorkType } from '@/hooks/use-catalog';

const schema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  defaultUnit: z.enum(VOLUME_UNITS).optional(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function WorkTypeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: workType, isLoading } = useWorkType(id);
  const createWorkType = useCreateWorkType();
  const updateWorkType = useUpdateWorkType();
  const [errorMessage, setErrorMessage] = useState<string>();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: workType
      ? {
          name: workType.name,
          code: workType.code,
          defaultUnit: workType.defaultUnit ?? undefined,
          isActive: workType.isActive,
        }
      : undefined,
    defaultValues: { name: '', code: '', isActive: true },
  });

  const defaultUnit = watch('defaultUnit');
  const isActive = watch('isActive');

  if (isEdit && isLoading) return <p className="text-slate-500">Загрузка…</p>;

  const onSubmit = async (values: FormValues) => {
    setErrorMessage(undefined);
    try {
      if (isEdit && id) {
        await updateWorkType.mutateAsync({ id, data: values });
      } else {
        await createWorkType.mutateAsync(values);
      }
      navigate('/work-types');
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Ошибка сохранения');
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Редактирование вида работ' : 'Новый вид работ'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Код</Label>
              <Input id="code" {...register('code')} placeholder="CONCRETE" />
              {errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Единица по умолчанию</Label>
              <Select
                value={defaultUnit ?? ''}
                onValueChange={(v) =>
                  setValue('defaultUnit', v ? (v as FormValues['defaultUnit']) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Не задана" />
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
              <Button type="submit" disabled={createWorkType.isPending || updateWorkType.isPending}>
                Сохранить
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/work-types">Отмена</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
