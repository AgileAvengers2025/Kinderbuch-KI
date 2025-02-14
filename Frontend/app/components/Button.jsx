import Link from "next/link";

export default function Button({
  variant = "primary",
  children,
  href,
  onClick,
  className = "",
  ...rest
}) {
  const baseClasses =
    "px-4 py-2 rounded-[1.7rem] text-xl shadow-[0_4px_0_0_rgba(0,0,0,1)]";
  let variantClasses = "";

  if (variant === "primary") {
    variantClasses =
      "bg-[image:var(--peace)] ring-2 hover:filter hover:saturate-250 active:filter active:saturate-250 " +
      "transition ease-in-out duration-250 hover-glitter active:scale-95";
  } else if (variant === "secondary") {
    variantClasses =
      "bg-[image:var(--curiosity)] ring-2 hover:filter hover:saturate-250 active:filter active:saturate-250 " +
      "transition ease-in-out duration-250 hover-glitter active:scale-95";
  } else if (variant === "tertiary") {
    variantClasses =
      "underline shadow-none ring-none " +
      "hover:bg-gradient-to-r hover:from-violet-600 hover:via-pink-500 hover:to-violet-600 " +
      "active:bg-gradient-to-r active:from-violet-600 active:via-pink-500 active:to-violet-600 " +
      "hover:text-white active:text-white hover:no-underline active:no-underline " +
      "hover:scale-105 active:scale-95 " +
      "hover:shadow-lg hover:shadow-pink-500/25 active:shadow-lg active:shadow-pink-500/25 " +
      "transition-all duration-300 ease-out hover-sparkle";
  } else if (variant === "quaternary") {
    variantClasses =
      "bg-[image:var(--calm)] ring-2 hover:filter hover:saturate-300 active:filter active:saturate-250 " +
      "transition ease-in-out duration-250 hover-glitter active:scale-95";
  }

  const classes = `${baseClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <Link href={href}>
        <button className={classes} onClick={onClick} {...rest}>
          {children}
        </button>
      </Link>
    );
  }
  return (
    <button className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
