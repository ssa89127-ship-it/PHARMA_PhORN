"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createOrder(data: {
  pharmacyId: string;
  items: { medicineId: string; quantity: number; unitPrice: number }[];
  deliveryAddress: any;
  paymentMethod?: string;
  deliveryFee?: number;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Avval tizimga kiring" };

    const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryFee = data.deliveryFee || 0;
    const total = subtotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        pharmacyId: data.pharmacyId,
        subtotal,
        deliveryFee,
        total,
        deliveryAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod,
        items: {
          create: data.items.map((item) => ({
            medicineId: item.medicineId,
            medicineName: "",
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
        tracking: {
          create: {
            status: "confirmed",
            description: "Buyurtma qabul qilindi",
            timestamp: new Date(),
          },
        },
      },
      include: { items: true, tracking: true },
    });

    revalidatePath("/cart");
    revalidatePath("/dashboard/patient");
    return { success: true, data: order };
  } catch {
    return { success: false, error: "Buyurtmani yaratishda xatolik" };
  }
}

export async function getUserOrders() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, error: "Avval tizimga kiring" };

    const orders = await prisma.order.findMany({
      where: { userId: (session.user as any).id },
      include: { items: true, tracking: { orderBy: { timestamp: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: orders };
  } catch {
    return { success: false, error: "Buyurtmalarni yuklashda xatolik" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as any,
        tracking: {
          create: {
            status,
            description: getStatusDescription(status),
            timestamp: new Date(),
          },
        },
      },
    });
    revalidatePath("/dashboard");
    return { success: true, data: order };
  } catch {
    return { success: false, error: "Buyurtma holatini yangilashda xatolik" };
  }
}

function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    PENDING: "Buyurtma kutilmoqda",
    CONFIRMED: "Buyurtma tasdiqlandi",
    PREPARING: "Buyurtma tayyorlanmoqda",
    PICKED_UP: "Buyurtma kuryer tomonidan olindi",
    IN_TRANSIT: "Buyurtma yo'lda",
    DELIVERED: "Buyurtma yetkazib berildi",
    CANCELLED: "Buyurtma bekor qilindi",
  };
  return descriptions[status] || "Holat yangilandi";
}
