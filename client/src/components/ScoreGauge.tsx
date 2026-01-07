import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label: string;
  delay?: number;
}

export function ScoreGauge({ score, label, delay = 0 }: ScoreGaugeProps) {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 90) return "text-emerald-500 stroke-emerald-500 bg-emerald-500/10";
    if (s >= 70) return "text-amber-500 stroke-amber-500 bg-amber-500/10";
    return "text-rose-500 stroke-rose-500 bg-rose-500/10";
  };

  const colorClass = getColor(score);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, delay, ease: "easeOut" }}
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={colorClass}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${colorClass.split(" ")[0]}`}>{score}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground text-center max-w-[100px] leading-tight">
        {label}
      </span>
    </div>
  );
}
