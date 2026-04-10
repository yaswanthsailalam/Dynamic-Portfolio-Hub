import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  GitCommitHorizontal, 
  GitBranch, 
  GitPullRequest, 
  Star, 
  GitFork, 
  CircleDot, 
  Github,
  ExternalLink 
} from "lucide-react";

const API_BASE = "http://127.0.0.1:5000/api";

interface GitHubEvent {
  type: string;
  repo: string;
  branch?: string;
  commits?: number;
  message?: string;
  action?: string;
  title?: string;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getEventIcon(type: string) {
  switch (type) {
    case "push":
      return <GitCommitHorizontal className="w-4 h-4" />;
    case "create_repo":
    case "create_branch":
      return <GitBranch className="w-4 h-4" />;
    case "pull_request":
      return <GitPullRequest className="w-4 h-4" />;
    case "star":
      return <Star className="w-4 h-4" />;
    case "fork":
      return <GitFork className="w-4 h-4" />;
    case "issue":
      return <CircleDot className="w-4 h-4" />;
    default:
      return <GitCommitHorizontal className="w-4 h-4" />;
  }
}

function getEventColor(type: string) {
  switch (type) {
    case "push":
      return "text-green-400 bg-green-500/15 border-green-500/20";
    case "create_repo":
    case "create_branch":
      return "text-purple-400 bg-purple-500/15 border-purple-500/20";
    case "pull_request":
      return "text-blue-400 bg-blue-500/15 border-blue-500/20";
    case "star":
      return "text-yellow-400 bg-yellow-500/15 border-yellow-500/20";
    case "fork":
      return "text-cyan-400 bg-cyan-500/15 border-cyan-500/20";
    case "issue":
      return "text-orange-400 bg-orange-500/15 border-orange-500/20";
    default:
      return "text-muted-foreground bg-secondary/50 border-border/50";
  }
}

function getEventDescription(event: GitHubEvent): string {
  const repoShort = event.repo.split("/").pop() || event.repo;
  switch (event.type) {
    case "push":
      return `Pushed ${event.commits || 1} commit${(event.commits || 1) > 1 ? "s" : ""} to ${repoShort}/${event.branch || "main"}`;
    case "create_repo":
      return `Created new repository ${repoShort}`;
    case "create_branch":
      return `Created branch ${event.branch} in ${repoShort}`;
    case "pull_request":
      return `${event.action === "opened" ? "Opened" : event.action === "closed" ? "Merged" : event.action || "Updated"} PR in ${repoShort}`;
    case "star":
      return `Starred ${repoShort}`;
    case "fork":
      return `Forked ${repoShort}`;
    case "issue":
      return `${event.action === "opened" ? "Opened" : event.action || "Updated"} issue in ${repoShort}`;
    default:
      return `Activity in ${repoShort}`;
  }
}

export default function GitHubActivity() {
  const { data, isLoading, isError } = useQuery<{
    username: string;
    events: GitHubEvent[];
  }>({
    queryKey: ["githubActivity"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/github/activity?limit=8`);
      if (!res.ok) throw new Error("Failed to fetch GitHub activity");
      return res.json();
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <Github className="w-5 h-5 text-muted-foreground" />
          <div className="h-4 w-32 bg-secondary/50 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-secondary/20 rounded-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.events?.length) {
    return null; // Gracefully hide if no data
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#24292e]/80 border border-[#30363d]">
            <Github className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Live Coding Activity</h3>
            <p className="text-xs text-muted-foreground">@{data.username}</p>
          </div>
        </div>
        <a
          href={`https://github.com/${data.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          View Profile
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Timeline */}
      <div className="relative space-y-1">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border/40" />

        {data.events.map((event, i) => (
          <motion.div
            key={`${event.type}-${event.created_at}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="relative flex items-start gap-3 pl-0 py-1.5 group"
          >
            {/* Icon dot */}
            <div className={`relative z-10 w-[38px] h-[38px] rounded-lg flex items-center justify-center shrink-0 border ${getEventColor(event.type)} transition-all group-hover:scale-110 group-hover:shadow-lg`}>
              {getEventIcon(event.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm text-foreground/90 leading-snug">
                {getEventDescription(event)}
              </p>
              {event.message && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px] font-mono">
                  "{event.message}"
                </p>
              )}
              {event.title && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">
                  {event.title}
                </p>
              )}
            </div>

            {/* Timestamp */}
            <span className="text-[11px] text-muted-foreground/60 whitespace-nowrap pt-1.5 tabular-nums">
              {timeAgo(event.created_at)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
