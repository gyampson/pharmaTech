import {
 
  profile3,
  profile4,
  profile5,
  profile6,
  
} from "./assets";

export const testimonials = [
  {
    avatar: profile3,
    name: "Samuel Boadi",
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
             veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea`,
  },
  {
    avatar: profile4,
    name: "Emmanuel Joseph",
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
             veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea`,
  },
  {
    avatar: profile5,
    name: "Gloria Beauty",
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
             veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea`,
  },
  {
    avatar: profile6,
    name: "Precious Marble",
    review: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
             veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea`,
  },
];




export const mockPrescriptions = [
  {
    id: "1",
    patientName: "John Doe",
    patientId: "P12345",
    medication: "Amoxicillin",
    dosage: "500mg",
    frequency: "3 times daily",
    requestDate: new Date(2023, 5, 28),
    status: "pending",
    priority: "normal",
  },
  {
    id: "2",
    patientName: "Emma Wilson",
    patientId: "P12346",
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    requestDate: new Date(2023, 5, 27),
    status: "pending",
    priority: "high",
  },
  {
    id: "3",
    patientName: "Michael Brown",
    patientId: "P12347",
    medication: "Metformin",
    dosage: "1000mg",
    frequency: "Twice daily",
    requestDate: new Date(2023, 5, 26),
    status: "completed",
    completedDate: new Date(2023, 5, 27),
    priority: "normal",
  },
  {
    id: "4",
    patientName: "Sarah Johnson",
    patientId: "P12348",
    medication: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily at bedtime",
    requestDate: new Date(2023, 5, 25),
    status: "completed",
    completedDate: new Date(2023, 5, 26),
    priority: "normal",
  },
  {
    id: "5",
    patientName: "David Lee",
    patientId: "P12349",
    medication: "Albuterol",
    dosage: "90mcg",
    frequency: "As needed",
    requestDate: new Date(2023, 5, 28),
    status: "pending",
    priority: "urgent",
  },
];

export const mockPatients = [
  {
    id: "P12345",
    name: "John Doe",
    age: 45,
    gender: "Male",
    lastVisit: new Date(2023, 5, 15),
    activePrescriptions: 3,
  },
  {
    id: "P12346",
    name: "Emma Wilson",
    age: 32,
    gender: "Female",
    lastVisit: new Date(2023, 5, 20),
    activePrescriptions: 2,
  },
  {
    id: "P12347",
    name: "Michael Brown",
    age: 58,
    gender: "Male",
    lastVisit: new Date(2023, 5, 10),
    activePrescriptions: 4,
  },
  {
    id: "P12348",
    name: "Sarah Johnson",
    age: 29,
    gender: "Female",
    lastVisit: new Date(2023, 5, 22),
    activePrescriptions: 1,
  },
  {
    id: "P12349",
    name: "David Lee",
    age: 67,
    gender: "Male",
    lastVisit: new Date(2023, 5, 18),
    activePrescriptions: 5,
  },
];

export const mockInventory = [
  {
    id: "1",
    name: "Amoxicillin 500mg",
    stock: 120,
    reorderLevel: 30,
    status: "normal",
  },
  {
    id: "2",
    name: "Lisinopril 10mg",
    stock: 85,
    reorderLevel: 25,
    status: "normal",
  },
  {
    id: "3",
    name: "Metformin 1000mg",
    stock: 22,
    reorderLevel: 30,
    status: "low",
  },
  {
    id: "4",
    name: "Atorvastatin 20mg",
    stock: 45,
    reorderLevel: 20,
    status: "normal",
  },
  {
    id: "5",
    name: "Albuterol Inhaler",
    stock: 15,
    reorderLevel: 20,
    status: "low",
  },
  {
    id: "6",
    name: "Levothyroxine 50mcg",
    stock: 8,
    reorderLevel: 15,
    status: "critical",
  },
];

