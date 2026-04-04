import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Menu, X, Linkedin, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Section Components
import HomeSection from "./components/sections/HomeSection";
import AboutSection from "./components/sections/AboutSection";
import SkillsSection from "./components/sections/SkillsSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import AutomationSection from "./components/sections/AutomationSection";
import InsightsSection from "./components/sections/InsightsSection";
import ContactSection from "./components/sections/ContactSection";
import ResumeSection from "./components/sections/ResumeSection";
import AdminSection from "./components/sections/AdminSection";

const queryClient = new QueryClient();

const navItems = ["Home", "About", "Skills", "Work", "Insights", "Contact"];

function PortfolioLayout() {
  const [activeSection, setActiveSection] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const mainContent = document.getElementById("main-scroll-area");
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Home":    return <HomeSection navigateTo={handleNavClick} />;
      case "About":   return <AboutSection />;
      case "Skills":  return <SkillsSection />;
      case "Work":    return (
        <div className="space-y-16">
          <ProjectsSection />
          <AutomationSection />
        </div>
      );
      case "Insights": return <InsightsSection />;
      case "Contact":  return <ContactSection />;
      case "Admin":    return <AdminSection />;
      default:         return <HomeSection navigateTo={handleNavClick} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden font-sans">

      {/* ── Row 1: Top Header ── */}
      <header className="shrink-0 border-b border-border/40 glass-panel z-50">
        <div className="flex items-center justify-between px-6 md:px-10 h-16">

          {/* Left: Logo + Tagline */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer"
              style={{ gap: 10, filter: "none", transition: "filter 0.25s ease" }}
              onClick={() => handleNavClick("Home")}
              onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.18) drop-shadow(0 0 10px rgba(0,198,255,0.45))")}
              onMouseLeave={e => (e.currentTarget.style.filter = "none")}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="11" r="2.2" fill="white"/>
                  <circle cx="11" cy="4" r="2.2" fill="white"/>
                  <circle cx="18" cy="11" r="2.2" fill="white"/>
                  <circle cx="11" cy="18" r="2.2" fill="white"/>
                  <line x1="6.2" y1="11" x2="15.8" y2="11" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                  <line x1="11" y1="6.2" x2="11" y2="15.8" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                  <line x1="5.55" y1="8.3" x2="8.3" y2="5.55" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7"/>
                  <line x1="13.7" y1="5.55" x2="16.45" y2="8.3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7"/>
                  <line x1="16.45" y1="13.7" x2="13.7" y2="16.45" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7"/>
                  <line x1="8.3" y1="16.45" x2="5.55" y2="13.7" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.7"/>
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Poppins', 'Inter', 'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: 18,
                  letterSpacing: "-0.3px",
                  lineHeight: 1,
                }}
              >
                <span style={{ color: "#ffffff" }}>Insight</span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Flow
                </span>
              </span>
            </div>

            {/* Divider + Tagline (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-3">
              <span className="w-px h-5 bg-border/60" />
              <span className="text-xs text-muted-foreground tracking-wide font-medium">
                Automation &amp; Data Intelligence
              </span>
            </div>
          </div>

          {/* Right: Social icons + Status badge */}
          <div className="flex items-center gap-3">
            {/* Social icons (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-1">
              <a
                href="https://www.linkedin.com/in/yaswanth-sai-lalam-4969b236a"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:s77114925@gmail.com?subject=Portfolio%20Inquiry&body=Hello%20Yaswanth%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect."
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>

              <span className="w-px h-5 bg-border/60 mx-1" />
            </div>

            {/* Status badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Available for projects
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Row 2: Navigation Bar ── */}
      <nav className="hidden md:flex h-12 shrink-0 border-b border-border/40 bg-card/50 backdrop-blur items-center px-10 gap-8 z-40">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => handleNavClick(item)}
            className={`whitespace-nowrap text-sm font-medium transition-all duration-200 relative h-full flex items-center ${
              activeSection === item ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
            {activeSection === item && (
              <motion.div
                layoutId="activeNav"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border/40 bg-card z-40 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                    activeSection === item
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {item}
                </button>
              ))}
              {/* Mobile social row */}
              <div className="flex items-center gap-3 px-4 pt-3 border-t border-border/40 mt-2">
                <a href="https://www.linkedin.com/in/yaswanth-sai-lalam-4969b236a" target="_blank" rel="noopener noreferrer"
                   className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="mailto:s77114925@gmail.com?subject=Portfolio%20Inquiry&body=Hello%20Yaswanth%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect."
                   className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                  <Mail className="w-4 h-4" />
                </a>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Available
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content (Scrollable) ── */}
      <main id="main-scroll-area" className="flex-1 overflow-y-auto relative scroll-smooth bg-background">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 min-h-full flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="h-12 shrink-0 border-t border-border/40 bg-card/50 backdrop-blur z-40 flex items-center justify-between px-6 md:px-10 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <p>© {new Date().getFullYear()} InsightFlow. All rights reserved.</p>
          <button onClick={() => handleNavClick("Admin")} className="opacity-0 hover:opacity-100 transition-opacity ml-2 px-2 py-1 bg-secondary rounded">
            Admin
          </button>
        </div>
        <div className="flex gap-4">
          <button onClick={() => handleNavClick("Contact")} className="hover:text-primary transition-colors">Contact</button>
          <a href="https://www.linkedin.com/in/yaswanth-sai-lalam-4969b236a" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
        </div>
      </footer>

    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PortfolioLayout />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
