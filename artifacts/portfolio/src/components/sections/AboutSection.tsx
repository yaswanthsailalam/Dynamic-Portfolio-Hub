import { motion } from "framer-motion";
import { Terminal, Database, Lightbulb } from "lucide-react";
import profilePhoto from "@/assets/profile-yaswanth.jpeg";

export default function AboutSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">About <span className="text-primary">Me</span></h2>
        <div className="w-20 h-1.5 bg-primary rounded-full mb-8"></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <motion.div
          className="lg:col-span-5 relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Glow blobs */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/20 blur-3xl rounded-full -z-10" />
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/20 blur-3xl rounded-full -z-10" />

          {/* Gradient ring + flip card */}
          <div
            style={{
              background: "linear-gradient(135deg, #00C6FF 0%, #0072FF 60%, #7B5EA7 100%)",
              boxShadow: "0 0 40px rgba(0, 114, 255, 0.35)",
              borderRadius: "50%",
              padding: 3,
            }}
          >
            <div style={{ padding: 4, borderRadius: "50%", background: "hsl(var(--background))" }}>
              {/* Flip card container */}
              <div
                className="group"
                style={{ width: 260, height: 260, perspective: "1000px" }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transition: "transform 0.8s",
                    transformStyle: "preserve-3d",
                  }}
                  className="group-hover:[transform:rotateY(180deg)]"
                >
                  {/* Front — profile photo */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      overflow: "hidden",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <img
                      src={profilePhoto}
                      alt="Yaswanth Sai"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                      }}
                    />
                  </div>

                  {/* Back — name */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#ffffff",
                        letterSpacing: "-0.3px",
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}
                    >
                      Yaswanth Sai
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        marginTop: 8,
                        background: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Operations & Data Analytics
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="lg:col-span-7 space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={item} className="text-lg text-muted-foreground leading-relaxed">
            I am an <strong className="text-foreground">Operations and Data Analytics professional</strong> with experience in healthcare operations, MIS reporting, and workflow optimization. I work with operational data to track KPIs, prepare reports, and support decision-making through structured analysis.
          </motion.p>
          
          <motion.p variants={item} className="text-lg text-muted-foreground leading-relaxed">
            My focus is on improving reporting accuracy, optimizing processes, and turning operational data into meaningful insights using Excel and analytics tools.
          </motion.p>

          <motion.div variants={item} className="grid sm:grid-cols-2 gap-6 pt-6">
            <div className="glass-panel p-6 rounded-2xl border border-border/50">
              <Database className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-2 text-foreground">MIS Reporting &amp; Data Analysis</h3>
              <p className="text-sm text-muted-foreground">Working with operational data to track KPIs, validate datasets, and generate structured MIS reports that support business and operational decision-making.</p>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-border/50">
              <Terminal className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-bold text-xl mb-2 text-foreground">Operational Process Optimization</h3>
              <p className="text-sm text-muted-foreground">Improving operational workflows by organizing data, streamlining reporting processes, and ensuring accuracy across systems and cross-functional teams.</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="pt-6 border-t border-border/50">
            <h3 className="flex items-center font-bold text-xl mb-4">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Work Philosophy
            </h3>
            <blockquote className="italic text-muted-foreground border-l-4 border-primary pl-4 py-2">
              "Operational efficiency begins with accurate data, structured processes, and meaningful insights."
            </blockquote>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
