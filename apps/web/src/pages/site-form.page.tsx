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
  useConstructionSite,
  useCreateConstructionSite,
  useUpdateConstructionSite,
} from '@/hooks/use-catalog';

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function SiteFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { data: site, isLoading } = useConstructionSite(id);
  const createSite = useCreateConstructionSite();
  const updateSite = useUpdateConstructionSite();
  const [errorMessage, setErrorMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: site ? { name: site.name, address: site.address ?? '' } : undefined,
    defaultValues: { name: '', address: '' },
  });

  if (isEdit && isLoading) {
    return <p className="text-slate-500">Загрузка…</p>;
  }

  const onSubmit = async (values: FormValues) => {
    setErrorMessage(undefined);
    try {
      if (isEdit && id) {
        await updateSite.mutateAsync({
          id,
          data: { name: values.name, address: values.address || null },
        });
      } else {
        await createSite.mutateAsync({
          name: values.name,
          address: values.address || undefined,
        });
      }
      navigate('/sites');
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Ошибка сохранения');
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Редактирование объекта' : 'Новый объект'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Адрес</Label>
              <Input id="address" {...register('address')} />
            </div>
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={createSite.isPending || updateSite.isPending}>
                Сохранить
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/sites">Отмена</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
