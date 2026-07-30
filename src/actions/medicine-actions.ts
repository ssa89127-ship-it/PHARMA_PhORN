"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMedicines(params?: {
  category?: string;
  search?: string;
  prescription?: boolean;
  page?: number;
  limit?: number;
}) {
  try {
    const { category, search, prescription, page = 1, limit = 20 } = params || {};
    const skip = (page - 1) * limit;

    const where: any = { isAvailable: true };
    if (category) where.category = { contains: category, mode: "insensitive" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { genericName: { contains: search, mode: "insensitive" } },
        { manufacturer: { contains: search, mode: "insensitive" } },
      ];
    }
    if (prescription !== undefined) where.prescriptionRequired = prescription;

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
      prisma.medicine.count({ where }),
    ]);

    return {
      success: true,
      data: medicines,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  } catch {
    return { success: false, error: "Dorilarni yuklashda xatolik" };
  }
}

export async function getMedicineById(id: string) {
  try {
    const medicine = await prisma.medicine.findUnique({
      where: { id },
      include: {
        pharmacies: {
          include: { pharmacy: true },
          orderBy: { price: "asc" },
        },
        categoryRel: true,
      },
    });
    return { success: true, data: medicine };
  } catch {
    return { success: false, error: "Dorini yuklashda xatolik" };
  }
}

export async function getMedicineBySlug(slug: string) {
  try {
    const medicine = await prisma.medicine.findUnique({
      where: { slug },
      include: {
        pharmacies: {
          include: { pharmacy: true },
          orderBy: { price: "asc" },
        },
      },
    });
    return { success: true, data: medicine };
  } catch {
    return { success: false, error: "Dorini yuklashda xatolik" };
  }
}

export async function getMedicinePrices(medicineId: string) {
  try {
    const prices = await prisma.pharmacyMedicine.findMany({
      where: { medicineId, isAvailable: true },
      include: { pharmacy: true },
      orderBy: { price: "asc" },
    });
    return { success: true, data: prices };
  } catch {
    return { success: false, error: "Narxlarni yuklashda xatolik" };
  }
}

export async function createMedicine(data: {
  name: string;
  description: string;
  manufacturer?: string;
  category?: string;
  unitPrice: number;
  form?: string;
  prescriptionRequired?: boolean;
}) {
  try {
    const medicine = await prisma.medicine.create({
      data: {
        ...data,
        slug: data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        form: (data.form as any) || "TABLET",
        sideEffects: [],
        alternatives: [],
        stockQuantity: 100,
      },
    });
    revalidatePath("/medicines");
    return { success: true, data: medicine };
  } catch {
    return { success: false, error: "Dorini yaratishda xatolik" };
  }
}

export async function updateMedicine(id: string, data: Partial<{
  name: string;
  unitPrice: number;
  stockQuantity: number;
  isAvailable: boolean;
  description: string;
  manufacturer: string;
}>) {
  try {
    const medicine = await prisma.medicine.update({ where: { id }, data });
    revalidatePath("/medicines");
    return { success: true, data: medicine };
  } catch {
    return { success: false, error: "Dorini yangilashda xatolik" };
  }
}

export async function deleteMedicine(id: string) {
  try {
    await prisma.medicine.delete({ where: { id } });
    revalidatePath("/medicines");
    return { success: true };
  } catch {
    return { success: false, error: "Dorini o'chirishda xatolik" };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return { success: true, data: categories };
  } catch {
    return { success: false, error: "Kategoriyalarni yuklashda xatolik" };
  }
}

export async function getPopularMedicines(limit = 8) {
  try {
    const medicines = await prisma.medicine.findMany({
      where: { isAvailable: true, discount: { not: null } },
      orderBy: { discount: "desc" },
      take: limit,
    });
    return { success: true, data: medicines };
  } catch {
    return { success: false, error: "Mashhur dorilarni yuklashda xatolik" };
  }
}
