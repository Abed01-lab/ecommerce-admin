import { prisma } from "@/lib/prismadb";

export async function getSalesCount(storeId: string) {
    const salesCount = await prisma.order.count({
        where: {
            storeId,
            isPaid: true,
        },
    });

    return salesCount;
}
