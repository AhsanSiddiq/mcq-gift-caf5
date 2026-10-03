import { NextRequest, NextResponse } from "next/server";
import { getProStatus, verifySession } from "@/lib/session";

// POST /api/pro/status — body: { email, token }
export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json();
    if (!(await verifySession(email, token))) {
      return NextResponse.json({ pro: false, signedIn: false });
    }
    const status = await getProStatus(email);
    return NextResponse.json({ ...status, signedIn: true });
  } catch {
    return NextResponse.json({ pro: false, signedIn: false });
  }
}
