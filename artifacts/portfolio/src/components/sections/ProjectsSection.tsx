import { useState } from "react";
import demoVideoUrl from "@/assets/automated-data-processing-demo.mp4";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink, X, Database, Download, Cpu, BarChart2,
  ClipboardList, ShieldCheck, Zap, FileCheck,
  Layers, Filter, PieChart, TrendingUp,
  HardDrive, Terminal, CheckCircle2, Package,
  ArrowRight, ArrowLeft, Loader2, Calendar, User, Layout, Briefcase
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAutoTrack, useAnalytics } from "@/hooks/useAnalytics";

/* ─── Types ─────────────────────────────────────────────── */
interface WorkflowStep {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Project {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  metric: string;
  features: string[];
  impact: string;
  workflow: WorkflowStep[];
  challenges?: string[];
  performanceMetrics?: string[];
  videoSrc?: string;
  gallery?: string[];
  codeSnippets?: { filename: string; language: string; code: string }[];
}

// Fetched dynamically from Backend

const getIconComponent = (iconName: string) => {
  const icons: any = { Database, Download, Cpu, BarChart2, ClipboardList, ShieldCheck, Zap, FileCheck, Layers, Filter, PieChart, TrendingUp, HardDrive, Terminal, CheckCircle2, Package };
  return icons[iconName] || CheckCircle2;
};

// Static fallbacks for when the backend is not connected
const FALLBACK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Enterprise Sales & Operations Reconciliation System",
    description: "Designed a fully automated, one-click VBA application to consolidate internal operational records with daily sales transaction data. The solution replaces a highly manual, error-prone daily task with a robust, scalable macro that cleans, filters, and matches multiple data sources in seconds.",
    tags: ["Excel VBA", "Data Pipeline", "Process Automation"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    metric: "95%+ Processing Time Reduction",
    features: [
      "Automated ingestion from shared network folders without manual intervention",
      "Dynamically cleans datasets and filters non-essential operational parameters",
      "Robust identity matching logic mapped against validated source points",
      "One-click generation of standardized, audit-ready financial and operational reports"
    ],
    impact: "Reduced processing time by over 95%, completely eliminating manual copy-paste errors and filtering inconsistencies. This optimization freed the operations team to focus on higher-value data analysis.",
    challenges: [
      "Developing extremely fast dictionary-based cross-referencing without relying on slow VLOOKUP functions",
      "Handling heavily inconsistent raw data structures across varying monthly formats",
      "Ensuring application stability while directly manipulating thousands of spreadsheet rows"
    ],
    performanceMetrics: [
      "Processing Rate: ~16,000 rows reconciled in 10-15 seconds",
      "Lead Time Optimization: Reduced daily manual parsing from 60 mins to zero"
    ],
    workflow: [
      { icon: HardDrive, title: "Data Ingestion", description: "Automatically reads and imports multiple source files from shared directories." },
      { icon: Filter, title: "Intelligent Cleaning", description: "Strips out empty records and dynamically filters non-essential data columns." },
      { icon: Zap, title: "Data Reconciliation", description: "Processes structured matching logic to reliably cross-reference operational IDs with corresponding sales." },
      { icon: FileCheck, title: "Final Reporting", description: "Outputs a clean, standardized, and audit-ready dataset for stakeholders." }
    ]
  },
  {
    id: "proj-2",
    title: "Automated Medical Diagnostic Data & Payment Audits",
    description: "I built a completely automated, end-to-end Python desktop application that leverages custom scraping logic and API integration to programmatically extract data where no native download option existed—transforming unstructured web information into structured, automated reports and audits.",
    tags: ["Python", "Selenium", "Pandas", "Data Automation", "MIS Reporting"],
    image: "/projects/diagnostic-extractor/success.png",
    metric: "97% Workflow Time Reduction",
    features: [
      "Multi-portal Extraction: Support for all major diagnostic and branch portal networks",
      "Headless Authentication: Automated ASP.NET session capture engine",
      "Direct API Querying: High-speed programmatic retrieval from restricted portals",
      "Structured Audit Generation: MoM reconciliation of fulfillment vs invoicing",
      "Standalone Deployment: Distributed as .exe for administrative use"
    ],
    impact: "Reduced daily extraction time from 3.5 hours to < 5 minutes, completely eliminating manual transcription errors and accelerating vendor payment cycles via auto-generated audits.",
    challenges: [
      "Developing custom cookie-handling middleware for restricted diagnostic portals",
      "Implementing robust 4-stage validation rules for Blood Culture and Sensitivity tests",
      "Ensuring data integrity across heterogenous service statuses from different vendors"
    ],
    performanceMetrics: [
      "Workflow Efficiency: 97% reduction (3.5h down to <5m)",
      "Audit Accuracy: 100% data integrity with zero transcription errors",
      "Extracted Coverage: Comprehensive support for leading diagnostics vendor networks"
    ],
    workflow: [
      { icon: Database, title: "Data Extraction", description: "Headless automation pulls raw test records from primary diagnostics portals." },
      { icon: Layers, title: "Normalization", description: "Deduplicates and maps heterogenous service statuses into a unified format." },
      { icon: PieChart, title: "Daily Reporting", description: "Aggregates transactions into a standardized daily Excel MIS dashboard." },
      { icon: ShieldCheck, title: "Audit Generation", description: "Compares fulfillment vs invoices to automate Month-on-Month vendor audits." }
    ]
  }
];

