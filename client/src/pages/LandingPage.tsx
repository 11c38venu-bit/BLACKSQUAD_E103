import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, BrainCircuit, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl">EduGenius</span>
          </div>
          <Button onClick={handleLogin}>Log In</Button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Education Engine
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-tight">
              Master any subject with <span className="text-primary">Intelligent</span> learning paths.
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Generate curriculum-aligned lessons, interactive visualizations, and adaptive quizzes instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/20" onClick={handleLogin}>
                Get Started for Free
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-secondary/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">Adaptive Intelligence</h3>
                <p className="text-muted-foreground">
                  Content that adapts to your specific curriculum standards (IB, AP, Common Core) and difficulty level.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">Interactive Visuals</h3>
                <p className="text-muted-foreground">
                  Don't just read about concepts—experience them with auto-generated interactive simulations.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 text-green-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">Fact-Checked & Safe</h3>
                <p className="text-muted-foreground">
                  Every lesson comes with an AI audit score for factual correctness and bias safety.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} EduGenius Intelligence Engine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
