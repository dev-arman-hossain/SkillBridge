"use client";

import { Menu, LogOut, User as UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ModeToggle } from "@/providers/ModeToggle";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "/",
    src: "/logo.png",
    alt: "logo",
    title: "SkillBridge",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Find Tutors", url: "/tutors" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
  className,
}: Navbar1Props) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const getDashboardUrl = () => {
    const role = session?.user?.role;
    switch (role) {
      case "ADMIN":
        return "/admin-dashboard";
      case "TUTOR":
        return "/tutor-dashboard";
      case "STUDENT":
        return "/student-dashboard";
      default:
        return "/select-role";
    }
  };

  return (
    <section className={cn("py-7", className)}>
      <div className="container mx-auto px-4">
       
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
           
            <Link href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
                width={100}
                height={100}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

       
          <div className="flex items-center gap-2">
            <ModeToggle />

            {session?.user ? (
            
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href={getDashboardUrl()}>Dashboard</Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      <span className="max-w-[100px] truncate">
                        {session.user.name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardUrl()} className="cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="cursor-pointer">
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    {session.user.role === "TUTOR" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/tutor/profile" className="cursor-pointer">
                            Tutor Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/tutor/availability" className="cursor-pointer">
                            Manage Availability
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
             
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button asChild size="sm" className="bg-teal-500 hover:bg-teal-600">
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
    
            <Link href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
                width={100}
                height={100}
              />
              <span className="text-sm font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href={logo.url} className="flex items-center gap-2">
                        <Image
                          src={logo.src}
                          className="max-h-8 dark:invert"
                          alt={logo.alt}
                          width={100}
                          height={100}
                        />
                        <span className="text-lg font-semibold">
                          {logo.title}
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>

                    
                    {session?.user ? (
                      
                      <div className="flex flex-col gap-3">
                        <div className="rounded-lg bg-muted p-3">
                          <p className="text-sm font-medium">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>

                        <Button asChild variant="outline">
                          <Link href={getDashboardUrl()}>Dashboard</Link>
                        </Button>

                        <Button asChild variant="outline">
                          <Link href="/dashboard/profile">Profile Settings</Link>
                        </Button>

                        {session.user.role === "TUTOR" && (
                          <>
                            <Button asChild variant="outline">
                              <Link href="/tutor/profile">Tutor Profile</Link>
                            </Button>
                            <Button asChild variant="outline">
                              <Link href="/tutor/availability">Availability</Link>
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          onClick={handleSignOut}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                     
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="outline">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild className="bg-teal-500 hover:bg-teal-600">
                          <Link href={auth.signup.url}>{auth.signup.title}</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        asChild
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        <Link href={item.url}>{item.title}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <Link key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </Link>
  );
};

export { Navbar1 };
