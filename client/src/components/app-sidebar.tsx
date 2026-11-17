import { Link, useLocation } from "wouter";
import {
  Home,
  Stethoscope,
  Building2,
  Droplets,
  TestTube,
  Pill,
  AlertTriangle,
  Heart,
  Activity,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Find Doctors", url: "/doctors", icon: Stethoscope },
  { title: "Hospitals", url: "/hospitals", icon: Building2 },
  { title: "Medicines", url: "/medicines", icon: Pill },
];

const banksMenuItems = [
  { title: "Blood Banks", url: "/blood-banks", icon: Droplets },
  { title: "Platelet Banks", url: "/platelet-banks", icon: Activity },
  { title: "Sperm Banks", url: "/sperm-banks", icon: TestTube },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-sidebar-foreground">MediCare</span>
            <span className="text-xs text-muted-foreground">Plus</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Medical Banks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {banksMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Emergency</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location === "/emergency"}
                  className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                  data-testid="nav-emergency"
                >
                  <Link href="/emergency">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Emergency Assistant</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          24/7 Healthcare Support
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
