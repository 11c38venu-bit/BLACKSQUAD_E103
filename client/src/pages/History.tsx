import { useContentHistory } from "@/hooks/use-content";
import { Navigation } from "@/components/Navigation";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Loader2, ArrowRight, Calendar, Book, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function History() {
  const { data: history, isLoading } = useContentHistory();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Generation History</h1>
            <p className="text-muted-foreground mt-1">Review your past generated content and materials.</p>
          </div>
          <Link href="/">
             <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
               Generate New
               <ArrowRight className="w-4 h-4" />
             </button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !history || history.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No content yet</h3>
            <p className="text-muted-foreground mb-6">Start by generating your first learning material.</p>
            <Link href="/">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Create Content
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/content/${item.id}`} className="block group">
                  <div className="bg-card hover:bg-white/80 dark:hover:bg-slate-900 border border-border/50 hover:border-primary/30 rounded-xl p-5 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            item.learnerLevel === "Beginner" ? "bg-emerald-100 text-emerald-700" :
                            item.learnerLevel === "Intermediate" ? "bg-blue-100 text-blue-700" :
                            "bg-purple-100 text-purple-700"
                          )}>
                            {item.learnerLevel}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(item.createdAt || new Date()), "MMM d, yyyy")}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.topic}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Book className="w-3 h-3" />
                          <span>{item.subject}</span>
                          <span className="text-border mx-1">|</span>
                          <GraduationCap className="w-3 h-3" />
                          <span>{item.curriculum}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col items-end gap-1 min-w-[100px]">
                            <span className="text-xs uppercase font-bold text-muted-foreground">Quality Score</span>
                            <div className="flex items-center gap-2">
                               <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-emerald-500 rounded-full" 
                                    style={{ width: `${item.factualCorrectnessScore}%` }} 
                                  />
                               </div>
                               <span className="text-sm font-bold text-foreground">{item.factualCorrectnessScore}</span>
                            </div>
                         </div>
                         <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
