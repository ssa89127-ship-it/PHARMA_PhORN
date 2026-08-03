/**
 * Lightweight homepage data - only loads what's needed
 * Avoids importing the full 21MB generated-data.json
 */

import type { Medicine, Pharmacy, Doctor, Category, Testimonial } from "@/types";

// Only load first N items for homepage display
const HOMEPAGE_MEDICINES = 8;
const HOMEPAGE_PHARMACIES = 4;
const HOMEPAGE_CATEGORIES = 18;

// Lazy load full data only when needed
let _fullData: any = null;
async function getFullData() {
  if (!_fullData) {
    _fullData = await import("./generated-data.json");
  }
  return _fullData;
}

// Static homepage data (no dynamic import needed)
export const homepageDoctors: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Akbar Karimov",
    slug: "dr-akbar-karimov",
    photo: "/images/doctor-1.svg",
    specialty: "Terapevt",
    experience: 15,
    education: "Toshkent Tibbiyot Akademiyasi",
    languages: ["O'zbek", "Rus", "Ingliz"],
    rating: 4.9,
    reviewCount: 342,
    consultationFee: 80000,
    isAvailableToday: true,
    availableForVideo: true,
    availableForChat: true,
    availableForInPerson: true,
    bio: "15 yillik tajribaga ega terapevt.",
    qualifications: ["Terapiya - oliy toifa"],
    awards: ["Yilning eng yaxshi shifokori 2023"],
    availableSlots: [],
    createdAt: "2024-01-01",
    updatedAt: "2024-11-01",
  },
  {
    id: "doc-2",
    name: "Dr. Lola Rahmonova",
    slug: "dr-lola-rahmonova",
    photo: "/images/doctor-2.svg",
    specialty: "Kardiolog",
    experience: 18,
    education: "Samarqand Tibbiyot Instituti",
    languages: ["O'zbek", "Rus"],
    rating: 4.8,
    reviewCount: 521,
    consultationFee: 120000,
    isAvailableToday: true,
    availableForVideo: true,
    availableForChat: false,
    availableForInPerson: true,
    bio: "Yurak-qon tomir kasalliklarini tashxislash va davolash bo'yicha yetakchi kardiolog.",
    qualifications: ["Kardiologiya - oliy toifa"],
    awards: ["O'zbekiston sog'liqni saqlash a'lochisi"],
    availableSlots: [],
    createdAt: "2024-01-01",
    updatedAt: "2024-11-01",
  },
  {
    id: "doc-3",
    name: "Dr. Jasur Tursunov",
    slug: "dr-jasur-tursunov",
    photo: "/images/doctor-3.svg",
    specialty: "Pediatr",
    experience: 12,
    education: "ToshkETI",
    languages: ["O'zbek", "Rus", "Ingliz"],
    rating: 4.9,
    reviewCount: 289,
    consultationFee: 70000,
    isAvailableToday: false,
    availableForVideo: true,
    availableForChat: true,
    availableForInPerson: true,
    bio: "Bolalar salomatligi bo'yicha tajribali pediatr.",
    qualifications: ["Pediatriya - oliy toifa"],
    awards: ["Eng yaxshi pediatr 2024"],
    availableSlots: [],
    createdAt: "2024-01-01",
    updatedAt: "2024-11-01",
  },
  {
    id: "doc-4",
    name: "Dr. Nilufar Karimova",
    slug: "dr-nilufar-karimova",
    photo: "/images/doctor-4.svg",
    specialty: "Dermatolog",
    experience: 10,
    education: "Toshkent Tibbiyot Akademiyasi",
    languages: ["O'zbek", "Rus"],
    rating: 4.7,
    reviewCount: 198,
    consultationFee: 90000,
    isAvailableToday: true,
    availableForVideo: true,
    availableForChat: true,
    availableForInPerson: false,
    bio: "Teri kasalliklarini davolash bo'yicha mutaxassis.",
    qualifications: ["Dermatologiya - oliy toifa"],
    awards: [],
    availableSlots: [],
    createdAt: "2024-01-01",
    updatedAt: "2024-11-01",
  },
  {
    id: "doc-5",
    name: "Dr. Sardor Raximov",
    slug: "dr-sardor-raximov",
    photo: "/images/doctor-5.svg",
    specialty: "Nevropatolog",
    experience: 20,
    education: "Toshkent Tibbiyot Akademiyasi",
    languages: ["O'zbek", "Rus", "Ingliz"],
    rating: 4.9,
    reviewCount: 456,
    consultationFee: 150000,
    isAvailableToday: false,
    availableForVideo: true,
    availableForChat: false,
    availableForInPerson: true,
    bio: "Nevrologiya sohasida 20 yillik tajriba.",
    qualifications: ["Nevrologiya - fan nomzodi"],
    awards: ["O'zbekiston tibbiyot a'lochisi"],
    availableSlots: [],
    createdAt: "2024-01-01",
    updatedAt: "2024-11-01",
  },
  {
    id: "doc-6",
    name: "Dr. Malika Yusupova",
    slug: "dr-malika-yusupova",
    photo: "/images/doctor-6.svg",
    specialty: "Ginekolog",
    experience: 14,
    education: "Samarqand Tibbiyot Instituti",
    languages: ["O'zbek", "Rus"],
    rating: 4.8,
    reviewCount: 312,
    consultationFee: 100000,
    isAvailableToday: true,
    availableForVideo: true,
    availableForChat: true,
    availableForInPerson: true,
    bio: "Ayollar salomatligi bo'yicha tajribali mutaxassis.",
    qualifications: ["Ginekologiya - oliy toifa"],
    awards: [],
    availableSlots: [],
    createdAt: "2024-01-01",
    updatedAt: "2024-11-01",
  },
];

