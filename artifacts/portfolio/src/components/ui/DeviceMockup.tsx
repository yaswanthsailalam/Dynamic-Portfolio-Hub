import React from "react";

interface DeviceMockupProps {
  children: React.ReactNode;
  type?: "browser" | "terminal";
  className?: string;
}

export default function DeviceMockup({ children, type = "browser", className = "" }: DeviceMockupProps) {
  if (type === "terminal") {
    return (
      <div className={`rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl flex flex-col ${className}`}>
        <div className="h-8 bg-[#1a1a1a] flex items-center px-4 gap-1.5 border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-2 text-[10px] font-mono text-white/30 uppercase tracking-widest">
            Diagnostics terminal
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-black">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-2xl flex flex-col ${className}`}>
      <div className="h-10 bg-[#1a1a1a] flex items-center px-4 gap-4 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 max-w-[400px] h-6 bg-black/40 rounded-md border border-white/5 flex items-center px-3">
          <div className="w-2 h-2 rounded-full bg-primary/20 mr-2" />
          <div className="h-2 w-32 bg-white/5 rounded-full" />
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden bg-black/20">
        {children}
      </div>
    </div>
  );
}
