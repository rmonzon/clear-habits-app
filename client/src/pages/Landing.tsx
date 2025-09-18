import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationHeader } from "@/components/NavigationHeader";
import { SignInButton, useUser } from '@clerk/clerk-react';
import {
  Target,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  BarChart3,
} from "lucide-react";

export default function Landing() {
  const { user, isLoaded } = useUser();
  
  // Debug authentication state
  console.log('Landing - user:', user, 'isLoaded:', isLoaded, 'isAuthenticated:', !!user);

  const features = [
    {
      icon: Target,
      title: "Set Meaningful Goals",
      description:
        "Create daily, weekly, monthly, or yearly habits with custom targets and categories.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Visualize your progress with intuitive charts, progress bars, and streak counters.",
    },
    {
      icon: Calendar,
      title: "Build Streaks",
      description:
        "Stay motivated with streak tracking and see your consistency over time.",
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description:
        "Get insights into your habits with completion rates and trend analysis.",
    },
    {
      icon: CheckCircle,
      title: "Easy Logging",
      description:
        "Quickly mark habits as complete with a simple, intuitive interface.",
    },
    {
      icon: Users,
      title: "Personal Journey",
      description:
        "Your private space to build the habits that matter most to you.",
    },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      <NavigationHeader />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="relative">
          <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Target className="h-8 w-8" />
              </div>

              <h1
                className="text-4xl md:text-6xl font-bold text-foreground"
                data-testid="hero-title"
              >
                Build Habits That
                <span className="text-primary"> Last</span>
              </h1>

              <p
                className="text-xl text-muted-foreground max-w-2xl"
                data-testid="hero-subtitle"
              >
                Transform your life one habit at a time. Track goals, visualize
                progress, and stay motivated with streaks and achievements.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    data-testid="button-get-started"
                    className="text-lg px-8"
                  >
                    Get Started Free
                  </Button>
                </SignInButton>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  data-testid="button-learn-more"
                  className="text-lg px-8"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold"
            data-testid="features-title"
          >
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you build lasting habits and
            achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover-elevate"
              data-testid={`feature-card-${index}`}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold"
              data-testid="cta-title"
            >
              Ready to Build Better Habits?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of people who are already transforming their lives,
              one habit at a time.
            </p>
            <SignInButton mode="modal">
              <Button
                size="lg"
                data-testid="button-start-journey"
                className="text-lg px-8"
              >
                Start Your Journey
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <Target className="h-3 w-3" />
            </div>
            <span className="text-sm text-muted-foreground">
              ClearHabits - Build habits that last
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
