"use client";

/**
 * @author: @dorianbaffier
 * @description: Social Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 *
 * Star Gardens edit: wood-theme colours, brand icons passed in as components
 * (lucide-react 1.x dropped brand icons), links instead of share callbacks,
 * and tap-to-open for touch screens where hover does not exist.
 */
import { Link } from "lucide-react";
import { motion } from "motion/react";
import { useState, type ComponentType, type SVGProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ShareItem {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
}

interface SocialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  items: ShareItem[];
  onShare?: (index: number, item: ShareItem) => void;
  className?: string;
}

export default function SocialButton({
  label = "Share",
  items,
  onShare,
  className,
  ...props
}: SocialButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleShare = (index: number) => {
    setActiveIndex(index);
    onShare?.(index, items[index]);
    setTimeout(() => setActiveIndex(null), 300);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <motion.div
        animate={{
          opacity: isVisible ? 0 : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
      >
        <Button
          aria-expanded={isVisible}
          className={cn(
            "relative h-12 min-w-44 rounded-xl text-[15px] font-semibold",
            "bg-[#FBF3E4] hover:bg-[#FFF9EE]",
            "text-[#2A1C12]",
            "border border-[#2A1C12]/15",
            "transition-colors duration-200",
            className
          )}
          onClick={() => setIsVisible((v) => !v)}
          {...props}
        >
          <span className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            {label}
          </span>
        </Button>
      </motion.div>
      <motion.div
        animate={{
          width: isVisible ? "auto" : 0,
        }}
        className="absolute top-0 left-0 flex h-12 overflow-hidden rounded-xl"
        transition={{
          duration: 0.3,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {items.map((button, i) => (
          <motion.a
            animate={{
              opacity: isVisible ? 1 : 0,
              x: isVisible ? 0 : -20,
            }}
            aria-label={button.label}
            className={cn(
              "h-12",
              "w-12",
              "flex items-center justify-center",
              "bg-[#2A1C12]",
              "text-[#FBF3E4]",
              i === 0 && "rounded-l-xl",
              i === items.length - 1 && "rounded-r-xl",
              "border-[#FBF3E4]/10 border-r last:border-r-0",
              "hover:bg-[#4E3421]",
              "outline-none focus-visible:bg-[#4E3421]",
              "relative overflow-hidden",
              "transition-colors duration-200"
            )}
            href={button.href ?? "#"}
            key={`share-${button.label}`}
            onClick={() => handleShare(i)}
            tabIndex={isVisible ? 0 : -1}
            transition={{
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1],
              delay: isVisible ? i * 0.05 : 0,
            }}
          >
            <motion.div
              animate={{
                scale: activeIndex === i ? 0.85 : 1,
              }}
              className="relative z-10"
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <button.icon className="h-[18px] w-[18px]" />
            </motion.div>
            <motion.div
              animate={{
                opacity: activeIndex === i ? 0.15 : 0,
              }}
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            />
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
