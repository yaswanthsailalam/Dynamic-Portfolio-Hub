import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Linkedin, Send, Download, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

const WHATSAPP_NUMBER = "919121511764";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message is too short"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [location, setLocation] = useState<string>("Detecting location...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "";
          const country = data.address?.country || "";
          setLocation(city && country ? `${city}, ${country}` : country || "Location unavailable");
        } catch {
          setLocation("Location unavailable");
        }
      },
      () => setLocation("Location unavailable")
    );
  }, []);

  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { track } = useAnalytics();
  const [formOpened, setFormOpened] = useState(false);

  const handleFocus = () => {
    if (!formOpened) {
      track("contact_form_open", "contact_section");
      setFormOpened(true);
    }
  };

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (formData: ContactFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
      toast({ title: "Message Sent! ✉️", description: "Thank you for reaching out. I'll get back to you soon!" });
      form.reset();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong. Please try WhatsApp instead." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Get in <span className="text-primary">Touch</span>
        </h2>
        <div className="w-20 h-1.5 bg-primary rounded-full mx-auto mb-6" />
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Whether you have an automation project in mind or just want to talk data, I'm always open
          to discussing new opportunities.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* ── Left panel ── */}
        <motion.div
          className="lg:col-span-5 space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-panel p-8 rounded-3xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a
                      href="mailto:yaswanthsailalam02@gmail.com?subject=Portfolio%20Inquiry&body=Hello%20Yaswanth%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect."
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      yaswanthsailalam02@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mr-4 shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-lg font-medium flex items-center gap-2">
                      {location === "Detecting location..." ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          <span className="text-muted-foreground text-base">Detecting…</span>
                        </>
                      ) : (
                        location
                      )}
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mr-4 shrink-0">
                    <MessageCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-green-400 hover:text-green-300 transition-colors"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border/50 space-y-6">
              {/* Social icons */}
              <div>
                <h4 className="text-lg font-medium mb-4">Connect on Social</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://www.linkedin.com/in/yaswanth-sai-lalam-4969b236a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-green-600 hover:text-white transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <a
                    href="mailto:yaswanthsailalam02@gmail.com?subject=Portfolio%20Inquiry&body=Hello%20Yaswanth%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect."
                    className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Download Resume */}
              <div>
                <h4 className="text-lg font-medium mb-3">My Resume</h4>
                <a
                  href="http://127.0.0.1:5000/api/resume/download"
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
                    boxShadow: "0 4px 14px rgba(0,114,255,0.3)",
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Right panel — form ── */}
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-2">Send a Message</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Fill in the form and it will open WhatsApp with your message pre-filled — ready to send.
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Your Name</label>
                  <Input {...form.register("name")} placeholder="John Doe" onFocus={handleFocus} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <Input {...form.register("email")} placeholder="john@example.com" onFocus={handleFocus} />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Subject</label>
                <Input {...form.register("subject")} placeholder="Project Inquiry" onFocus={handleFocus} />
                {form.formState.errors.subject && (
                  <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <Textarea
                  {...form.register("message")}
                  placeholder="How can I help you?"
                  className="min-h-[150px]"
                  onFocus={handleFocus}
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                )}
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                  <h4 className="text-xl font-bold mb-2">Message Received!</h4>
                  <p className="text-muted-foreground mb-4">I'll get back to you within 24 hours.</p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
                </div>
              ) : (
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg gap-2"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {submitting ? "Sending..." : "Send Message"}
              </Button>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
