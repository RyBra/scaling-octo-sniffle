import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EntryForm, type EntryFormValues } from '@/components/entry-form';
import { useJournalEntry, useUpdateEntry } from '@/hooks/use-journal';

export function EntryEditPage() {
  const { siteId = '', id } = useParams<{ siteId: string; id: string }>();
  const navigate = useNavigate();
  const { data: entry, isLoading, isError } = useJournalEntry(siteId, id);
  const updateEntry = useUpdateEntry(siteId);
  const [errorMessage, setErrorMessage] = useState<string>();

  if (isLoading) return <p className="text-slate-500">Загрузка записи…</p>;

  if (isError || !entry) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">Запись не найдена</p>
        <Link to={`/sites/${siteId}`} className="text-blue-700 hover:underline">
          Вернуться к журналу
        </Link>
      </div>
    );
  }

  const handleSubmit = async (values: EntryFormValues) => {
    if (!id) return;
    setErrorMessage(undefined);
    try {
      await updateEntry.mutateAsync({ id, data: values });
      navigate(`/sites/${siteId}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Ошибка сохранения');
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <p className="text-sm text-slate-500">
        <Link to={`/sites/${siteId}`} className="hover:text-blue-700">
          ← К журналу
        </Link>
      </p>
      <EntryForm
        defaultValues={{
          workDate: entry.workDate,
          workTypeId: entry.workTypeId,
          employeeId: entry.employeeId,
          volume: entry.volume,
          unit: entry.unit,
        }}
        submitLabel="Сохранить"
        isSubmitting={updateEntry.isPending}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/sites/${siteId}`)}
      />
    </div>
  );
}
