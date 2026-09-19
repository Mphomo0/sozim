import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Marketing/site-wide primary call-to-action — the canonical look for
        // the main action on hero sections and CTA bands. Use with size="cta".
        cta: "bg-linear-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white border-0 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-1",
        // Secondary CTA meant for translucent placement over a dark/photo
        // background (e.g. next to a "cta" button in a hero). Use with size="cta".
        "cta-outline":
          "bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 hover:-translate-y-1",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 max-sm:w-full",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 max-sm:w-full",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 max-sm:w-full",
        // Pairs with variant="cta" / "cta-outline" (or a one-off color override
        // for a CTA that must sit on a colored background) — the shared
        // geometry for every marketing CTA button: large, pill-shaped, and
        // with the slower lift transition CTAs use instead of the default.
        cta: "h-14 px-8 rounded-full text-lg transition-all duration-300 has-[>svg]:px-6 max-sm:w-full",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
