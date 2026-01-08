import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CreateLesson from "@/pages/CreateLesson";
import LessonView from "@/pages/LessonView";
import LandingPage from "@/pages/LandingPage";
import Library from "@/pages/Library";
import Settings from "@/pages/Settings";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Protected Route Wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

// Public Route (redirects to dashboard if already logged in)
function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <PublicRoute component={LandingPage} />
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/create">
        <ProtectedRoute component={CreateLesson} />
      </Route>
      
      <Route path="/lesson/:id">
        <ProtectedRoute component={LessonView} />
      </Route>

      <Route path="/library">
        <ProtectedRoute component={Library} />
      </Route>

      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
