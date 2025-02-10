import { tv } from 'tailwind-variants';
import 'clsx';

const toggleVariants = tv({
  base: "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground data-[state=on]:hover:bg-secondary/80",
      transparent: "bg-transparent hover:bg-/90",
      outline: "border-input hover:bg-accent hover:text-accent-foreground border bg-transparent"
    },
    size: {
      default: "h-10 px-3",
      sm: "h-9",
      lg: "h-11 px-5",
      icon: "size-10 p-2"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

export { toggleVariants as t };
//# sourceMappingURL=index5-BE4_qQtv.js.map
