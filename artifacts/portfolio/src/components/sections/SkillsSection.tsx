"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Heart, BarChart3, Wrench } from "lucide-react";

interface SubSkill {
  name: string;
  description: string;
}

interface SkillCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  borderColor: string;
  subSkills: SubSkill[];
}

const skillCategories: SkillCategory[] = [
  {
    id: "ai-data",
    title: "AI Data Operations & LLM Support",
    icon: <Brain className="w-6 h-6" />,
    color: "from-purple-400 to-purple-600",
    bgGradient: "hover:bg-purple-500/10",
    borderColor: "hover:border-purple-500/30",
    subSkills: [
      {
        name: "Data Validation",
        description: "Validated large-scale datasets for training LLM models, ensuring high data integrity by identifying and correcting inconsistencies. Reduced invalid training data through rigorous quality checks and validation protocols, directly improving model accuracy and reliability.",
      },
      {
        name: "Data Annotation",
        description: "Performed detailed data annotation and graphical image tagging to enhance training datasets. Tagged images, texts, and visual elements with precise labels to improve model accuracy and response quality in production environments.",
      },
      {
        name: "Prompt Engineering",
        description: "Developed and refined prompts to optimize LLM outputs for text, audio, and video generation tasks. Experimented with different prompt structures and phrasing to improve model understanding and generate more accurate, contextual responses.",
      },
      {
        name: "LLM Response Evaluation",
        description: "Evaluated and analyzed model responses against quality benchmarks and user requirements. Identified effectiveness gaps, consistency issues, and improvement areas to help refine model behavior and enhance overall performance.",
      },
      {
        name: "AI Model Training Support",
        description: "Supported AI model training processes through comprehensive data quality checks and clear annotation guidelines. Provided feedback on training data effectiveness and helped optimize datasets for better model convergence and performance.",
      },
    ],
  },
  {
    id: "operations",
    title: "Operations & Process Automation",
    icon: <Zap className="w-6 h-6" />,
    color: "from-blue-400 to-blue-600",
    bgGradient: "hover:bg-blue-500/10",
    borderColor: "hover:border-blue-500/30",
    subSkills: [
      {
        name: "Escalation Resolution",
        description: "Managed high-priority client escalations through structured resolution processes. Coordinated across teams to understand root causes, implement solutions, and ensure client satisfaction while maintaining service quality.",
      },
      {
        name: "Workflow Optimization",
        description: "Analyzed business processes to identify bottlenecks and inefficiencies. Automated manual workflows and streamlined operations, resulting in significant improvements to operational efficiency, reduced processing times, and better resource utilization.",
      },
      {
        name: "Process Mapping",
        description: "Created detailed process maps and flowcharts to visualize complex operations. Documented end-to-end workflows to standardize operations across teams, enabling better understanding and identification of improvement opportunities.",
      },
      {
        name: "SOP Documentation & Development",
        description: "Developed comprehensive Standard Operating Procedures to ensure consistent service delivery. Created clear, actionable documentation that enabled teams to execute processes uniformly and maintain quality standards.",
      },
      {
        name: "Quality Assurance",
        description: "Implemented quality checks and assurance protocols across operations. Established metrics to monitor service standards, conducted audits, and developed corrective actions to maintain high-quality service delivery.",
      },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare Domain Expertise",
    icon: <Heart className="w-6 h-6" />,
    color: "from-rose-400 to-rose-600",
    bgGradient: "hover:bg-rose-500/10",
    borderColor: "hover:border-rose-500/30",
    subSkills: [
      {
        name: "Cashless Authorisation",
        description: "Handled cashless healthcare authorization processes by coordinating between clients, providers, and insurers. Managed approval workflows to ensure seamless service delivery while maintaining compliance with regulatory requirements.",
      },
      {
        name: "Clinical Support Services",
        description: "Provided backend support for clinical operations and healthcare service delivery. Coordinated with clinical teams to ensure smooth patient care processes and resolved operational bottlenecks affecting healthcare delivery.",
      },
      {
        name: "HIS / EMR Systems",
        description: "Worked with Hospital Information Systems and Electronic Medical Records to manage patient data efficiently. Ensured proper data handling, security compliance, and system optimization for healthcare operations.",
      },
      {
        name: "Insurance Claims Processing",
        description: "Supported insurance claims processing activities by validating claim details and coordinating with TPA providers. Managed claim workflow optimization to reduce processing time and improve accuracy.",
      },
    ],
  },
  {
    id: "analytics",
    title: "Reporting & Analytics",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "from-emerald-400 to-emerald-600",
    bgGradient: "hover:bg-emerald-500/10",
    borderColor: "hover:border-emerald-500/30",
    subSkills: [
      {
        name: "MIS Reporting",
        description: "Generated comprehensive Management Information System reports to support data-driven decision making. Translated complex operational data into clear, actionable insights for management and stakeholders.",
      },
      {
        name: "KPI Monitoring",
        description: "Monitored key performance indicators across operations to track organizational performance against targets. Analyzed trends and variations to identify areas for improvement and optimization.",
      },
      {
        name: "Data-driven Insights",
        description: "Analyzed operational data to uncover patterns and trends. Provided actionable insights that informed process improvement initiatives and strategic decisions across the organization.",
      },
      {
        name: "Reporting & Dashboards",
        description: "Created and maintained operational reports and interactive dashboards for real-time monitoring. Designed visualizations that made complex data accessible and enabled quick decision-making.",
      },
    ],
  },
  {
    id: "technical",
    title: "Technical Tools & Software",
    icon: <Wrench className="w-6 h-6" />,
    color: "from-amber-400 to-amber-600",
    bgGradient: "hover:bg-amber-500/10",
    borderColor: "hover:border-amber-500/30",
    subSkills: [
      {
        name: "Excel & Google Sheets",
        description: "Leveraged advanced Excel and Google Sheets capabilities for data analysis and workflow automation. Created formulas, pivot tables, and automated workflows to streamline data processing and reporting.",
      },
      {
        name: "Power BI",
        description: "Developed Business Intelligence reports and interactive visualizations using Power BI. Created dashboards that connected data sources, provided real-time insights, and enabled stakeholders to make informed decisions.",
      },
      {
        name: "SQL",
        description: "Performed data querying, extraction, and analysis using SQL. Wrote complex queries to retrieve insights from databases and supported data-driven decision making across operations.",
      },
      {
        name: "Python",
        description: "Used Python for data processing, automation, and analysis tasks. Developed scripts to automate repetitive operations, process large datasets, and generate insights efficiently.",
      },
      {
        name: "Zoho Ticketing Systems",
        description: "Managed client tickets, escalations, and service requests using Zoho Ticketing platform. Optimized ticket workflows and ensured timely resolution while maintaining service quality.",
      },
    ],
  },
];

interface SkillCardProps {
  category: SkillCategory;
  index: number;
}

function SkillCard({ category, index }: SkillCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`relative rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 overflow-hidden cursor-pointer ${category.bgGradient} ${category.borderColor}`}
      style={{
        minHeight: isExpanded ? "auto" : "280px",
      }}
    >
      {/* Card Header - Always Visible */}
      <div className="p-6 flex flex-col items-start gap-4">
        {/* Icon and Title */}
        <div className="flex items-start gap-3 w-full">
          <div className={`text-transparent bg-gradient-to-r ${category.color} bg-clip-text flex-shrink-0 mt-0.5`}>
            {category.icon}
          </div>
          <h3 className="text-lg font-bold text-white leading-snug flex-1">
            {category.title}
          </h3>
        </div>
      </div>

      {/* Expandable Sub-Skills Section */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="border-t border-white/10 bg-gradient-to-b from-white/5 to-white/0"
        >
          <div className="p-6 space-y-4">
            {category.subSkills.map((skill, idx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="space-y-2"
              >
                {/* Skill Name */}
                <h4 className="text-base font-bold text-white">
                  {skill.name}
                </h4>
                {/* Skill Description */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function SkillsSection() {
  return (
    <section className="max-w-full py-16 md:py-24 px-4 md:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 max-w-7xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="h-1 w-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
            Expertise
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Skills & <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Expertise
          </span>
        </h2>
        <p className="text-slate-300 max-w-3xl text-base md:text-lg leading-relaxed">
          My skills developed through real-world experience across AI data operations, process automation, healthcare operations, analytics, and technical tools. Each skill is grounded in practical work and measurable outcomes.
        </p>
      </motion.div>

      {/* Skills Cards Vertical Stack */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {skillCategories.map((category, index) => (
            <SkillCard key={category.id} category={category} index={index} />
          ))}
        </motion.div>
      </div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 pt-8 border-t border-white/10 text-center max-w-4xl mx-auto"
      >
        <p className="text-sm text-slate-400">
          <span className="text-white font-medium">Hover</span> over any card to explore detailed skills and descriptions
        </p>
      </motion.div>
    </section>
  );
}
