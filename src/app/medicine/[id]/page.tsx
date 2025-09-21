interface MedicinePageProps {
  params: { id: string };
}

export default function MedicinePage({ params }: MedicinePageProps) {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Medicine #{params.id}</h1>
      <p>Dosage: [Placeholder]</p>
      <p>Instructions: [Placeholder]</p>
      <p>Side Effects: [Placeholder]</p>
    </div>
  );
}
