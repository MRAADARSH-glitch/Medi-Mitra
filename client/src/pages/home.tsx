import { Link } from "wouter";
import { 
  Stethoscope, 
  Building2, 
  Droplets, 
  Pill, 
  AlertTriangle, 
  Phone,
  Clock,
  Shield,
  Activity,
  TestTube,
  ArrowRight,
  Heart,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const services = [
  {
    title: "Find Doctors",
    description: "Browse specialists across cardiology, orthopedics, gynecology, and more",
    icon: Stethoscope,
    href: "/doctors",
    color: "bg-blue-500",
  },
  {
    title: "Hospitals",
    description: "Locate the nearest hospitals with emergency services",
    icon: Building2,
    href: "/hospitals",
    color: "bg-emerald-500",
  },
  {
    title: "Blood Banks",
    description: "Find blood banks with real-time availability and pricing",
    icon: Droplets,
    href: "/blood-banks",
    color: "bg-red-500",
  },
  {
    title: "Platelet Banks",
    description: "Locate platelet donation centers near you",
    icon: Activity,
    href: "/platelet-banks",
    color: "bg-purple-500",
  },
  {
    title: "Sperm Banks",
    description: "Accredited fertility centers and sperm banks",
    icon: TestTube,
    href: "/sperm-banks",
    color: "bg-cyan-500",
  },
  {
    title: "Medicine Database",
    description: "Complete information on medicines, dosages, and uses",
    icon: Pill,
    href: "/medicines",
    color: "bg-amber-500",
  },
];

const features = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access healthcare information anytime, anywhere",
  },
  {
    icon: Shield,
    title: "Verified Information",
    description: "All data is verified and regularly updated",
  },
  {
    icon: Phone,
    title: "Quick Contact",
    description: "Direct contact to hospitals and emergency services",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative py-12 px-6 lg:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
            <Heart className="w-4 h-4" />
            Your Health, Our Priority
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Complete Healthcare at{" "}
            <span className="gradient-text">Your Fingertips</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find doctors, hospitals, blood banks, and get instant AI-powered emergency assistance. 
            Your comprehensive online healthcare partner for all medical needs.
          </p>
          
          {/* Search Bar */}
          <div className="flex gap-2 max-w-xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Search doctors, hospitals, medicines..." 
                className="pl-10 h-12"
                data-testid="input-hero-search"
              />
            </div>
            <Button size="lg" className="h-12 px-6" data-testid="button-hero-search">
              Search
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-find-doctor">
              <Link href="/doctors">
                <Stethoscope className="w-5 h-5 mr-2" />
                Find a Doctor
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="destructive" 
              className="emergency-pulse"
              asChild
              data-testid="button-emergency-hero"
            >
              <Link href="/emergency">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Emergency Help
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="mx-6 mb-8">
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Need Emergency Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant AI-powered medical guidance and hospital recommendations
                </p>
              </div>
            </div>
            <Button variant="destructive" asChild data-testid="button-emergency-banner">
              <Link href="/emergency">
                Get Help Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Our Services</h2>
            <p className="text-muted-foreground">
              Comprehensive healthcare services at your fingertips
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Link key={service.title} href={service.href}>
                <Card className="h-full hover-elevate cursor-pointer transition-all" data-testid={`card-service-${service.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <CardHeader className="pb-2">
                    <div className={`w-10 h-10 rounded-md ${service.color} flex items-center justify-center mb-2`}>
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Doctors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Hospitals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Blood Banks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Medicines</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
