import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import GitHubActivity from "@/components/widgets/GitHubActivity";
import { useAutoTrack, useAnalytics } from "@/hooks/useAnalytics";

interface HomeSectionProps {
  navigateTo: (section: string) => void;
}

export default function HomeSection({ navigateTo }: HomeSectionProps) {
  useAutoTrack("Home");
  const { track } = useAnalytics();
  return (
    <>
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] w-full rounded-[2.5rem] overflow-hidden glass-panel border-0 shadow-2xl">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,198,255,0.2)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(168,85,247,0.15)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80" />
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary-foreground/90 text-sm font-semibold tracking-wide"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          Open to Data &amp; Automation Opportunities
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, delay: 0.1 }}
           className="space-y-4"
        >
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.1] text-white">
            <span className="text-gradient drop-shadow-sm">Transforming</span>
            <br />
            Manual Processes
          </h1>
          <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white/80">
            into <span className="text-white font-semibold">Intelligent Automation</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-[0.3em] text-primary/80"
        >
          <span>Excel Automation</span>
          <span className="h-1 w-1 rounded-full bg-primary/40" />
          <span>Data Analytics</span>
          <span className="h-1 w-1 rounded-full bg-primary/40" />
          <span>Python Workflows</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          I engineer robust data pipelines and automated environments to optimize business operations — turning manual bottlenecks into accurate, scalable, and audit-ready outputs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
        >
          <Button size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold text-white shadow-[0_0_20px_rgba(0,198,255,0.3)] hover:shadow-[0_0_30px_rgba(0,198,255,0.5)] transition-all group" onClick={() => navigateTo('Work')}>
            Explore My Work
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-lg font-bold text-white border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all" onClick={() => navigateTo('Contact')}>
            <Mail className="mr-2 w-5 h-5" />
            Let's Connect
          </Button>
        </motion.div>
      </div>
    </div>

    {/* GitHub Activity Feed */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-12 w-full max-w-2xl mx-auto"
    >
      <div className="glass-panel rounded-2xl border border-border/40 p-6" onClick={() => track("github_click", "home_feed")}>
        <GitHubActivity />
      </div>
    </motion.div>
    </>
  );
}

