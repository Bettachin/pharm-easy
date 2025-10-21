import { NextResponse } from "next/server";

const medicineInfo: Record<string, string> = {
  Paracetamol: `
Used for: Relieves mild to moderate pain and reduces fever.
Dosage: 500–1000 mg every 4–6 hours as needed (max 4000 mg/day).
Side effects: Rare; may include nausea or allergic reaction.`,

  Ibuprofen: `
Used for: Reduces pain, inflammation, and fever.
Dosage: 200–400 mg every 6 hours with food.
Side effects: Stomach upset, heartburn, dizziness.`,

  "Vitamin C": `
Used for: Supports immune system and tissue repair.
Dosage: 500–1000 mg daily.
Side effects: High doses may cause diarrhea or stomach cramps.`,

  Amoxicillin: `
Used for: Treats bacterial infections (ear, throat, urinary tract, etc.).
Dosage: 500 mg every 8 hours or as prescribed by a doctor.
Side effects: Nausea, diarrhea, or rash.`,

  "Cough Syrup": `
Used for: Relieves cough and throat irritation.
Dosage: 5–10 mL every 4–6 hours as needed.
Side effects: Drowsiness, dizziness, or dry mouth.`,
};

export async function POST(req: Request) {
  const { medicine } = await req.json();
  if (!medicine || medicine.trim() === "") {
    return NextResponse.json(
      { info: "Please enter a valid medicine name." },
      { status: 400 }
    );
  }

  const name = Object.keys(medicineInfo).find(
    (m) => m.toLowerCase() === medicine.toLowerCase()
  );

  const info =
    name && medicineInfo[name]
      ? medicineInfo[name]
      : `No detailed info available for ${medicine}. Please consult a pharmacist.`;

  return NextResponse.json({ info });
}
