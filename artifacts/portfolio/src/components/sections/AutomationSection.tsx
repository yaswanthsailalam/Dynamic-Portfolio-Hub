import { motion } from "framer-motion";
import { Bot, FileSpreadsheet, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const automationAreas = [
  {
    icon: <FileSpreadsheet className="w-10 h-10 text-emerald-400" />,
    title: "Excel & VBA Ecosystems",
    description: "I don't just write macros; I build robust applications within Excel. From multi-workbook consolidations to automated email generation, I turn static spreadsheets into dynamic software.",
    features: ["Custom Ribbon Menus", "ADO/SQL inside Excel", "Complex Data Cleaning"]
  },
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: "Python Data Pipelines",
    description: "When data exceeds Excel's limits, Python takes over. I build headless scripts that run on schedules, pulling data via APIs, scraping the web, and pushing processed data to dashboards.",
    features: ["API Integrations", "Web Scraping", "Scheduled Cron Jobs"]
  },
  {
    icon: <Cpu className="w-10 h-10 text-accent" />,
    title: "AI-Assisted Workflows",
    description: "The modern frontier of automation. Integrating Large Language Models to handle qualitative automation: reading emails, classifying intent, extracting entities from PDFs, and drafting replies.",
    features: ["LLM API Integration", "Document Parsing", "Sentiment Analysis"]
  }
];

interface AutomationSectionProps {
  navigateTo: (section: string) => void;
}

export default function AutomationSection({ navigateTo }: AutomationSectionProps) {
  return (
    <div className="w-full max-w-[1440px] mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">The Art of <span className="text-primary font-extrabold">Automation</span></h2>
        <div className="w-16 h-1 bg-primary/40 rounded-full mx-auto mb-6"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed font-normal">
          My core philosophy: If a digital task is done more than three times the exact same way, it needs to be automated. Here is how I approach different scales of automation.
        </p>
      </motion.div>

      <div className="relative mb-20 px-6">
        <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-2xl" />
        <div className="relative glass-panel rounded-3xl p-8 md:p-12 overflow-hidden border border-border/40 shadow-xl bg-secondary/20">
          <div 
            className="absolute top-0 right-0 w-1/2 h-full opacity-5 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/abstract-data.png)` }}
          />
          
          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            {automationAreas.map((area, idx) => (
              <motion.div 
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="flex flex-col"
              >
                <div className="bg-background/80 w-16 h-16 rounded-2xl flex items-center justify-center border border-border/40 shadow-md mb-6 group-hover:scale-110 transition-transform">
                  <div className="scale-75">{area.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">{area.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow font-normal">
                  {area.description}
                </p>
                <ul className="space-y-2 mt-auto">
                  {area.features.map(feature => (
                    <li key={feature} className="flex items-center text-xs font-semibold text-muted-foreground/80">
                      <ArrowRight className="w-3.5 h-3.5 text-primary mr-2 opacity-70" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center glass-panel max-w-3xl mx-auto p-10 rounded-3xl border border-border/40 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4 tracking-tight">Have a repetitive process dragging down your team?</h3>
          <p className="text-muted-foreground mb-8 font-normal">Let's map it out and see how much time we can win back.</p>
          <Button size="lg" className="px-10 h-14 rounded-2xl shadow-primary/20 shadow-xl font-bold text-lg hover:translate-y-[-2px] transition-all" onClick={() => navigateTo('Contact')}>
            Discuss a Workflow
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
