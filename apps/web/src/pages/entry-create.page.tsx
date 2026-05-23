import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EntryForm, type EntryFormValues } from '@/components/entry-form';
import { useCreateEntry } from '@/hooks/use-journal';

export function EntryCreatePage() {
  const { siteId = '' } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const createEntry = useCreateEntry(siteId);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async (values: EntryFormValues) => {
    setErrorMessage(undefined);
    try {
      await createEntry.mutateAsync(values);
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
        submitLabel="Создать запись"
        isSubmitting={createEntry.isPending}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/sites/${siteId}`)}
      />
    </div>
  );
}
