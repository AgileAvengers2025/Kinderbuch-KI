export default function TextBox({ variant = "adventure", children }) {
  const variantStyles = {
    adventure: "bg-gradient-to-bl from-[#ed443a] to-[#fca43c]",
    curiosity: "bg-gradient-to-br from-[#a4eaef] to-[#9c8cfa]",
    calm: "bg-gradient-to-t from-[#dcc8e9] to-[#f8ceee]",
    peace: "bg-[linear-gradient(190deg,#f7c898_15.21%,#def0f5_83.3%)]",
  };

  return (
    <div
      className="p-[3px] rounded-2xl mb-4 my-16 w-full max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto"
      style={{ background: `var(--${variant})` }}
    >
      <div
        className={`w-full h-44 md:h-64 lg:h-96 overflow-auto rounded-2xl p-4 md:p-6 lg:p-8
          bg-[rgba(255,255,255,0.92)] 
          shadow-[inset_0px_4px_20px_0px_rgba(0,10,120,0.15)]
          backdrop-blur-md
          text-base md:text-lg lg:text-xl
          leading-relaxed md:leading-relaxed lg:leading-relaxed
        `}
      >
        {children}
      </div>
    </div>
  );
}
