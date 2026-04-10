import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";

const articles = [
  {
    title: "Why VBA Isn't Dead (And Why You Should Still Learn It)",
    excerpt: "Despite Python's dominance, VBA remains the undisputed king of local desktop automation in corporate environments locked behind strict IT firewalls.",
    category: "Opinion",
    date: "Oct 12, 2023",
    readTime: "5 min read"
  },
  {
    title: "Building Resilient Python Scrapers",
    excerpt: "Web scraping is easy. Keeping a scraper running for 6 months without breaking requires solid error handling, proxy management, and retry logic.",
    category: "Tutorial",
    date: "Nov 05, 2023",
    readTime: "8 min read"
  },
  {
    title: "The Prompt Engineering Guide for Data Analysts",
    excerpt: "How to structure prompts for LLMs to reliably extract JSON data, format messy text, and generate SQL queries accurately.",
    category: "Guide",
    date: "Jan 22, 2024",
    readTime: "12 min read"
  },
  {
    title: "Power Query: The Most Underrated Tool in Excel",
    excerpt: "Stop writing complex INDEX/MATCH arrays. Learn how Power Query can clean, merge, and load millions of rows without writing a single line of code.",
    category: "Tutorial",
    date: "Feb 18, 2024",
    readTime: "6 min read"
  }
];

export default function InsightsSection() {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Insights & <span className="text-primary">Writings</span></h2>
        <div className="w-20 h-1.5 bg-primary rounded-full mb-4"></div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Thoughts on automation strategy, technical deep-dives, and the future of data work.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((article, idx) => (
          <motion.div
            key={article.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full flex flex-col group cursor-pointer hover:bg-secondary/20 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">{article.category}</Badge>
                  <div className="flex items-center text-xs text-muted-foreground space-x-4">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {article.date}</span>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {article.readTime}</span>
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors flex justify-between items-start">
                  {article.title}
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0 ml-4 mt-1" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-base text-muted-foreground">
                  {article.excerpt}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <button className="text-muted-foreground hover:text-primary font-medium transition-colors border-b border-dashed border-transparent hover:border-primary pb-1">
          View all posts →
        </button>
      </div>
    </div>
  );
}
