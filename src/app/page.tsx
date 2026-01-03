import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Context-Aware Planning",
    description: "AI assistant that helps you plan smarter by considering local events, traffic, and cultural holidays.",
    group: "Group 1",
  },
  {
    title: "Travel Dashboard",
    description: "Interactive dashboard integrating timelines, maps, and availability data for informed decisions.",
    group: "Group 2",
  },
  {
    title: "Personal Informatics",
    description: "Track your travel goals, budgets, and reflect on past trips with personalized insights.",
    group: "Group 3",
  },
  {
    title: "Community Knowledge",
    description: "Access local tips, community forums, and authentic experiences from verified travelers.",
    group: "Group 4",
  },
  {
    title: "Predictive Analytics",
    description: "Get insights on crowding, availability, and optimal travel windows for better planning.",
    group: "Group 5",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Jalan-Jalan</h1>
          <nav className="flex gap-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">About</Button>
            <Button>Get Started</Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Smart Holiday Retreat Planning
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A cognitive travel planning platform that helps you make informed,
            context-aware decisions for your perfect holiday retreat.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Start Planning</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h3 className="text-2xl font-bold text-center mb-8">Platform Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const cardContent = (
                <Card key={feature.title}>
                  <CardHeader>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-xs">{feature.group}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );

              // Group 2
              if (feature.group === "Group 2") {
                return (
                  <Link
                    key={feature.title}
                    href="/group2-landing"
                    className="block"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return cardContent;
            })}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>ICT703 - Human Centered Informatics | UiTM</p>
        </div>
      </footer>
    </div>
  );
}
