import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Image } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, price, categoryId, sizeId, colorId, isFeatured, isArchived, images } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                userId,
                id: params.storeId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                price,
                isArchived,
                isFeatured,
                categoryId,
                sizeId,
                storeId: params.storeId,
                colorId,
                images: {
                    createMany: {
                        data: [...images.map((image: Image) => image)],
                    },
                },
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");
        const colorId = searchParams.get("colorId");
        const sizeId = searchParams.get("sizeId");
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const products = await prisma.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId: categoryId ? categoryId : undefined,
                colorId: colorId ? colorId : undefined,
                sizeId: sizeId ? sizeId : undefined,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
