import { useRoute, useLocation } from "wouter";
import { useContent } from "@/hooks/use-content";
import { Navigation } from "@/components/Navigation";
import { Loader2, ArrowLeft, BrainCircuit, CheckCircle2, AlertTriangle, BookOpen, UserCheck, Target, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { ContentCard, ContentText } from "@/components/ContentCard";
import { ScoreGauge } from "@/components/ScoreGauge";
import { format } from "date-fns";

export default function ContentDetail() {
  const [, params] = useRoute("/content/:id");
  const [, setLocation] = useLocation();
  const id = params ? parseInt(params.id) : 0;
  
  const { data: content, isLoading, error } = useContent(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Content Not Found</h2>
          <p className="text-muted-foreground mt-2 mb-8">The content you are looking for does not exist or has been deleted.</p>
          <button 
            onClick={() => setLocation("/")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Parse key takeaways if they come as string (DB safety), though schema says string[]
  const takeaways = Array.isArray(content.keyTakeaways) ? content.keyTakeaways : [];
  
  // Traceability is JSON in DB, let's treat it as record
  const traceability = content.objectiveTraceability as Record<string, string>;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => setLocation("/history")}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm"
            >
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wide">
                  {content.learnerLevel}
                </span>
                <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-bold uppercase tracking-wide">
                  {content.subject}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">
                  {content.curriculum}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                {content.topic}
              </h1>
              <p className="text-sm text-muted-foreground">
                Generated on {format(new Date(content.createdAt || new Date()), "MMMM d, yyyy")}
              </p>
            </motion.div>

            <ContentCard title="Topic Overview" icon={<BookOpen className="w-5 h-5"/>} delay={0.1}>
              <ContentText>{content.topicOverview}</ContentText>
            </ContentCard>

            <ContentCard title="Core Explanation" icon={<BrainCircuit className="w-5 h-5"/>} delay={0.2}>
              <ContentText>{content.coreExplanation}</ContentText>
            </ContentCard>

            <ContentCard title="Curriculum Example" icon={<Target className="w-5 h-5"/>} delay={0.3}>
              <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-6 dark:bg-amber-950/20 dark:border-amber-900/50">
                <ContentText className="text-amber-900 dark:text-amber-100">
                  {content.curriculumBasedExample}
                </ContentText>
              </div>
            </ContentCard>

            <ContentCard title="Practice Question" icon={<CheckCircle2 className="w-5 h-5"/>} delay={0.4}>
              <ContentText>{content.practiceQuestion}</ContentText>
            </ContentCard>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Scores */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 border border-border/50 shadow-md sticky top-24"
            >
              <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                Safety & Quality Scores
              </h3>
              
              <div className="grid grid-cols-2 gap-y-6">
                <ScoreGauge score={content.factualCorrectnessScore} label="Factual Accuracy" delay={0.3} />
                <ScoreGauge score={content.curriculumAlignmentScore} label="Curriculum Align." delay={0.4} />
                <ScoreGauge score={content.levelAppropriatenessScore} label="Level Appropriateness" delay={0.5} />
                <ScoreGauge score={content.biasSafetyScore} label="Bias Safety" delay={0.6} />
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                   <UserCheck className="w-4 h-4 text-primary" /> Instructor Review Notes
                </h4>
                <div className="bg-secondary/30 p-4 rounded-lg text-sm text-muted-foreground italic">
                  "{content.instructorReviewNotes}"
                </div>
              </div>
            </motion.div>

            {/* Key Takeaways */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-900/30 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900"
            >
              <h3 className="font-display font-bold text-lg mb-4 text-indigo-900 dark:text-indigo-100">Key Takeaways</h3>
              <ul className="space-y-3">
                {takeaways.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-indigo-800 dark:text-indigo-200">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300">
                      {idx + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Traceability */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.5 }}
               className="bg-card rounded-2xl p-6 border border-border/50"
            >
               <h3 className="font-display font-bold text-lg mb-4">Objective Traceability</h3>
               <div className="space-y-3">
                  {Object.entries(traceability).map(([obj, loc], idx) => (
                    <div key={idx} className="text-xs">
                      <p className="font-semibold text-foreground mb-1">Obj {idx + 1}: {obj}</p>
                      <p className="text-muted-foreground pl-3 border-l-2 border-primary/20">Covered in: {loc}</p>
                    </div>
                  ))}
               </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
