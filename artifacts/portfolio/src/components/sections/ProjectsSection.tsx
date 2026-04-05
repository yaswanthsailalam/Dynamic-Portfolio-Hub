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
  ArrowRight, ArrowLeft, Loader2
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
  codeSnippets?: { filename: string; language: string; code: string }[];
}

// Fetched dynamically from Backend

const getIconComponent = (iconName: string) => {
  const icons: any = { Database, Download, Cpu, BarChart2, ClipboardList, ShieldCheck, Zap, FileCheck, Layers, Filter, PieChart, TrendingUp, HardDrive, Terminal, CheckCircle2, Package };
  return icons[iconName] || CheckCircle2;
};

/* ─── Workflow Step Component ────────────────────────────── */
function WorkflowDiagram({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="flex flex-col md:flex-row items-stretch gap-3">
      {steps.map((step, i) => {
        const Icon: any = typeof step.icon === "string" ? getIconComponent(step.icon) : step.icon;
        return (
          <div key={step.title} className="flex flex-col md:flex-row items-center flex-1 min-w-0">
            {/* Step card */}
            <div className="flex-1 w-full bg-card border border-border/60 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-semibold text-sm text-foreground leading-tight">{step.title}</p>
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

/* ─── Project Detail View ───────────────────────────────── */
function ProjectDetailView({ project }: { project: Project }) {
  return (
    <motion.div
      className="w-full bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Hero image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute bottom-6 left-6 md:left-8">
          <Badge className="bg-background/80 backdrop-blur text-foreground border-border text-xs md:text-sm py-1.5 px-3">
            {project.metric}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-10 space-y-10">
        {/* Title + tags */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{project.title}</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-secondary/50 text-sm font-medium">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-lg leading-relaxed">{project.description}</p>

        {/* Key Features */}
        <div>
          <h4 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-primary inline-block" />
            Key Features
          </h4>
          <ul className="space-y-3">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-base text-muted-foreground max-w-3xl">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Workflow Overview */}
        <div>
          <h4 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-primary inline-block" />
            Workflow Overview
          </h4>
          <WorkflowDiagram steps={project.workflow} />
        </div>

        {/* Impact */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 max-w-4xl">
          <h4 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Impact
          </h4>
          <p className="text-base text-muted-foreground leading-relaxed">{project.impact}</p>
        </div>

        {/* Performance & Challenges */}
        {(project.challenges || project.performanceMetrics) && (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            {project.challenges && (
              <div className="bg-secondary/20 border border-border/50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
                  Technical Challenges Overcome
                </h4>
                <ul className="space-y-3">
                  {project.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0 mt-2" />
                      <span className="leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.performanceMetrics && (
              <div className="bg-secondary/20 border border-border/50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
                  Performance Outline
                </h4>
                <ul className="space-y-3">
                  {project.performanceMetrics.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Code Snippets rendering area (VBA / Python) */}
        {project.codeSnippets && project.codeSnippets.length > 0 && (
          <div className="max-w-5xl">
            <h4 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              Under the Hood: Implementation Code
            </h4>
            
            <div className="space-y-8">
              {project.codeSnippets.map((snippet, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-border/50 shadow-xl bg-[#0d0d0d]">
                  <div className="bg-[#1e1e1e] px-4 py-2 border-b border-border/30 flex justify-between items-center text-xs text-muted-foreground font-mono">
                    <span>{snippet.filename || "code_snippet"}</span>
                    <span className="uppercase text-primary/70">{snippet.language}</span>
                  </div>
                  <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-[#c9d1d9] selection:bg-primary/30">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Demonstration */}
        {project.videoSrc && (
          <div>
            <h4 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-primary inline-block" />
              Project Demonstration
            </h4>
            <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-3xl">
              This demonstration shows how automated scripts process large operational datasets,
              perform validation checks, and generate structured outputs for reporting and analysis.
            </p>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Demo Video
            </p>
            <video
              controls
              className="w-full rounded-2xl shadow-lg shadow-black/40 bg-black max-w-5xl"
            >
              <source src={project.videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Section ───────────────────────────────────────── */
export default function ProjectsSection() {
  useAutoTrack("Work");
  const { track } = useAnalytics();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const { data: projects = [], isLoading } = useQuery<any[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("http://127.0.0.1:5000/api/projects");
      if (!res.ok) throw new Error("Failed connecting to Backend DB");
      return res.json();
    }
  });

  return (
    <div className="max-w-6xl mx-auto py-12">
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
              variant="ghost"
              className="mb-6 hover:bg-transparent hover:text-primary transition-colors pl-0"
              onClick={() => setSelectedProject(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Operational Data &amp; <span className="text-primary">Automation Work</span>
                </h2>
                <div className="w-20 h-1.5 bg-primary rounded-full mb-4" />
                <p className="text-muted-foreground max-w-2xl text-lg">
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
                    <Card className="h-full flex flex-col overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors z-10" />
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 z-20">
                          <Badge className="bg-background/80 backdrop-blur text-foreground border-border">
                            {project.metric}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-secondary/50 text-xs font-medium">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>

                      <CardContent className="flex-grow">
                        <CardDescription className="text-base leading-relaxed">{project.description}</CardDescription>
                      </CardContent>

                      <CardFooter className="border-t border-border/50 pt-6 mt-auto">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setSelectedProject(project);
                            track("project_view", project.id || project.title);
                          }}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Case Study
                        </Button>
                      </CardFooter>
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
