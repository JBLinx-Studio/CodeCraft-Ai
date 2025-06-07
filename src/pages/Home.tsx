
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Palette, Zap, Globe, Smartphone, Cpu } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Code,
      title: "AI-Powered Development",
      description: "Generate complete web applications with advanced AI assistance"
    },
    {
      icon: Palette,
      title: "Beautiful Design",
      description: "Professional, responsive designs with modern UI components"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Build and deploy applications in minutes, not hours"
    },
    {
      icon: Globe,
      title: "Web Standards",
      description: "Built with modern web technologies and best practices"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Responsive designs that work perfectly on all devices"
    },
    {
      icon: Cpu,
      title: "Smart Generation",
      description: "Intelligent code generation with real-time preview"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build Web Apps with AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Create professional web applications instantly with our AI-powered development platform. 
            No coding experience required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything you need to build amazing apps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to build your next project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who are already building with AI
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
            Start Building Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
