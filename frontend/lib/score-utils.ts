// Convert numerical score to letter grade
export function getLetterGrade(score: number): string {
  if (score >= 90) return "A"
  if (score >= 80) return "B"
  if (score >= 70) return "C"
  if (score >= 60) return "D"
  if (score >= 50) return "E"
  return "F"
}

// Get color class based on letter grade
export function getGradeColor(grade: string): string {
  switch (grade) {
    case "A":
      return "text-green-600"
    case "B":
      return "text-green-500"
    case "C":
      return "text-yellow-500"
    case "D":
      return "text-orange-500"
    case "E":
      return "text-red-400"
    case "F":
      return "text-red-600"
    default:
      return "text-gray-500"
  }
}

// Get background color class based on letter grade
export function getGradeBackgroundColor(grade: string): string {
  switch (grade) {
    case "A":
      return "bg-green-100 text-green-800 border-green-200"
    case "B":
      return "bg-green-50 text-green-700 border-green-100"
    case "C":
      return "bg-yellow-50 text-yellow-800 border-yellow-100"
    case "D":
      return "bg-orange-50 text-orange-800 border-orange-100"
    case "E":
      return "bg-red-50 text-red-700 border-red-100"
    case "F":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