export const homepageTestimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Aziza Karimova",
    role: "Bemor",
    content: "VitaHub orqali dori topish juda oson bo'ldi. Narxlarni solishtirib, arzonini topdim va 30 daqiqada yetkazib berishdi!",
    rating: 5,
    photo: "/images/testimonial-1.svg",
  },
  {
    id: "t-2",
    name: "Jamshid Aliyev",
    role: "Mijoz",
    content: "Shifokor bilan onlayn maslahatlashish juda qulay. Uyingdan chiqmasdan tibbiy maslahat oldim. Rahmat!",
    rating: 5,
    photo: "/images/testimonial-2.svg",
  },
  {
    id: "t-3",
    name: "Nodira Qosimova",
    role: "Ona",
    content: "Bolam uchun kerakli dorini topishda AI yordamchi juda foydali bo'ldi. Tez va aniq javob berdi.",
    rating: 5,
    photo: "/images/testimonial-3.svg",
  },
  {
    id: "t-4",
    name: "Sardor Normatov",
    role: "Sportchi",
    content: "Vitaminlar va sport ovqatlarini eng arzon narxlarda topdim. Yetkazish juda tez!",
    rating: 4,
    photo: "/images/testimonial-4.svg",
  },
];

// Categories with icons
export const homepageCategories: Category[] = [
  { id: "cat-1", name: "Og'riq qoldiruvchi", slug: "pain-relief", icon: "Activity", medicineCount: 1250, description: "Og'riq qoldiruvchi dorilar", image: "/images/medicines/categories/ogriq-qoldiruvchi.svg" },
  { id: "cat-2", name: "Antibiotiklar", slug: "antibiotics", icon: "Shield", medicineCount: 890, description: "Antibiotik dorilar", image: "/images/medicines/categories/antibiotiklar.svg" },
  { id: "cat-3", name: "Qandli diabet", slug: "diabetes", icon: "Droplet", medicineCount: 650, description: "Diabet uchun dorilar", image: "/images/medicines/categories/qandli-diabet.svg" },
  { id: "cat-4", name: "Yurak salomatligi", slug: "heart-health", icon: "Heart", medicineCount: 780, description: "Yurak uchun dorilar", image: "/images/medicines/categories/yurak-salomatligi.svg" },
  { id: "cat-5", name: "Allergiyalar", slug: "allergies", icon: "Wind", medicineCount: 520, description: "Allergiya uchun dorilar", image: "/images/medicines/categories/allergiyalar.svg" },
  { id: "cat-6", name: "Ovqat hazm qilish", slug: "digestive", icon: "Stethoscope", medicineCount: 680, description: "Hazm tizimi uchun", image: "/images/medicines/categories/ovqat-hazm.svg" },
  { id: "cat-7", name: "Vitaminlar", slug: "vitamins", icon: "Apple", medicineCount: 920, description: "Vitamin va minerallar", image: "/images/medicines/categories/vitaminlar.svg" },
  { id: "cat-8", name: "Nafas olish", slug: "respiratory", icon: "Brain", medicineCount: 450, description: "Nafas olish tizimi", image: "/images/medicines/categories/nafas-olish.svg" },
  { id: "cat-9", name: "Ko'z kasalliklari", slug: "eye-care", icon: "Eye", medicineCount: 380, description: "Ko'z uchun dorilar", image: "/images/medicines/categories/koz.svg" },
  { id: "cat-10", name: "Teri kasalliklari", slug: "skin-care", icon: "Smile", medicineCount: 560, description: "Teri uchun dorilar", image: "/images/medicines/categories/teri.svg" },
  { id: "cat-11", name: "O'simlik dorilar", slug: "herbal", icon: "Leaf", medicineCount: 340, description: "Tabiiy dorilar", image: "/images/medicines/categories/osimlik.svg" },
  { id: "cat-12", name: "Sport dorilar", slug: "sports", icon: "Dumbbell", medicineCount: 280, description: "Sport uchun dorilar", image: "/images/medicines/categories/sport.svg" },
  { id: "cat-13", name: "Kimyoviy preparatlar", slug: "chemical", icon: "FlaskConical", medicineCount: 420, description: "Kimyoviy dorilar", image: "/images/medicines/categories/kimyoviy.svg" },
  { id: "cat-14", name: "Uy hayvonlari", slug: "pets", icon: "PawPrint", medicineCount: 180, description: "Veterinariya dorilar", image: "/images/medicines/categories/uy-hayvonlari.svg" },
  { id: "cat-15", name: "Ona va bola", slug: "mother-child", icon: "Home", medicineCount: 520, description: "Ona va bola uchun", image: "/images/medicines/categories/ona-va-bola.svg" },
  { id: "cat-16", name: "Travmatologiya", slug: "trauma", icon: "Bone", medicineCount: 310, description: "Travma uchun dorilar", image: "/images/medicines/categories/travmatologiya.svg" },
  { id: "cat-17", name: "Ong (Psixologiya)", slug: "mental-health", icon: "Brain", medicineCount: 290, description: "Psixologik dorilar", image: "/images/medicines/categories/ong.svg" },
  { id: "cat-18", name: "Boshqa", slug: "other", icon: "Package", medicineCount: 1180, description: "Boshqa dorilar", image: "/images/medicines/categories/boshqa.svg" },
];

// Homepage medicines - lightweight, only essential data
export async function getHomepageMedicines(): Promise<Partial<Medicine>[]> {
  try {
    const data = await getFullData();
    const meds = (data.generatedMedicines as any[]).slice(0, HOMEPAGE_MEDICINES);
    return meds.map((m: any) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      category: m.category,
      manufacturer: m.manufacturer,
      dosage: m.dosage,
      form: m.form,
      unitPrice: m.unitPrice,
      image: m.image,
      discount: m.discount,
      prescriptionRequired: m.prescriptionRequired,
    }));
  } catch {
    return [];
  }
}

// Homepage pharmacies - lightweight
export async function getHomepagePharmacies(): Promise<Partial<Pharmacy>[]> {
  try {
    const data = await getFullData();
    const pharms = (data.generatedPharmacies as any[]).slice(0, HOMEPAGE_PHARMACIES);
    return pharms.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      city: p.city,
      rating: p.rating,
      reviewCount: p.reviewCount,
      isOpen: p.isOpen,
      deliveryTime: p.deliveryTime,
      freeDelivery: p.freeDelivery,
      logo: `/images/pharmacy-${(parseInt(p.id.replace('ph-', '')) % 12) + 1}.svg`,
    }));
  } catch {
    return [];
  }
}
