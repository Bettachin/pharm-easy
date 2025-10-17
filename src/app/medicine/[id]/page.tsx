interface MedicinePageProps {
  params: Promise<{ id: string }>;
}

export default async function MedicinePage({ params }: MedicinePageProps) {
  const { id } = await params;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Medicine #{id}</h1>
      <p>Dosage: [Placeholder]</p>
      <p>Instructions: [Placeholder]</p>
      <p>Side Effects: [Placeholder]</p>
    </div>
  );
}
