/**
 * Utility functions for handling ESG scores and grades
 */

// Convert a numeric score to a letter grade with equal ranges
export function getLetterGrade(score: number): string {
  // Ensure score is between 0-100 and handle edge cases
  const normalizedScore = Math.max(0, Math.min(100, score));
  
  // Divide the 0-100 range into 5 equal parts (20 points each)
  if (normalizedScore >= 80) return "A"; // 80-100
  if (normalizedScore >= 60) return "B"; // 60-79
  if (normalizedScore >= 40) return "C"; // 40-59
  if (normalizedScore >= 20) return "D"; // 20-39
  return "E";                            // 0-19
}

// Get text color class based on grade
export function getGradeColor(grade: string): string {
  if (grade === "A") return "text-green-600";
  if (grade === "B") return "text-blue-600";
  if (grade === "C") return "text-yellow-600";
  if (grade === "D") return "text-orange-600";
  return "text-red-600";
}

// Get background color class based on grade
export function getGradeBackgroundColor(grade: string): string {
  if (grade === "A") return "bg-green-100 text-green-800";
  if (grade === "B") return "bg-blue-100 text-blue-800";
  if (grade === "C") return "bg-yellow-100 text-yellow-800";
  if (grade === "D") return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

// Get a description of the score level
export function getScoreDescription(score: number): string {
  if (score >= 80) return "Excelente";
  if (score >= 60) return "Bueno";
  if (score >= 40) return "Promedio";
  if (score >= 20) return "Bajo";
  return "Crítico";
}

