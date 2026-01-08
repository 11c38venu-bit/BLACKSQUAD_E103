import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useGenerateLesson } from "@/hooks/use-lessons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateLessonSchema, type GenerateLessonRequest } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, BookOpen, BrainCircuit } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateLesson() {
  const { mutate: generate, isPending } = useGenerateLesson();
  const [loadingStep, setLoadingStep] = useState(0);

  const form = useForm<GenerateLessonRequest>({
    resolver: zodResolver(generateLessonSchema),
    defaultValues: {
      subject: "",
      topic: "",
      curriculum: "",
      level: "Intermediate",
      objectives: ["", "", ""],
      additionalContext: "",
    },
  });

  const onSubmit = (data: GenerateLessonRequest) => {
    // Start fake loading progress for UX
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2000);
    
    generate(data, {
      onSettled: () => clearInterval(interval),
    });
  };

  const loadingMessages = [
    "Analyzing curriculum requirements...",
    "Synthesizing core concepts...",
    "Generating interactive visualizations...",
    "Validating factual accuracy...",
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
              Create New Lesson
            </h1>
            <p className="text-muted-foreground text-lg">
              Define your topic and let our AI engine generate a comprehensive learning module.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isPending ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  <div className="bg-card border border-primary/20 p-8 rounded-full shadow-2xl relative z-10">
                    <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mt-8 mb-2 font-display">
                  Generating Intelligence
                </h2>
                <p className="text-muted-foreground mb-8 text-lg animate-pulse">
                  {loadingMessages[loadingStep]}
                </p>
                
                <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-8"
              >
                <Card className="border-border/60 shadow-lg">
                  <CardContent className="p-8 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject Area</Label>
                        <Input 
                          id="subject" 
                          placeholder="e.g. Physics, History, Math" 
                          {...form.register("subject")}
                          className="h-12 bg-secondary/30"
                        />
                        {form.formState.errors.subject && (
                          <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="curriculum">Curriculum Standard</Label>
                        <Input 
                          id="curriculum" 
                          placeholder="e.g. IB, AP, Common Core" 
                          {...form.register("curriculum")}
                          className="h-12 bg-secondary/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">Specific Topic</Label>
                      <Input 
                        id="topic" 
                        placeholder="e.g. Quantum Entanglement, The French Revolution" 
                        {...form.register("topic")}
                        className="h-12 text-lg font-medium bg-secondary/30"
                      />
                      {form.formState.errors.topic && (
                        <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level">Difficulty Level</Label>
                      <Select 
                        onValueChange={(val) => form.setValue("level", val)}
                        defaultValue={form.getValues("level")}
                      >
                        <SelectTrigger className="h-12 bg-secondary/30">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Learning Objectives (Min 3)</Label>
                        <span className="text-xs text-muted-foreground">Key takeaways for the student</span>
                      </div>
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0 mt-2">
                            {i + 1}
                          </div>
                          <Input 
                            placeholder={`Objective ${i + 1}`}
                            {...form.register(`objectives.${i}` as const)}
                            className="flex-1 bg-secondary/30"
                          />
                        </div>
                      ))}
                      {form.formState.errors.objectives && (
                        <p className="text-sm text-destructive">{form.formState.errors.objectives.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="context">Additional Context / Source Material</Label>
                      <Textarea 
                        id="context"
                        placeholder="Paste any specific content, PDF text, or notes you want included..."
                        {...form.register("additionalContext")}
                        className="min-h-[120px] bg-secondary/30 resize-none"
                      />
                    </div>

                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="ghost" size="lg" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="min-w-[200px] shadow-xl shadow-primary/20 text-lg h-14"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Lesson
                      </>
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
