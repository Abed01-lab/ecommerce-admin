import { prisma } from "@/lib/prismadb";

export async function getTotalRevenue(storeId: string) {
    const paidOrders = await prisma.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + Number(item.product.price);
        }, 0);

        return orderTotal + total;
    }, 0);

    return totalRevenue;
}
