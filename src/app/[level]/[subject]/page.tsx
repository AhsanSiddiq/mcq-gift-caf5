import { allSubjects } from "@/data/subjects";
import { supabase } from "@/lib/supabase";
import SubjectHomeClient from "@/components/SubjectHomeClient";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Static caching for the metadata endpoint equivalent

export default async function SubjectHome({ params }: { params: Promise<{ level: string; subject: string }> }) {
  const { subject, level } = await params;
  
  const currentSubject = allSubjects.find(s => s.id === subject);
  if (!currentSubject) return notFound();

  // Instant DB count server-side
  const { count } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("subject_id", subject)
    .eq("is_active", true);

  return (
    <SubjectHomeClient
      level={level}
      subjectId={subject}
      currentSubject={currentSubject}
      totalQuestions={count || 0}
    />
  );
}
