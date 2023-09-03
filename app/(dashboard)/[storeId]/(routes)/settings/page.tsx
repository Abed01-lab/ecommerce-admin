import { prisma } from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import SettingsForm from "./components/settings-form"

interface SettingPageProps {
	params: {
		storeId: string
	}
}

export default async function SettingPage({ params }: SettingPageProps) {
	const { userId } = auth()

	if (!userId) {
		redirect("/sign-in")
	}

	const store = await prisma.store.findFirst({
		where: {
			id: params.storeId
		}
	})

	if (!store) {
		redirect("/")
	}
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<SettingsForm initialData={store} />
			</div>
		</div>
	)
}
