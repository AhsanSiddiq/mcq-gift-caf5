import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const { error } = await supabase
      .from("subscribers")
      .insert([{ email: email.toLowerCase().trim(), source: "landing_page" }]);

    if (error) {
      // Duplicate email: treat as success (silent)
      if (error.code === "23505") {
        return NextResponse.json({ success: true });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
