import { Link, useLocation } from "wouter";
import { BookOpen, PlusCircle, LayoutDashboard, LogOut, GraduationCap, Settings, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location === path;
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: PlusCircle, label: "Create Lesson", href: "/create" },
    { icon: BookOpen, label: "Library", href: "/library" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="bg-primary/10 p-2 rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight text-foreground">EduGenius</h1>
            <p className="text-xs text-muted-foreground font-medium">AI Intelligence Engine</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose}>
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
              isActive(item.href) 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border/50">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-3"
          onClick={() => {
            logout();
            onClose?.();
          }}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shadow-lg">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent onClose={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
