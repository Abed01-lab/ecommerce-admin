import { prisma } from "@/lib/prismadb";
import ProductClient from "./components/client";
import { ProductColumn } from "./components/columns";
import { format } from 'date-fns'
import { formatter } from "@/lib/utils";

export default async function ProductPage(params: { storeId: string }) {
	const products = await prisma.product.findMany({
		where: {
			storeId: params.storeId
		},
		include: {
			category: true,
			color: true,
			size: true,
		},
		orderBy: {
			createdAt: "desc"
		}
	})

	const formattedProducts: ProductColumn[] = products.map(item => ({
		id: item.id,
		name: item.name,
		isFeatured: item.isFeatured,
		isArchived: item.isArchived,
		price: formatter.format(item.price.toNumber()),
		category: item.category.name,
		color: item.color.value,
		size: item.size.name,
		createdAt: format(item.createdAt, "MMMM do, yyyy")
	}))


	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductClient data={formattedProducts} />
			</div>
		</div>
	)
}
