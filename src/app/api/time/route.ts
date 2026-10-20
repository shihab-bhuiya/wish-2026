import { getUnlockTimestamp } from "@/lib/unlock";
import { connection } from "next/server";

export async function GET() {
    await connection();
    return Response.json(
        { serverNow: Date.now(), unlockAt: getUnlockTimestamp() },
        { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
}
