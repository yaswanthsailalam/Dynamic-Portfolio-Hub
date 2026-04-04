import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import GitHubActivity from "@/components/widgets/GitHubActivity";

interface HomeSectionProps {
  navigateTo: (section: string) => void;
}

export default function HomeSection({ navigateTo }: HomeSectionProps) {
  return (
    <>
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] w-full rounded-3xl overflow-hidden glass-panel border-0">
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-bg.png)` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium tracking-wide"
        >
          Open to Data &amp; Automation Opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold mb-5 tracking-tight text-balance leading-tight"
        >
          <span className="text-gradient">Transforming Manual Processes</span>
          <br />
          <span className="text-white">into Intelligent Automation</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-base md:text-lg text-primary/80 font-medium mb-5 tracking-wide"
        >
          Excel Automation&nbsp;&nbsp;|&nbsp;&nbsp;Data Analytics&nbsp;&nbsp;|&nbsp;&nbsp;AI-Assisted Workflows
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          I analyze operational data, manage reporting workflows, and optimize business processes using Excel, analytics tools, and automation techniques — improving accuracy, efficiency, and data-driven decision-making.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="w-full sm:w-auto group" onClick={() => navigateTo('Work')}>
            View My Work
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => navigateTo('Contact')}>
            <Mail className="mr-2 w-4 h-4" />
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
      <div className="glass-panel rounded-2xl border border-border/40 p-6">
        <GitHubActivity />
      </div>
    </motion.div>
    </>
  );
}