/* ─── Workflow Step Component ────────────────────────────── */
function WorkflowDiagram({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="flex flex-col md:flex-row items-stretch gap-3">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <div key={step.title} className="flex flex-col md:flex-row items-center flex-1 min-w-0">
            {/* Step card */}
            <div className="flex-1 w-full bg-card border border-border/60 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-medium text-sm text-foreground leading-tight">{step.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
            {/* Arrow connector (not after last step) */}
            {i < steps.length - 1 && (
              <div className="shrink-0 flex items-center justify-center px-1 py-2 md:py-0">
                <ArrowRight className="w-4 h-4 text-primary/50 rotate-90 md:rotate-0" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Removed Gallery Component as requested

/* ─── Project Detail View ───────────────────────────────── */
function ProjectDetailView({ project }: { project: Project }) {
  return (
    <motion.div
      className="w-full bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Narrative Case Study Body */}
      <div className="w-full max-w-7xl mx-auto py-12 md:py-16 px-8 md:px-12 lg:px-20 space-y-20">
        {/* Executive Summary */}
        <header className="space-y-10">
            <div className="space-y-4">
             <div className="text-primary font-semibold uppercase tracking-[0.2em] text-[10px] opacity-70">Operations & Management Case Study</div>
             <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-tight">{project.title}</h1>
           </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border/40 bg-muted/5">
             <div className="space-y-1">
               <p className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest">Technicals</p>
               <p className="text-sm font-medium text-foreground/80">{project.tags.slice(0, 2).join(", ")}</p>
             </div>
             <div className="space-y-1">
               <p className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest">Status</p>
               <p className="text-sm font-medium text-foreground/80">Delivered</p>
             </div>
             <div className="space-y-1">
               <p className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest">Reporting</p>
               <p className="text-sm font-medium text-foreground/80">MIS & Data Ops</p>
             </div>
             <div className="space-y-1">
               <p className="text-[10px] font-semibold uppercase text-muted-foreground tracking-widest">Key KPI</p>
               <p className="text-sm font-semibold text-primary">{project.metric}</p>
             </div>
           </div>
        </header>

        {/* Narrative Content */}
        <div className="space-y-20">
          <section className="space-y-8">
             <div className="flex items-center gap-4">
               <h2 className="text-xl font-semibold text-foreground px-4 py-1 border-l-2 border-primary/40 leading-none">Strategic Overview</h2>
             </div>
             <div className="prose prose-neutral dark:prose-invert max-w-none">
               <p className="text-foreground/80 text-xl leading-relaxed font-normal">
                 {project.description}
               </p>
             </div>
          </section>

          <section className="space-y-8">
             <div className="flex items-center gap-4">
               <h2 className="text-xl font-semibold text-foreground px-4 py-1 border-l-2 border-primary/40 leading-none">Problem Statement</h2>
             </div>
             <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed font-normal">
               {project.impact}
             </div>
          </section>
        </div>

        {/* Technical Implementation */}
        <section className="space-y-12">
             <h2 className="text-xl font-semibold text-foreground px-4 py-1 border-l-2 border-primary/40 leading-none">Technical Implementation</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
               <div className="space-y-6">
                 <h3 className="text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-2 opacity-90">
                   <Layout className="w-4 h-4" /> Core Functionality
                 </h3>
                 <ul className="space-y-4">
                    {project.features.map(f => (
                      <li key={f} className="flex gap-4 text-sm font-medium text-muted-foreground leading-relaxed group items-start">
                         <div className="shrink-0 w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mt-0.5 group-hover:bg-primary/20 transition-colors">
                           <CheckCircle2 className="w-3 h-3 text-primary" />
                         </div>
                         <span className="group-hover:text-foreground transition-all duration-200">{f}</span>
                      </li>
                    ))}
                 </ul>
               </div>

               <div className="space-y-6">
                 <h3 className="text-xs font-semibold uppercase tracking-widest text-accent flex items-center gap-2 opacity-90">
                   <BarChart2 className="w-4 h-4" /> Performance Audit
                 </h3>
                 <div className="grid gap-4">
                    {project.performanceMetrics && project.performanceMetrics.map((p, i) => {
                      const hasColon = p.includes(':');
                      const label = hasColon ? p.split(':')[0] : 'Metric achievement';
                      const value = hasColon ? p.split(':')[1] : p;
                      return (
                        <div key={i} className="p-4 border-l border-border/40 bg-muted/10 hover:bg-muted/20 transition-all duration-300">
                           <div className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 tracking-wider">{label}</div>
                           <div className="text-lg font-bold text-foreground">{value}</div>
                        </div>
                      );
                    })}
                 </div>
               </div>
            </div>
        </section>

        {/* Summary Impact */}
        <footer className="p-10 border border-border/40 bg-muted/10 rounded-3xl text-left space-y-6">
           <TrendingUp className="w-8 h-8 text-primary opacity-70" />
           <p className="text-xl md:text-2xl font-normal text-foreground/80 max-w-3xl leading-relaxed">
             This transformation directly optimized operational lead times by significantly reducing the manual reporting burden.
           </p>
           <div className="pt-4 flex justify-start gap-4">
              <Badge variant="outline" className="border-primary/20 text-primary font-semibold uppercase tracking-widest px-4 py-1 text-[10px]">Standardized MIS</Badge>
              <Badge variant="outline" className="border-accent/20 text-accent font-semibold uppercase tracking-widest px-4 py-1 text-[10px]">Audit Ready</Badge>
           </div>
        </footer>
      </div>
    </motion.div>
  );
}

/* ─── Main Section ───────────────────────────────────────── */
export default function ProjectsSection() {
  useAutoTrack("Work");
  const { track } = useAnalytics();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Use environment variable for API base if available
  // @ts-ignore
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000/api";

  const { data: projects = FALLBACK_PROJECTS, isLoading } = useQuery<any[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) return FALLBACK_PROJECTS; // Graceful fallback on network error
      const remoteData = await res.json();
      return remoteData.length > 0 ? remoteData : FALLBACK_PROJECTS;
    }
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto py-12 px-6">
      <AnimatePresence mode="wait">
        {selectedProject ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              className="mb-8 border-white/10 bg-white/5 hover:bg-white/10 hover:text-primary transition-all rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest"
              onClick={() => setSelectedProject(null)}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              Back to Projects
            </Button>
            <ProjectDetailView project={selectedProject} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-12 flex justify-between items-end">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
                  Operational Data &amp; <span className="text-primary font-bold">Automation Work</span>
                </h2>
                <div className="w-16 h-1 bg-primary/40 rounded-full mb-4" />
                <p className="text-muted-foreground max-w-2xl text-lg font-normal leading-relaxed opacity-90">
                  Practical automation and data workflow solutions built to improve operational efficiency and reporting.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-20 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground">No projects found. Use the Admin panel to add one.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, idx) => (
                  <div key={project.title}>
                    <Card className="h-full flex flex-col border border-border/40 bg-card hover:border-primary/40 transition-all group cursor-pointer shadow-sm hover:shadow-md" onClick={() => {
                        setSelectedProject(project);
                        track("project_view", project.id || project.title);
                      }}>
                      <CardHeader className="space-y-4 p-8">
                        <div className="flex justify-between items-start">
                          <div className="text-[10px] uppercase font-semibold tracking-[0.15em] text-muted-foreground group-hover:text-primary transition-colors">Audit & Analysis</div>
                          <Badge className="bg-primary/5 border-primary/20 text-primary text-[9px] font-semibold uppercase tracking-widest px-3 py-0.5">
                              {project.metric}
                           </Badge>
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground group-hover:translate-x-1 transition-transform inline-flex items-center gap-3 tracking-tight">
                          {project.title}
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-primary/70" />
                        </CardTitle>
                        <p className="text-muted-foreground text-sm line-clamp-3 font-normal leading-relaxed">
                          {project.description}
                        </p>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
