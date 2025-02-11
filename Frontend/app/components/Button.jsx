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
    "w-66 px-8 py-4 rounded-[1.7rem] text-xl font-bold shadow-[0_4px_0_0_rgba(0,0,0,1)]";
  let variantClasses = "";

  if (variant === "primary") {
    variantClasses =
      " bg-[image:var(--peace)] ring-2";
  } else if (variant === "secondary") {
    variantClasses =
      " bg-[image:var(--curiosity)] ring-2 ";
  } else if (variant === "tertiary") {
    variantClasses =
      "underline shadow-none ring-none ";
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
