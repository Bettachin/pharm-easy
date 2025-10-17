interface PharmacyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PharmacyPage({ params }: PharmacyPageProps) {
  const { id } = await params;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Pharmacy #{id}</h1>
      <p>Address: [Placeholder]</p>
      <p>Contact: [Placeholder]</p>
      <p>Working Hours: [Placeholder]</p>

      <h2 className="text-xl font-semibold mt-4">Available Medicines</h2>
      <ul className="list-disc pl-6">
        <li>Medicine A - 500mg</li>
        <li>Medicine B - 10mg</li>
      </ul>
    </div>
  );
}
