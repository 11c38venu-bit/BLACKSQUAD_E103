import { useLesson, useDeleteLesson } from "@/hooks/use-lessons";
import { Sidebar } from "@/components/Sidebar";
import { useRoute } from "wouter";
import { Loader2, Trash2, CheckCircle2, AlertTriangle, BookOpen, Brain, Lightbulb, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimationPreview } from "@/components/AnimationPreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LessonView() {
  const [, params] = useRoute("/lesson/:id");
  const id = Number(params?.id);
  const { data: lesson, isLoading } = useLesson(id);
  const { mutate: deleteLesson, isPending: isDeleting } = useDeleteLesson();
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // Cast content to any because types are flexible in JSONB, but we know structure from schema
  const content = lesson.content as any;
  const quiz = content.quiz || [];
  
  // Calculate quiz score
  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q: any, idx: number) => {
      const selectedOption = q.options?.[quizAnswers[idx]];
      const isCorrect = String(q.correctAnswer).trim().toLowerCase() === String(selectedOption).trim().toLowerCase();
      if (isCorrect) correct++;
    });
    return Math.round((correct / quiz.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 relative">
        {/* Floating Action Bar */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">{lesson.subject}</div>
            <h1 className="text-xl font-display font-bold text-foreground truncate max-w-lg">{lesson.topic}</h1>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the lesson
                    and remove the data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteLesson(id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-8 space-y-12 pb-32">
          
          {/* Overview Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-primary mb-2">
              <BookOpen className="h-6 w-6" />
              <h2 className="text-2xl font-display font-bold">Overview</h2>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl leading-relaxed text-muted-foreground">
                {content.overview}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {content.keyTakeaways?.map((takeaway: string, i: number) => (
                <div key={i} className="bg-secondary/30 border border-secondary p-4 rounded-xl">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold mb-3">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium">{takeaway}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Interactive Animation */}
          {content.animationCode && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-accent mb-2">
                <Brain className="h-6 w-6" />
                <h2 className="text-2xl font-display font-bold">Interactive Visualization</h2>
              </div>
              <AnimationPreview code={content.animationCode} />
            </motion.section>
          )}

          {/* Core Explanation */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
             <div className="flex items-center gap-3 text-primary mb-2">
              <Lightbulb className="h-6 w-6" />
              <h2 className="text-2xl font-display font-bold">Deep Dive</h2>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none bg-card p-8 rounded-2xl border border-border/60 shadow-sm">
              <ReactMarkdown>{content.explanation}</ReactMarkdown>
            </div>
          </motion.section>

          {/* Real World Example */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-indigo-50 dark:bg-indigo-950/20 p-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/50"
          >
            <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-4 uppercase tracking-wider">Real World Application</h3>
            <div className="prose prose-indigo dark:prose-invert max-w-none">
              <ReactMarkdown>{content.example}</ReactMarkdown>
            </div>
          </motion.section>

          {/* Quiz Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-primary mb-2">
              <GraduationCap className="h-6 w-6" />
              <h2 className="text-2xl font-display font-bold">Knowledge Check</h2>
            </div>
            
            <div className="space-y-6">
              {quiz.map((q: any, qIdx: number) => (
                <div key={qIdx} className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <h4 className="text-lg font-medium mb-4">{qIdx + 1}. {q.question}</h4>
                  <div className="space-y-2">
                    {q.options?.map((opt: string, optIdx: number) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      const isCorrect = String(q.correctAnswer).trim().toLowerCase() === String(opt).trim().toLowerCase();
                      
                      let variant = "outline"; 
                      if (showResults) {
                        if (isCorrect) variant = "success";
                        else if (isSelected && !isCorrect) variant = "destructive";
                      } else if (isSelected) {
                        variant = "selected";
                      }

                      return (
                        <div 
                          key={optIdx}
                          onClick={() => !showResults && setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between",
                            !showResults && isSelected && "border-primary bg-primary/5 ring-1 ring-primary",
                            !showResults && !isSelected && "border-border hover:bg-secondary/50",
                            showResults && isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
                            showResults && isSelected && !isCorrect && "border-destructive bg-destructive/5 text-destructive",
                            showResults && !isSelected && !isCorrect && "opacity-50"
                          )}
                        >
                          <span>{opt}</span>
                          {showResults && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          {showResults && isSelected && !isCorrect && <AlertTriangle className="h-5 w-5 text-destructive" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between bg-muted/20 p-6 rounded-xl">
              {showResults ? (
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold font-display">{calculateScore()}%</div>
                  <div className="text-sm text-muted-foreground">
                    {calculateScore() >= 80 ? "Excellent work! You've mastered this topic." : "Keep reviewing the material to improve your score."}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Answer all questions to see your score</div>
              )}
              
              {!showResults ? (
                <Button onClick={() => setShowResults(true)} disabled={Object.keys(quizAnswers).length !== quiz.length}>
                  Submit Answers
                </Button>
              ) : (
                <Button variant="outline" onClick={() => { setShowResults(false); setQuizAnswers({}); }}>
                  Retake Quiz
                </Button>
              )}
            </div>
          </motion.section>

          {/* Audit Footer */}
          <div className="border-t border-border pt-8 mt-12 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 mb-2 font-semibold uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4" /> AI Confidence Audit
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>Factual Correctness: <span className="font-mono text-foreground">{content.audit?.factualCorrectness}%</span></div>
              <div>Curriculum Align: <span className="font-mono text-foreground">{content.audit?.curriculumAlignment}%</span></div>
              <div>Safety Check: <span className="font-mono text-foreground">{content.audit?.biasSafety}%</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
