/**
 * Password Strength Calculator
 * Calculates password strength based on various criteria
 */

export type PasswordStrength = "weak" | "medium" | "strong" | "very-strong";

export interface StrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
  entropy: number; // bits of entropy
}

/**
 * Calculate password entropy
 */
function calculateEntropy(password: string): number {
  let charsetSize = 0;
  let hasLowercase = false;
  let hasUppercase = false;
  let hasNumbers = false;
  let hasSymbols = false;

  for (const char of password) {
    if (char >= 'a' && char <= 'z') hasLowercase = true;
    else if (char >= 'A' && char <= 'Z') hasUppercase = true;
    else if (char >= '0' && char <= '9') hasNumbers = true;
    else hasSymbols = true;
  }

  if (hasLowercase) charsetSize += 26;
  if (hasUppercase) charsetSize += 26;
  if (hasNumbers) charsetSize += 10;
  if (hasSymbols) charsetSize += 32; // Common symbols

  if (charsetSize === 0) return 0;
  return Math.log2(charsetSize) * password.length;
}

/**
 * Check for common patterns
 */
function checkPatterns(password: string): number {
  let penalty = 0;

  // Repeated characters
  const repeated = /(.)\1{2,}/.test(password);
  if (repeated) penalty += 10;

  // Sequential characters (abc, 123, etc.)
  const sequential = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
  if (sequential) penalty += 15;

  // Common words
  const commonWords = /password|admin|12345|qwerty|letmein|welcome|monkey|dragon|master/i.test(password);
  if (commonWords) penalty += 20;

  return penalty;
}

/**
 * Calculate password strength
 */
export function calculatePasswordStrength(password: string): StrengthResult {
  if (!password || password.length === 0) {
    return {
      strength: "weak",
      score: 0,
      feedback: ["Enter a password to check strength"],
      entropy: 0,
    };
  }

  const feedback: string[] = [];
  let score = 0;

  // Length scoring
  if (password.length < 8) {
    feedback.push("Password is too short (minimum 8 characters)");
  } else if (password.length >= 8 && password.length < 10) {
    score += 15;
    feedback.push("Consider using a longer password (12+ characters)");
  } else if (password.length >= 10 && password.length < 12) {
    score += 20;
    // Don't show feedback for 10-11 chars as they're reasonably long
  } else if (password.length >= 12 && password.length < 16) {
    score += 25;
  } else if (password.length >= 16) {
    score += 30;
  }

  // Character variety scoring
  let varietyScore = 0;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

  if (hasLowercase) varietyScore += 10;
  if (hasUppercase) varietyScore += 10;
  if (hasNumbers) varietyScore += 10;
  if (hasSymbols) varietyScore += 15;

  score += varietyScore;

  if (!hasLowercase) feedback.push("Add lowercase letters");
  if (!hasUppercase) feedback.push("Add uppercase letters");
  if (!hasNumbers) feedback.push("Add numbers");
  if (!hasSymbols) feedback.push("Add special characters");

  // Entropy calculation
  const entropy = calculateEntropy(password);
  if (entropy < 40) {
    score += Math.max(0, entropy / 2);
  } else if (entropy < 60) {
    score += 20 + (entropy - 40) / 2;
  } else {
    score += 30;
  }

  // Pattern penalties
  const patternPenalty = checkPatterns(password);
  score = Math.max(0, score - patternPenalty);

  // Bonus for length
  if (password.length >= 20) score += 10;

  // Normalize score to 0-100
  score = Math.min(100, Math.max(0, score));

  // Determine strength level
  let strength: PasswordStrength;
  if (score < 30) {
    strength = "weak";
  } else if (score < 60) {
    strength = "medium";
  } else if (score < 80) {
    strength = "strong";
  } else {
    strength = "very-strong";
  }

  // Add positive feedback
  if (score >= 60) {
    feedback.unshift("Good password strength!");
  }
  if (entropy >= 60) {
    feedback.unshift("High entropy - excellent randomness");
  }
  if (password.length >= 16 && varietyScore >= 35) {
    feedback.unshift("Strong password with good variety");
  }

  return {
    strength,
    score,
    feedback: feedback.slice(0, 4), // Limit to 4 feedback items
    entropy: Math.round(entropy * 10) / 10,
  };
}

