import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Linkedin, CheckCircle2, AlertCircle, Database, LogOut, User, LockKeyhole } from "lucide-react";

// Types mapping backend
interface PendingPost {
  id: string;
  project_id: string;
  content: string;
  image: string;
  status: string;
}

interface LinkedInStatus {
  connected: boolean;
  profile?: {
    name: string;
    email?: string;
    picture?: string;
  };
}

const API_BASE = "http://127.0.0.1:5000/api";

export default function AdminSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("adminToken"));
  const [password, setPassword] = useState("");
  const [loginPending, setLoginPending] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Queries
  const { data: linkedinStatus, refetch: refetchStatus } = useQuery<LinkedInStatus>({
    queryKey: ["linkedinStatus"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/linkedin/status`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch status");
      return res.json();
    },
  });

  const { data: posts, isLoading } = useQuery<PendingPost[]>({
    queryKey: ["pendingPosts"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/posts/pending`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const { data: projectsData } = useQuery<any[]>({
    queryKey: ["adminProjects"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/projects`, { headers: getHeaders() });
      return res.json();
    },
  });

  const { data: allPostsData } = useQuery<any[]>({
    queryKey: ["adminAllPosts"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/posts/all`, { headers: getHeaders() });
      return res.json();
    },
  });

  // Mutations
  const publishMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`${API_BASE}/posts/${postId}/publish`, { method: "POST", headers: getHeaders() });
      if (!res.ok) throw new Error("Publish failed");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Posted to LinkedIn!",
        description: "Your project post has been successfully published.",
      });
      queryClient.invalidateQueries({ queryKey: ["pendingPosts"] });
      queryClient.invalidateQueries({ queryKey: ["adminAllPosts"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error publishing",
        description: "There was a problem communicating with the LinkedIn API.",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/linkedin/disconnect`, { method: "POST", headers: getHeaders() });
      if (!res.ok) throw new Error("Failed to disconnect");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Disconnected",
        description: "Your LinkedIn account has been disconnected.",
      });
      refetchStatus();
    },
  });

  const draftPostMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const res = await fetch(`${API_BASE}/projects/${projectId}/draft`, { method: "POST", headers: getHeaders() });
      if (!res.ok) throw new Error("Draft failed");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Draft Created",
        description: "A new LinkedIn draft has been generated and is awaiting your approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["pendingPosts"] });
      queryClient.invalidateQueries({ queryKey: ["adminAllPosts"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error generating draft",
        description: "This project may already have a drafted post.",
      });
    },
  });

  const addProjectMutation = useMutation({
    mutationFn: async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      
      const payload = {
        title: fd.get("title") as string,
        description: fd.get("description") as string,
        tags: (fd.get("tags") as string).split(",").map((s) => s.trim()),
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80", // placeholder
        metric: fd.get("metric") as string,
        features: [fd.get("features") as string],
        impact: "Provides excellent ROI and efficiency.",
        workflow: [],
      };

      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Deploy failed");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Added",
        description: "Automated LinkedIn draft created and waiting for approval.",
      });
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["pendingPosts"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["adminProjects"] });
      queryClient.invalidateQueries({ queryKey: ["adminAllPosts"] });
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginPending(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Invalid password");
      const data = await res.json();
      localStorage.setItem("adminToken", data.access_token);
      setIsAuthenticated(true);
      toast({ title: "Admin Unlocked", description: "Welcome to the control panel." });
    } catch (err) {
      toast({ variant: "destructive", title: "Access Denied", description: "Incorrect administrative password." });
    } finally {
      setLoginPending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-32 flex flex-col items-center justify-center">
        <Card className="w-full bg-card/50 backdrop-blur border-border/50 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <LockKeyhole className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>Enter the administrative password to manage portfolio content and publish to LinkedIn.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Encryption Key..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginPending}>
                {loginPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Authenticate
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
          <Linkedin className="w-8 h-8 text-blue-500" />
          Social Poster Admin
        </h2>
        <div className="w-20 h-1.5 bg-blue-500 rounded-full mb-4" />
        <p className="text-muted-foreground text-lg">
          Manage your incoming projects and approve drafted posts directly for LinkedIn.
        </p>
      </div>

      {/* LinkedIn Connection Card */}
      <Card className="mb-10 bg-secondary/10 border-blue-500/20">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${linkedinStatus?.connected ? 'bg-green-500/20 text-green-500' : 'bg-secondary/50 text-muted-foreground'}`}>
              <Linkedin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-2">
                {linkedinStatus?.connected ? "LinkedIn Connected" : "LinkedIn Disconnected"}
                {linkedinStatus?.connected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </h3>
              <p className="text-sm text-muted-foreground">
                {linkedinStatus?.connected 
                  ? `Authenticated as ${linkedinStatus.profile?.name || "User"}` 
                  : "Connect your account to enable direct publishing to LinkedIn."}
              </p>
            </div>
          </div>
          
          <div>
            {linkedinStatus?.connected ? (
              <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10" onClick={() => disconnectMutation.mutate()} disabled={disconnectMutation.isPending}>
                {disconnectMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
                Disconnect
              </Button>
            ) : (
              <Button className="bg-[#0a66c2] hover:bg-[#004182]" onClick={() => window.location.href = `${API_BASE}/linkedin/authorize`}>
                <User className="w-4 h-4 mr-2" />
                Connect Account
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-8">
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"}>
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Mock Project</>}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 overflow-hidden"
          >
            <Card>
              <form onSubmit={(e) => addProjectMutation.mutate(e)}>
                <CardHeader>
                  <CardTitle>Add New Project</CardTitle>
                  <CardDescription>
                    Adding a project automatically drafts a highly-optimized LinkedIn post using the details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Title</label>
                    <input name="title" required className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="E.g., Automated Reporting Bot" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea name="description" required className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]" placeholder="Briefly explain what you built..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Metric/Result</label>
                      <input name="metric" required className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" placeholder="E.g., 90% Faster" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tags (comma separated)</label>
                      <input name="tags" required className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" placeholder="Python, Data Engineering" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Key Feature Overview</label>
                    <input name="features" required className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" placeholder="Built a robust REST API backend..." />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={addProjectMutation.isPending}>
                    {addProjectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Project & Draft Post
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          Pending Approvals
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : posts?.length === 0 ? (
          <Card className="bg-secondary/20 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 text-green-500/50 mb-4" />
              <p>You're all caught up! No drafts awaiting approval.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {posts?.map((post) => (
              <Card key={post.id} className="border-blue-500/20 overflow-hidden">
                <div className="bg-blue-500/10 px-6 py-3 border-b border-border/50 flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-500 uppercase tracking-widest flex items-center gap-2">
                    <Linkedin className="w-4 h-4" /> Ready for LinkedIn
                  </span>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    Awaiting Approval
                  </Badge>
                </div>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-5">
                    <div className="md:col-span-3 p-6">
                      <textarea
                        defaultValue={post.content}
                        className="w-full h-full min-h-[200px] bg-transparent border-0 resize-none font-mono text-sm leading-relax focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 border-l border-border/50 bg-secondary/5">
                      <img src={post.image} alt="Media" className="w-full h-48 object-cover" />
                      <div className="p-4 space-y-4">
                        <p className="text-xs text-muted-foreground">
                          This action will publish the post live to your connected LinkedIn profile using the Official API.
                        </p>
                        <Button
                          onClick={() => publishMutation.mutate(post.id)}
                          disabled={publishMutation.isPending || !linkedinStatus?.connected}
                          className="w-full bg-[#0a66c2] hover:bg-[#004182] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {publishMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                          )}
                          {linkedinStatus?.connected ? "Approve & Publish" : "Connect LinkedIn First"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-500" />
          Project Status Audit Reference
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          View all your portfolio projects and their corresponding LinkedIn post status.
        </p>

        <Card className="bg-secondary/10 border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Project Title</th>
                    <th className="px-6 py-4">LinkedIn Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {projectsData?.map((proj) => {
                    const linkedPost = allPostsData?.find((p) => p.project_id === proj.id);
                    return (
                      <tr key={proj.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 font-medium">{proj.title}</td>
                        <td className="px-6 py-4">
                          {linkedPost ? (
                            linkedPost.status === "published" ? (
                              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 shadow-none border-green-500/20">Published</Badge>
                            ) : (
                              <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 shadow-none border-yellow-500/20">Pending</Badge>
                            )
                          ) : (
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-muted-foreground mr-2">No Draft</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => draftPostMutation.mutate(proj.id)}
                                disabled={draftPostMutation.isPending && draftPostMutation.variables === proj.id}
                              >
                                {draftPostMutation.isPending && draftPostMutation.variables === proj.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Plus className="w-3 h-3 mr-1" />}
                                Generate Draft
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {(!projectsData || projectsData.length === 0) && (
                    <tr>
                      <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground">No projects found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
