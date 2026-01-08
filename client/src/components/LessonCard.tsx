import { type Lesson } from "@shared/schema";
import { Link } from "wouter";
import { Calendar, BookOpen, BarChart, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  // Safe parsing of content to get overview snippet
  const overview = (lesson.content as any)?.overview || "No overview available.";
  const auditScore = (lesson.content as any)?.audit?.factualCorrectness || 0;

  return (
    <Link href={`/lesson/${lesson.id}`} className="group block">
      <div className="h-full bg-card hover:bg-card/50 border border-border hover:border-primary/50 rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
        
        <div className="flex flex-col h-full relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              {lesson.subject}
            </div>
            {lesson.createdAt && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {format(new Date(lesson.createdAt), 'MMM d, yyyy')}
              </div>
            )}
          </div>

          <h3 className="font-display font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {lesson.topic}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
            {overview}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <BarChart className="w-3 h-3" />
                Lvl: {lesson.level}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Score: {auditScore}%
              </span>
            </div>
            
            <div className="bg-primary/10 p-2 rounded-full text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
