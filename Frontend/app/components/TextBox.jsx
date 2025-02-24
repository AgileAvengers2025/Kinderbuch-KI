export default function TextBox({ children, variant, className = "" }) {
  const variantStyles = {
    adventure: "bg-gradient-to-bl from-[#ed443a] to-[#fca43c]",
    curiosity: "bg-gradient-to-br from-[#a4eaef] to-[#9c8cfa]",
    calm: "bg-gradient-to-t from-[#dcc8e9] to-[#f8ceee]",
    peace: "bg-[linear-gradient(190deg,#f7c898_15.21%,#def0f5_83.3%)]",
  };

  const scrollbarColors = {
    adventure: "#fca43c",
    curiosity: "#9c8cfa",
    calm: "#dcc8e9",
    peace: "#f7c898",
  };

  return (
    <div
      className={`p-[3px] ${variantStyles[variant]} ${className} rounded-2xl mb-4 my-16 w-full max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto`}
      style={{ background: `var(--${variant})` }}
    >
      <div
        className={`w-full h-84 overflow-auto rounded-2xl p-4 md:p-6 lg:p-8
          bg-[rgba(255,255,255,0.92)] 
          shadow-[inset_0px_4px_20px_0px_rgba(0,10,120,0.15)]
          backdrop-blur-md
          text-base md:text-lg lg:text-xl
          leading-relaxed md:leading-relaxed lg:leading-relaxed
          [&::-webkit-scrollbar]:w-3
          [&::-webkit-scrollbar]:h-3
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:border-2
          [&::-webkit-scrollbar-thumb]:border-white
          [&::-webkit-scrollbar-thumb]:bg-opacity-70
          hover:[&::-webkit-scrollbar-thumb]:bg-opacity-100
          scrollbar
        `}
        style={{
          "--scrollbar-color": scrollbarColors[variant],
          scrollbarColor: `${scrollbarColors[variant]} transparent`,
          scrollbarWidth: "thin",
        }}
      >
        {children}
      </div>
    </div>
  );
}
