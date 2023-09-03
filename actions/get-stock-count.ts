import { prisma } from "@/lib/prismadb";

export async function getStockCounts(storeId: string) {
    const stocks = await prisma.product.count({
        where: {
            storeId,
            isArchived: false,
        },
    });

    return stocks;
}
