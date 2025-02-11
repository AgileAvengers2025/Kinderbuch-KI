import Link from "next/link";

export default function Button({ variant = "primary", children, href, onClick, className = "", ...rest }) {
  const baseClasses = "w-64 px-8 py-4 rounded-[50px] text-3xl font-bold text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,0.5)]";
  let variantClasses = "";

  if (variant === "primary") {
    variantClasses = "";
  } else if (variant === "secondary") {
    variantClasses = "bg-green-500 text-white hover:bg-green-600 focus:ring-green-300";
  } else if (variant === "tertiary") {
    variantClasses = "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300";
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