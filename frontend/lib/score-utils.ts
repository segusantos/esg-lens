/**
 * Utility functions for handling ESG scores and grades
 */

// Convert a numeric score to a letter grade
export function getLetterGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B-";
  if (score >= 60) return "C+";
  if (score >= 55) return "C";
  if (score >= 50) return "C-";
  if (score >= 45) return "D+";
  if (score >= 40) return "D";
  if (score >= 35) return "D-";
  return "F";
}

// Get text color class based on grade
export function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-green-600";
  if (grade.startsWith("B")) return "text-blue-600";
  if (grade.startsWith("C")) return "text-yellow-600";
  if (grade.startsWith("D")) return "text-orange-600";
  return "text-red-600";
}

// Get background color class based on grade
export function getGradeBackgroundColor(grade: string): string {
  if (grade.startsWith("A")) return "bg-green-100 text-green-800";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
  if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
  if (grade.startsWith("D")) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

// Get a description of the score level
export function getScoreDescription(score: number): string {
  if (score >= 85) return "Excelente";
  if (score >= 70) return "Bueno";
  if (score >= 55) return "Promedio";
  if (score >= 40) return "Bajo";
  return "Crítico";
}

