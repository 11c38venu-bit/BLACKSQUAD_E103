import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGenerateContent } from "@/hooks/use-content";
import { api } from "@shared/routes";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Loader2, Plus, Trash2, Sparkles, BookCheck, ShieldAlert, BrainCircuit, GraduationCap } from "lucide-react";
import { useLocation } from "wouter";
import { ContentCard, ContentText } from "@/components/ContentCard";
import { ScoreGauge } from "@/components/ScoreGauge";

// Form schema derived from API input
const formSchema = api.content.generate.input;
type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [, setLocation] = useLocation();
  const generateMutation = useGenerateContent();
  const [activeTab, setActiveTab] = useState<"form" | "result">("form");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      topic: "",
      curriculum: "",
      learnerLevel: "Intermediate",
      learningObjectives: ["Understand the core concept"],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "learningObjectives" as any, // Cast to any because array of strings is tricky with RhF types sometimes
  });

  const onSubmit = (data: FormValues) => {
    generateMutation.mutate(data, {
      onSuccess: (data) => {
        // We could redirect to detail page, but let's show result inline for better UX on generation
        setLocation(`/content/${data.id}`);
      },
    });
  };

  const levels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight"
          >
            Create <span className="text-primary">Intelligent</span> Learning Content
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Generate syllabus-aligned educational materials with safety scores and instructor notes in seconds.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-xl shadow-indigo-500/5 border border-border overflow-hidden"
        >
          <div className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Subject Area</label>
                    <input
                      {...form.register("subject")}
                      placeholder="e.g. Physics, History, Computer Science"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                    {form.formState.errors.subject && (
                      <p className="text-xs text-destructive">{form.formState.errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Specific Topic</label>
                    <input
                      {...form.register("topic")}
                      placeholder="e.g. Newton's Third Law, The Cold War"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                    {form.formState.errors.topic && (
                      <p className="text-xs text-destructive">{form.formState.errors.topic.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Curriculum Standard</label>
                    <input
                      {...form.register("curriculum")}
                      placeholder="e.g. IB, AP, Common Core, University Level"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                    {form.formState.errors.curriculum && (
                      <p className="text-xs text-destructive">{form.formState.errors.curriculum.message}</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Learner Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {levels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => form.setValue("learnerLevel", level as any)}
                          className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                            form.watch("learnerLevel") === level
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-2 ring-primary ring-offset-2 ring-offset-card"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-foreground">Learning Objectives</label>
                      <button
                        type="button"
                        onClick={() => append("New objective")} // RhF handles string/object conversion usually, but for primitives simple strings work
                        className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 font-medium"
                      >
                        <Plus className="w-3 h-3" /> Add Objective
                      </button>
                    </div>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 group">
                          <div className="flex-1 relative">
                            <span className="absolute left-3 top-3 text-xs font-mono text-muted-foreground/50">
                              {index + 1}.
                            </span>
                            <input
                              {...form.register(`learningObjectives.${index}` as const)}
                              className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-background border border-input text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                          </div>
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.learningObjectives && (
                      <p className="text-xs text-destructive">At least one objective is required</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={generateMutation.isPending}
                  className="
                    group relative px-8 py-4 rounded-xl font-semibold text-lg
                    bg-gradient-to-r from-primary to-indigo-600
                    text-white shadow-xl shadow-primary/25
                    hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5
                    active:translate-y-0 active:shadow-md
                    disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                    transition-all duration-200 ease-out w-full md:w-auto
                  "
                >
                  <span className="flex items-center justify-center gap-2">
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        Generate Content
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
