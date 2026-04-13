import { useState, useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserAuthButton } from "@/components/UserAuthButton";
import {
  Shield, Lock, Eye, Zap, Trophy, Star, Target, Brain,
  ChevronRight, Sparkles, Users, AlertTriangle, CheckCircle2,
  Gamepad2, Award, TrendingUp, Flame, ArrowRight
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

const features = [
  {
    icon: Eye,
    title: "Phishing Detection Game",
    description: "Spot fake emails, suspicious links, and social engineering attacks before they trick you.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Lock,
    title: "Password Strength Checker",
    description: "Learn to create unbreakable passwords and understand what makes credentials secure.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "Privacy Quiz",
    description: "Test your knowledge on data privacy, digital footprints, and safe online behavior.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: AlertTriangle,
    title: "Cyber Attack Scenarios",
    description: "Navigate real-world attack simulations — ransomware, data breaches, and identity theft.",
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

const stats = [
  { label: "Missions", value: "12+", icon: Target },
  { label: "Mini-Games", value: "4 Types", icon: Gamepad2 },
  { label: "Levels", value: "12", icon: TrendingUp },
  { label: "Badges", value: "20+", icon: Award },
];

const LandingPage = ({ onStart }: LandingPageProps) => {
  const [xpDemo, setXpDemo] = useState(0);

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
          <UserAuthButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6">
        {/* Background glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 text-primary animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Gamified Cybersecurity Education
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 animate-fade-in">
            Defend Your Data.{" "}
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Become a Cyber Hero.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
            An interactive, gamified platform that teaches students cybersecurity
            awareness through missions, mini-games, and real-world attack simulations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Button
              size="xl"
              variant="cyber"
              onClick={onStart}
              className="group animate-pulse-glow"
            >
              <Zap className="h-5 w-5" />
              Start Mission
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              Explore Features
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

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

      {/* Problem & Solution */}
      <ProblemSolutionSection />


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
