import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function count() {
  const { count, error } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("subject_id", "caf-7");

  if (error) {
    console.error("Error:", error);
  } else {
    console.log(`Total questions for caf-7: ${count}`);
  }
}

count();
