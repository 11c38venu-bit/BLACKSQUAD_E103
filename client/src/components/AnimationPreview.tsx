import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Maximize2 } from "lucide-react";

interface AnimationPreviewProps {
  code: string;
}

export function AnimationPreview({ code }: AnimationPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  const reload = () => setKey(prev => prev + 1);

  // Safe rendering of the HTML/CSS/JS blob
  // In a production app, this should be a sandboxed iframe to prevent XSS
  const iframeSrc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: transparent; overflow: hidden; font-family: sans-serif; }
          /* Reset & Base Styles injected here if needed */
        </style>
      </head>
      <body>
        ${code}
      </body>
    </html>
  `;

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
      <div className="bg-muted/30 border-b border-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <div className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-2 text-xs font-mono text-muted-foreground">Interactive Module</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={reload}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative w-full aspect-video bg-white dark:bg-black/20">
        <iframe
          key={key}
          srcDoc={iframeSrc}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
          title="Interactive Animation"
        />
      </div>
      
      <div className="p-4 bg-muted/10 text-xs text-muted-foreground border-t border-border">
        Interact with the visualization above to explore the concept.
      </div>
    </div>
  );
}
