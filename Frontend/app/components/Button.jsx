import Link from "next/link";

export default function Button({ variant = "primary", children, href, onClick, className = "", ...rest }) {
  const baseClasses = "w-64 px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2";
  let variantClasses = "";

  if (variant === "primary") {
    variantClasses = "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300";
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