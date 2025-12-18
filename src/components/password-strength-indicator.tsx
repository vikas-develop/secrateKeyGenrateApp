"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { calculatePasswordStrength, type PasswordStrength } from "@/lib/password-strength";
import { Shield, AlertTriangle, CheckCircle2, Lock } from "lucide-react";
import { useMemo } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
  algorithm?: string;
}

export function PasswordStrengthIndicator({ password, algorithm }: PasswordStrengthIndicatorProps) {
  const strengthResult = useMemo(() => {
    // Calculate strength for any provided password/secret
    if (password && password.length > 0) {
      return calculatePasswordStrength(password);
    }
    return null;
  }, [password]);

  if (!strengthResult || !password) {
    return null;
  }

  const { strength, score, feedback, entropy } = strengthResult;

  const strengthConfig: Record<PasswordStrength, { color: string; label: string; icon: React.ReactNode; bgColor: string }> = {
    weak: {
      color: "text-red-600 dark:text-red-400",
      label: "Weak",
      icon: <AlertTriangle className="h-4 w-4" />,
      bgColor: "bg-red-500",
    },
    medium: {
      color: "text-yellow-600 dark:text-yellow-400",
      label: "Medium",
      icon: <AlertTriangle className="h-4 w-4" />,
      bgColor: "bg-yellow-500",
    },
    strong: {
      color: "text-green-600 dark:text-green-400",
      label: "Strong",
      icon: <CheckCircle2 className="h-4 w-4" />,
      bgColor: "bg-green-500",
    },
    "very-strong": {
      color: "text-emerald-600 dark:text-emerald-400",
      label: "Very Strong",
      icon: <Shield className="h-4 w-4" />,
      bgColor: "bg-emerald-500",
    },
  };

  const config = strengthConfig[strength];

  return (
    <div className="space-y-3 p-4 rounded-lg border-2 border-border/50 bg-card/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs sm:text-sm font-semibold">
            {algorithm === "password" ? "Password Strength" : "Secret Strength"}
          </span>
        </div>
        <Badge
          variant="outline"
          className={`${config.color} border-current flex items-center gap-1 text-xs`}
        >
          {config.icon}
          {config.label}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={score} className="h-2.5" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Score: {score}/100</span>
          <span>Entropy: {entropy} bits</span>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedback.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Feedback:</p>
          <ul className="space-y-1">
            {feedback.map((message, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className={`mt-0.5 ${strength === "weak" || strength === "medium" ? "text-yellow-500" : "text-green-500"}`}>
                  {strength === "weak" || strength === "medium" ? "•" : "✓"}
                </span>
                <span>{message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strength Indicator Bar */}
      <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-muted">
        <div
          className={`${config.bgColor} transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

