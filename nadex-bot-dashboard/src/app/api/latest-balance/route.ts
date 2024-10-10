import { getLatestBalance } from "@/actions/getLatestBalance"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'


export async function GET() {
	try {
		const balance = await getLatestBalance()
		return NextResponse.json({ balance }, {
      status: 200,
    });
	} catch (error) {
		return NextResponse.json({ error: "Failed to get latest balance" },{
			status: 500,
		});
	}
	
}
