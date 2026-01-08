import { useLessons } from "@/hooks/use-lessons";
import { LessonCard } from "@/components/LessonCard";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Library() {
  const { data: lessons, isLoading } = useLessons();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between border-b pb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                Your Library
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage and review all your generated educational content.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : lessons?.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
                <h3 className="text-xl font-bold mb-2">Library is empty</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't generated any lessons yet. Your academic collection will appear here.
                </p>
                <Link href="/create">
                  <Button>Generate Content</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {lessons?.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
