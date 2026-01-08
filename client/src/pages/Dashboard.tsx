import { useLessons } from "@/hooks/use-lessons";
import { LessonCard } from "@/components/LessonCard";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, BookOpenCheck } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { data: lessons, isLoading } = useLessons();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
                Welcome back, {user?.firstName || 'Scholar'}
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Continue your learning journey or explore new topics today.
              </p>
            </div>
            <Link href="/create">
              <Button size="lg" className="shadow-lg shadow-primary/25">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Lesson
              </Button>
            </Link>
          </div>

          {/* Stats / Quick Overview (Mock) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-600">
                  <BookOpenCheck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Total Lessons</h3>
              </div>
              <p className="text-3xl font-bold font-mono">{lessons?.length || 0}</p>
            </div>
            {/* Add more stats here if needed */}
          </div>

          {/* Lesson Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-display">Recent Lessons</h2>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : lessons?.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                  <PlusCircle className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No lessons yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Get started by generating your first AI-powered lesson plan tailored to your needs.
                </p>
                <Link href="/create">
                  <Button>Create Your First Lesson</Button>
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
