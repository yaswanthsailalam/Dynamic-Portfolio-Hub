import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, ChevronRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API_BASE = "http://127.0.0.1:5000/api";

type ProjectDetailProps = {
  projectId: string;
  onBack: () => void;
};

export default function ProjectDetailSection({ projectId, onBack }: ProjectDetailProps) {
  const { data: projects, isLoading } = useQuery<any[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/projects`);
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="py-20 text-center animate-pulse">Loading case study...</div>;
  }

  const project = projects?.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-8 hover:bg-secondary/50 -ml-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Portfolio
      </Button>

      {/* Header Area */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags?.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {tag}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight text-white">
          {project.title}
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        {project.metric && (
          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl inline-block">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span className="font-semibold text-green-400 text-lg">Impact: {project.metric}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hero Image / Diagram */}
      {(project.workflowDiagram || project.image) && (
        <div className="mb-16 rounded-2xl overflow-hidden border border-border/50 shadow-2xl relative group">
          <img 
            src={project.workflowDiagram || project.image} 
            alt="Project Architecture" 
            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700" 
          />
        </div>
      )}

      {/* Deep Dive Content */}
      <div className="grid md:grid-cols-3 gap-12 mb-16">
        <div className="md:col-span-2 space-y-10">
          {/* Challenges */}
          {project.challenges && project.challenges.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold mb-6 text-white">Technical Challenges Overcome</h3>
              <ul className="space-y-4">
                {project.challenges.map((challenge: string, i: number) => (
                  <li key={i} className="flex gap-4 p-4 rounded-xl bg-secondary/20 border border-border/40">
                    <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{challenge}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Code Snippets rendering area (VBA / Python) */}
          {project.codeSnippets && project.codeSnippets.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Terminal className="w-6 h-6 text-primary" />
                Under the Hood: Implementation Code
              </h3>
              
              <div className="space-y-8">
                {project.codeSnippets.map((snippet: any, i: number) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-border/50 shadow-xl">
                    <div className="bg-[#1e1e1e]/90 px-4 py-2 border-b border-border/30 flex justify-between items-center text-xs text-muted-foreground font-mono">
                      <span>{snippet.filename || "code_snippet"}</span>
                      <span className="uppercase text-primary/70">{snippet.language}</span>
                    </div>
                    <pre className="p-6 overflow-x-auto bg-[#0d0d0d] text-sm font-mono leading-relaxed text-[#c9d1d9] selection:bg-primary/30">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Sidebar: Performance & Details */}
        <div className="space-y-8">
          <section className="bg-card/30 rounded-2xl p-6 border border-border/50 backdrop-blur">
            <h4 className="font-bold text-lg mb-4 text-white">Performance Metrics</h4>
            <ul className="space-y-3">
              {project.performanceMetrics && project.performanceMetrics.length > 0 ? (
                project.performanceMetrics.map((metric: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    {metric}
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">Detailed metrics optimized for efficiency.</li>
              )}
            </ul>
          </section>

          <section className="bg-card/30 rounded-2xl p-6 border border-border/50 backdrop-blur">
            <h4 className="font-bold text-lg mb-4 text-white">Key Features Engineered</h4>
            <ul className="space-y-3">
              {project.features?.map((feature: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
