import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ContentCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  delay?: number;
}

export function ContentCard({ title, children, className, icon, delay = 0 }: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(
        "bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden",
        "hover:shadow-md transition-shadow duration-300",
        className
      )}
    >
      <div className="px-6 py-4 border-b border-border/50 bg-secondary/20 flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <h3 className="font-display font-semibold text-lg text-foreground">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
}

export function ContentText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("prose prose-slate max-w-none text-muted-foreground leading-relaxed", className)}>
      {children}
    </div>
  );
}
