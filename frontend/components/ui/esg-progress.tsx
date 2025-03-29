import type * as React from "react"
import { cn } from "@/lib/utils"

interface ESGProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  type?: "environmental" | "social" | "governance"
  showValue?: boolean
}

export function ESGProgress({
  className,
  value,
  max = 100,
  type = "environmental",
  showValue = false,
  ...props
}: ESGProgressProps) {
  const percentage = (value / max) * 100

  const getBackgroundColor = () => {
    switch (type) {
      case "environmental":
        return "bg-esg-environmental-light"
      case "social":
        return "bg-esg-social-light"
      case "governance":
        return "bg-esg-governance-light"
      default:
        return "bg-gray-100"
    }
  }

  const getIndicatorColor = () => {
    switch (type) {
      case "environmental":
        return "bg-esg-environmental"
      case "social":
        return "bg-esg-social"
      case "governance":
        return "bg-esg-governance"
      default:
        return "bg-primary"
    }
  }

  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full", getBackgroundColor(), className)} {...props}>
      <div
        className={cn("h-full w-full flex-1 transition-all", getIndicatorColor())}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
      {showValue && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">{value}%</span>
      )}
    </div>
  )
}

