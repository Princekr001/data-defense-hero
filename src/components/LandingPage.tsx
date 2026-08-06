import { useState, useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserAuthButton } from "@/components/UserAuthButton";
import {
  Shield, Lock, Eye, Zap, Trophy, Star, Target, Brain,
  ChevronRight, Sparkles, Users, AlertTriangle, CheckCircle2,
  Gamepad2, Award, TrendingUp, Flame, ArrowRight, Sun, Moon
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

const features = [
  {
    icon: Lock,
    title: "Password Cracker",
    description: "Break weak credentials under time pressure and learn what makes a password actually strong.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Eye,
    title: "Packet Inspector",
    description: "Sift live network traffic to flag phishing payloads and exfiltration attempts.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "Firewall Bypass",
    description: "Route signals through layered defenses without tripping intrusion detection.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: AlertTriangle,
    title: "Tiered Hack Targets",
    description: "Progress from café WiFi to critical infrastructure across three escalating difficulty tiers.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

const stats = [
  { label: "Hack Targets", value: "9", icon: Target },
  { label: "Mini-Games", value: "3 Types", icon: Gamepad2 },
  { label: "Tiers", value: "3", icon: TrendingUp },
  { label: "Dimension", value: "3D", icon: Award },
];

const ScrollRevealCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const { ref, isVisible } = useScrollReveal(0.15);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const ProblemSolutionSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <section className="py-20 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
          <Card className="border-destructive/20 bg-destructive/5 h-full">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <h3 className="text-xl font-bold">The Problem</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Cybercrime costs the world <span className="text-foreground font-semibold">$10.5 trillion annually</span>.
                Yet most students lack basic cybersecurity awareness. Traditional lectures
                fail to engage young learners, leaving them vulnerable to phishing, identity theft,
                and data breaches in their daily digital lives.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className={`transition-all duration-700 ease-out delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`} style={{ transitionDelay: "200ms" }}>
          <Card className="border-accent/20 bg-accent/5 h-full">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-bold">Our Solution</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-foreground font-semibold">Data Defense Hero</span> transforms
                cybersecurity education into an immersive game. Students earn XP, unlock badges,
                and level up by completing missions that teach real-world skills — from spotting
                phishing emails to building secure passwords.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => (
  <section id="features" className="py-20 px-6 bg-muted/20">
    <div className="max-w-5xl mx-auto">
      <ScrollRevealCard>
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            <Gamepad2 className="h-3.5 w-3.5 mr-1.5" />
            Core Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Learn by Playing
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Four interactive modules designed to build practical cybersecurity skills.
          </p>
        </div>
      </ScrollRevealCard>

      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <ScrollRevealCard key={f.title} delay={i * 120}>
            <Card className="group hover:border-primary/30 transition-all duration-300 hover:shadow-cyber h-full">
              <CardContent className="p-6 flex gap-4">
                <div className={`shrink-0 h-12 w-12 rounded-lg ${f.bg} flex items-center justify-center`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </CardContent>
            </Card>
          </ScrollRevealCard>
        ))}
      </div>
    </div>
  </section>
);

const LandingPage = ({ onStart }: LandingPageProps) => {
  const [xpDemo, setXpDemo] = useState(0);
  const { actualTheme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setXpDemo(68), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/30 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">
            Data Defense <span className="text-primary">Hero</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(actualTheme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {actualTheme === "dark" ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <UserAuthButton />
        </div>
      </nav>

      {/* Animated threat slideshow (replaces static hero + text blocks) */}
      <CyberSlideshow onStart={onStart} />

      {/* Stats Bar */}
      <section className="border-y border-border/30 bg-muted/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border/30">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-8 gap-1">
              <s.icon className="h-5 w-5 text-primary mb-1" />
              <span className="text-2xl font-bold">{s.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </section>



      {/* Features */}
      <FeaturesSection />


      {/* Gamification Showcase */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4 border-secondary/30 text-secondary">
              <Trophy className="h-3.5 w-3.5 mr-1.5" />
              Gamification
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Level Up Your Skills
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Earn XP, climb ranks, and collect badges as you master cybersecurity.
            </p>
          </div>

          {/* Demo Progress Card */}
          <Card className="border-primary/20 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-cyber flex items-center justify-center text-2xl">
                    🛡️
                  </div>
                  <div>
                    <p className="font-bold text-lg">Cyber Scout</p>
                    <p className="text-sm text-muted-foreground">Level 3 • Intermediate</p>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Flame className="h-3 w-3 mr-1" />
                  5 Day Streak
                </Badge>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">XP Progress</span>
                  <span className="font-medium text-primary">680 / 1,000 XP</span>
                </div>
                <Progress value={xpDemo} className="h-3" />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {["🔍 Detective", "🛡️ Guardian", "⭐ First Win", "🎯 Sharpshooter"].map((badge) => (
                  <div
                    key={badge}
                    className="text-center p-3 rounded-lg bg-muted/50 border border-border/50 text-xs"
                  >
                    <span className="text-lg block mb-1">{badge.split(" ")[0]}</span>
                    <span className="text-muted-foreground">{badge.split(" ").slice(1).join(" ")}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border/30 bg-muted/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Defend Your Data?
          </h2>
          <p className="text-muted-foreground mb-8">
            No account required. Jump into your first mission and start learning.
          </p>
          <Button size="xl" variant="cyber" onClick={onStart} className="group animate-pulse-glow">
            <Shield className="h-5 w-5" />
            Start Playing Now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>Data Defense Hero — Academic Project</span>
          </div>
          <p>Built for cybersecurity education and awareness.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
