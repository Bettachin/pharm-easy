// src/lib/pharmacies.ts

export interface Pharmacy {
  id: number;
  name: string;
  lat: number;
  lng: number;
  hours: string;       // e.g. "8 AM – 8 PM"
  medicines: string[]; // ✅ always an array now
}

export const pharmacies: Pharmacy[] = [
  {
    id: 1,
    name: "Southstar Drug",
    lat: 12.6674373,
    lng: 123.8743633,
    hours: "8 AM – 8 PM",
    medicines: ["Paracetamol", "Vitamin C"],
  },
  {
    id: 2,
    name: "Super G",
    lat: 12.6658930,
    lng: 123.8746352,
    hours: "9 AM – 9 PM",
    medicines: ["Ibuprofen", "Cough Syrup", "Paracetamol", "Vitamin C"],
  },
  {
    id: 3,
    name: "Mercury Drug",
    lat: 12.666538,
    lng: 123.874261,
    hours: "24 Hours",
    medicines: ["Amoxicillin", "Pain Reliever"],
  },
  {
    id: 4,
    name: "UniDrugstore",
    lat: 12.667570,
    lng: 123.873864,
    hours: "7 AM – 10 PM",
    medicines: [], // ✅ empty array if no data yet
  },
  {
    id: 5,
    name: "TGP",
    lat: 12.666498,
    lng: 123.874714,
    hours: "8 AM – 8 PM",
    medicines: [],
  },
  {
    id: 6,
    name: "Farmacia Lourdes",
    lat: 12.668162,
    lng: 123.873497,
    hours: "8 AM – 10 PM",
    medicines: [],
  },
  {
    id: 7,
    name: "Botica Ada",
    lat: 12.665689,
    lng: 123.874526,
    hours: "8 AM – 9 PM",
    medicines: [],
  },
];
