import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Briefcase, GraduationCap, Award } from "lucide-react";
import { useAutoTrack, useAnalytics } from "@/hooks/useAnalytics";

const experience = [
  {
    title: "MIS Executive",
    company: "Prodify Innovatives",
    period: "February 2026 - Present",
    description:
      "Managing comprehensive hospital data, tracking operational KPIs, and delivering analytical insights through MIS reporting to support Finance and process improvement.",
    achievements: [
      "Prepared daily, weekly, and monthly MIS reports for management and department heads.",
      "Monitored KPIs including occupancy rates, revenue, patient footfall, doctor performance, and service utilisation.",
      "Managed HIS/EMR systems, MIS dashboards, and hospital databases for operational efficiency.",
      "Automated and optimized reporting processes using Excel and Business Intelligence tools.",
      "Coordinated with clinical, administrative, HR, Finance, and wellness teams to collect and validate data.",
      "Supported internal and external audits, compliance requirements, and management review meetings.",
    ],
  },
  {
    title: "Healthcare Operations Executive",
    company: "ekincare",
    period: "January 2025 - February 2026",
    description:
      "Orchestrated end-to-end healthcare service delivery, handling insurance operations and managing claims adjudication for corporate clients and provider networks.",
    achievements: [
      "Managed appointment coordination and healthcare service delivery for corporate clients and provider networks.",
      "Processed customer queries related to prescriptions, laboratory tests, consultations, and order fulfilment.",
      "Handled insurance operations including claims adjudication, cashless approval processing, and authorization workflows.",
      "Coordinated with hospitals, TPAs, and internal stakeholders to expedite cashless authorizations.",
      "Applied structured escalation frameworks to resolve service disruptions and claim-related issues efficiently.",
      "Improved backend operational efficiency through report generation, systems updates, and TAT monitoring.",
    ],
  },
  {
    title: "Analyst",
    company: "Teleperformance",
    period: "September 2023 - November 2024",
    description:
      "Validated large-scale datasets for accuracy, reliability, and suitability for AI model training applications. Contributed to AI tool development and performance optimization.",
    achievements: [
      "Validated datasets against compliance standards and quality guidelines to ensure model readiness for AI systems.",
      "Developed structured documentation and SOPs for data verification processes.",
      "Conducted backend data testing to support AI tool development and performance optimization.",
      "Generated weekly and monthly performance reports with analytical insights for senior management.",
      "Maintained high data accuracy and compliance adherence while operating in a fast-paced environment.",
    ],
  },
];

const education = [
  {
    degree: "MBA - Operations & Data Science Management",
    institution: "NMIMS",
    period: "July 2025 - Present (Pursuing)",
    note: "Specialization in Operations and Data Science Management.",
  },
  {
    degree: "BTech - Computer Science Engineering",
    institution: "Anil Neerukonda Institute of Technology & Sciences (ANITS)",
    period: "July 2018 - May 2022",
    note: "",
  },
];

const certifications = [
  {
    name: "Data Analysis with Python",
    issuer: "ExcelR Academy",
  },
];

export default function ResumeSection() {
  useAutoTrack("Resume");
  const { track } = useAnalytics();
  return (
    <div className="max-w-4xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional <span className="text-primary">Journey</span>
          </h2>
          <div className="w-20 h-1.5 bg-primary rounded-full"></div>
        </div>
        <a
          href="http://127.0.0.1:5000/api/resume/download"
          download
          onClick={() => track("resume_download", "resume_section")}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
            boxShadow: "0 4px 14px rgba(0,114,255,0.3)",
          }}
        >
          <Download className="w-4 h-4" />
          Download Resume
        </a>
      </motion.div>

      <div className="space-y-12">
        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mr-4">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Experience</h3>
          </div>

          <div className="space-y-8 pl-6 border-l-2 border-border/50 ml-6">
            {experience.map((job, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute w-4 h-4 bg-background border-2 border-primary rounded-full -left-[41px] top-1.5 ring-4 ring-background" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                  <h4 className="text-xl font-bold text-foreground">{job.title}</h4>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                    {job.period}
                  </span>
                </div>
                <h5 className="text-lg text-muted-foreground mb-4">{job.company}</h5>
                <p className="text-muted-foreground mb-4 leading-relaxed">{job.description}</p>
                <ul className="space-y-2">
                  {job.achievements.map((ach, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start">
                      <span className="text-primary mr-2 mt-1">•</span>
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mr-4">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold">Education</h3>
          </div>

          <div className="pl-6 border-l-2 border-border/50 ml-6 space-y-8">
            {education.map((edu, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute w-4 h-4 bg-background border-2 border-accent rounded-full -left-[41px] top-1.5 ring-4 ring-background" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                  <h4 className="text-xl font-bold text-foreground">{edu.degree}</h4>
                  <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                    {edu.period}
                  </span>
                </div>
                <h5 className="text-lg text-muted-foreground">{edu.institution}</h5>
                {edu.note && <p className="text-muted-foreground mt-2">{edu.note}</p>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mr-4">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Certifications</h3>
          </div>

          <div className="pl-6 border-l-2 border-border/50 ml-6 space-y-6">
            {certifications.map((cert, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute w-4 h-4 bg-background border-2 border-primary rounded-full -left-[41px] top-1.5 ring-4 ring-background" />
                <h4 className="text-xl font-bold text-foreground">{cert.name}</h4>
                <h5 className="text-lg text-muted-foreground">{cert.issuer}</h5>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
