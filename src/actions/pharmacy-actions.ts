"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPharmacies() {
  try {
    const pharmacies = await prisma.pharmacy.findMany({
      orderBy: { rating: "desc" },
    });
    return { success: true, data: pharmacies };
  } catch {
    return { success: false, error: "Dorixonalarni yuklashda xatolik" };
  }
}

export async function getPharmacyById(id: string) {
  try {
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id },
      include: { medicines: { include: { medicine: true } } },
    });
    return { success: true, data: pharmacy };
  } catch {
    return { success: false, error: "Dorixonani yuklashda xatolik" };
  }
}

export async function createPharmacy(data: {
  name: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
}) {
  try {
    const pharmacy = await prisma.pharmacy.create({
      data: {
        ...data,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
        description: "",
        state: "",
        zipCode: "",
        rating: 0,
      },
    });
    revalidatePath("/pharmacies");
    return { success: true, data: pharmacy };
  } catch (error) {
    return { success: false, error: "Dorixonani yaratishda xatolik" };
  }
}

export async function updatePharmacy(id: string, data: Partial<{
  name: string;
  address: string;
  city: string;
  phone: string;
  isOpen: boolean;
  is24hours: boolean;
  freeDelivery: boolean;
  deliveryFee: number;
  rating: number;
}>) {
  try {
    const pharmacy = await prisma.pharmacy.update({
      where: { id },
      data,
    });
    revalidatePath("/pharmacies");
    revalidatePath(`/pharmacies?id=${id}`);
    return { success: true, data: pharmacy };
  } catch {
    return { success: false, error: "Dorixonani yangilashda xatolik" };
  }
}

export async function deletePharmacy(id: string) {
  try {
    await prisma.pharmacy.delete({ where: { id } });
    revalidatePath("/pharmacies");
    return { success: true };
  } catch {
    return { success: false, error: "Dorixonani o'chirishda xatolik" };
  }
}

export async function searchPharmacies(query: string) {
  try {
    const pharmacies = await prisma.pharmacy.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { address: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { rating: "desc" },
      take: 20,
    });
    return { success: true, data: pharmacies };
  } catch {
    return { success: false, error: "Qidiruvda xatolik" };
  }
}
