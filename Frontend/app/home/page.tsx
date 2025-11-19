"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BarChart3, Brain, CreditCard, PiggyBank, TrendingUp, Download, Menu, X, FileText } from "lucide-react"
import { FiHome, FiBarChart, FiCpu, FiUser, FiLogOut } from "react-icons/fi"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, logOut } from "@/lib/firebase-auth"

// Simple Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "lg";
}

function Button({ children, onClick, className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground"
  } as const
  const sizes = {
    default: "h-10 py-2 px-4",
    lg: "h-11 px-8 rounded-md"
  } as const

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Simple Card components
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

function CardHeader({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ children, className = "", ...props }: CardProps) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  )
}

function CardContent({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Neumorphism Button Component
interface NeumorphismButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  className?: string;
}

const NeumorphismButton = ({ children, onClick, icon: Icon, href, className = "" }: NeumorphismButtonProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('NeumorphismButton clicked:', { onClick: !!onClick, href });

    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  const buttonContent = (
    <button
      onClick={handleClick}
      className={`
        px-4 py-2 rounded-full
        flex items-center gap-2
        text-slate-500
        shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
        transition-all
        hover:shadow-[-1px_-1px_5px_rgba(255,255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
        hover:text-violet-500
        cursor-pointer
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm font-medium">{children}</span>
    </button>
  );

  // Always return the button content directly for consistent behavior
  return buttonContent;
};

// Navigation Buttons Container
const NeumorphismNavigation = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      const unsubscribe = await onAuthStateChanged((currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribePromise = setupAuth();

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe());
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-full" />
        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-full" />
        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-full" />
        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <NeumorphismButton icon={FiHome} href="#features">
        Features
      </NeumorphismButton>
      <NeumorphismButton icon={FiBarChart} href="/dashboard">
        Dashboard
      </NeumorphismButton>
      <NeumorphismButton icon={FiCpu} href="/fingpt">
        FinGPT
      </NeumorphismButton>
      {user ? (
        <NeumorphismButton
          icon={FiLogOut}
          onClick={handleSignOut}
          className="bg-red-50"
        >
          Sign Out
        </NeumorphismButton>
      ) : (
        <NeumorphismButton
          icon={FiUser}
          onClick={() => router.push('/login')}
          className="bg-violet-50"
        >
          Sign In
        </NeumorphismButton>
      )}
    </div>
  );
};

// Navigation component with neumorphism buttons
function NeumorphismNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const setupAuth = async () => {
      const unsubscribe = await onAuthStateChanged((currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribePromise = setupAuth();

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe());
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await logOut();
      setIsMobileMenuOpen(false);
      router.push('/home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-slate-100/95 backdrop-blur supports-[backdrop-filter]:bg-slate-100/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/images/finance-logo.png"
            alt="FinanceBuddy Logo"
            width={40}
            height={40}
            className="object-contain"
            priority={false}
          />
          <span className="text-xl font-bold text-gray-900">FinanceBuddy</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation - Neumorphism Buttons */}
        <div className="hidden md:block">
          <NeumorphismNavigation />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-[64px] bg-slate-100 border-b md:hidden transform translate-y-0 opacity-100">
          <nav className="container py-4 px-4 space-y-4">
            <NeumorphismButton
              icon={FiHome}
              onClick={() => {
                setIsMobileMenuOpen(false)
                router.push('#features')
              }}
              className="w-full justify-center"
            >
              Features
            </NeumorphismButton>
            <NeumorphismButton
              icon={FiBarChart}
              onClick={() => {
                setIsMobileMenuOpen(false)
                router.push('/dashboard')
              }}
              className="w-full justify-center"
            >
              Dashboard
            </NeumorphismButton>
            <NeumorphismButton
              icon={FiCpu}
              onClick={() => {
                setIsMobileMenuOpen(false)
                router.push('/fingpt')
              }}
              className="w-full justify-center"
            >
              FinGPT
            </NeumorphismButton>
            {user ? (
              <NeumorphismButton
                icon={FiLogOut}
                onClick={handleSignOut}
                className="w-full justify-center bg-red-50"
              >
                Sign Out
              </NeumorphismButton>
            ) : (
              <NeumorphismButton
                icon={FiUser}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  router.push('/login')
                }}
                className="w-full justify-center bg-violet-50"
              >
                Sign In
              </NeumorphismButton>
            )}
          </nav>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  )
}

// Enhanced Financial Analytics component showcasing project quality
function FinancialAnalyticsShowcase() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 rounded-2xl p-8">
      <div className="text-center space-y-6 max-w-md">
        {/* Money-related visual elements */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <div className="text-white text-4xl font-bold">₹</div>
          </div>
          {/* Floating money icons */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-xs">💰</span>
          </div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xs">💳</span>
          </div>
          <div className="absolute top-4 -left-4 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center animate-ping">
            <TrendingUp className="h-3 w-3 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-gray-600 text-sm leading-relaxed">
            <span className="font-semibold text-emerald-600">Enterprise-Grade:</span> Built with modern architecture, scalable design patterns, and industry best practices for production-ready deployment.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            <span className="font-semibold text-blue-600">Quality Assurance:</span> Comprehensive testing, optimized performance, secure authentication, and responsive design across all devices.
          </p>

          {/* Quality badges */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
              ✨ Production Ready
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              � Secure & Tested
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              🚀 High Performance
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Client-side rendered component
export default function HomePage() {

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-gray-900">
      {/* Neumorphism navigation component */}
      <NeumorphismNavBar />

      {/* Hero Section with Full Screen Spline */}
      <section className="relative w-full min-h-screen">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
              {/* Content Container */}
              <div className="w-full max-w-2xl space-y-6 animate-fade-in z-10">
                <div className="bg-white/50 backdrop-blur-sm p-4 md:p-8 rounded-2xl relative overflow-hidden">
                  {/* Money-related background elements */}
                  <div className="absolute top-4 right-4 text-6xl opacity-10 animate-pulse">💰</div>
                  <div className="absolute bottom-4 left-4 text-4xl opacity-10 animate-bounce">📊</div>
                  <div className="absolute top-1/2 right-8 text-3xl opacity-10 animate-ping">💳</div>


                  <h1 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-gray-900 relative z-10">
                    Smart Financial Management
                    <span className="block text-2xl md:text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mt-2">
                      Enterprise-Grade Solution
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-gray-700 text-base md:text-xl mt-4 relative z-10">
                    Professional-grade financial companion built with modern technologies, featuring AI-driven insights, automated categorization, and comprehensive analytics for superior money management.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      onClick={() => {
                        window.open('https://1024terabox.com/s/1GZTaEhB146Yg61iTKQEZag', '_blank');
                      }}
                      size="lg"
                      className="w-full sm:w-auto gap-1.5 hover:scale-105 transition-transform duration-300"
                    >
                      Download Android Application <Download className="h-4 w-4" />
                    </Button>
                    <Link href="/dashboard" className="w-full sm:w-auto">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full gap-1.5 hover:scale-105 transition-transform duration-300"
                      >
                        View Dashboard <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-[50vh] md:h-full relative">
              <FinancialAnalyticsShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-8 md:py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 relative overflow-hidden">
        {/* Background money elements */}
        <div className="absolute top-10 left-10 text-8xl opacity-5 animate-pulse">💰</div>
        <div className="absolute bottom-10 right-10 text-8xl opacity-5 animate-bounce">📈</div>
        <div className="absolute top-1/2 left-1/4 text-6xl opacity-5 animate-ping">💳</div>
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5 animate-pulse">🏦</div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-gray-900">
                Key Features
              </h2>
              <p className="max-w-[900px] text-gray-600 text-sm md:text-base lg:text-xl">
                A comprehensive financial management solution powered by AI
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-12 mt-8 md:mt-12">
            <Link href="/expenses" className="group">
              <Card className="border-gray-200 bg-white/50 backdrop-blur-sm shadow-lg rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group-hover:shadow-xl group-hover:border-emerald-300">
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                    <CreditCard className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg group-hover:text-emerald-700 transition-colors">Track Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-gray-600 group-hover:text-gray-700">
                    Smart expense tracking with automatic categorization and real-time updates. Monitor your spending patterns effortlessly.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/budgeting" className="group">
              <Card className="border-gray-200 bg-white/50 backdrop-blur-sm shadow-lg rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group-hover:shadow-xl group-hover:border-blue-300">
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <PiggyBank className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg group-hover:text-blue-700 transition-colors">Smart Budgeting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-gray-600 group-hover:text-gray-700">
                    Create custom budgets with intelligent alerts and insights. Stay on top of your financial goals with dynamic tracking.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/fingpt" className="group">
              <Card className="border-gray-200 bg-white/50 backdrop-blur-sm shadow-lg rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group-hover:shadow-xl group-hover:border-purple-300">
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg group-hover:text-purple-700 transition-colors">AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-gray-600 group-hover:text-gray-700">
                    Get personalized financial advice and spending insights powered by advanced AI algorithms. Make smarter financial decisions.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reports" className="group">
              <Card className="border-gray-200 bg-white/50 backdrop-blur-sm shadow-lg rounded-2xl hover:scale-105 transition-all duration-300 cursor-pointer group-hover:shadow-xl group-hover:border-orange-300">
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg group-hover:text-orange-700 transition-colors">Financial Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs md:text-sm text-gray-600 group-hover:text-gray-700">
                    Generate comprehensive financial reports with detailed analytics, charts, and insights. Export and share your financial data.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Project Quality Excellence Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-gray-900">
              Enterprise-Grade Development Excellence
            </h2>
            <p className="max-w-3xl mx-auto text-gray-600 text-lg">
              Built with industry best practices, modern architecture, and rigorous quality standards to deliver a professional-grade financial management solution.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {/* Code Quality */}
            <Card className="border-2 border-emerald-200 bg-emerald-50/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💻</span>
                </div>
                <CardTitle className="text-emerald-800">Code Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-700 text-sm">
                  Clean, maintainable code following industry standards with TypeScript, modern React patterns, proper error handling, and comprehensive documentation for scalable development.
                </p>
              </CardContent>
            </Card>

            {/* Architecture & Performance */}
            <Card className="border-2 border-blue-200 bg-blue-50/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🏗️</span>
                </div>
                <CardTitle className="text-blue-800">Modern Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 text-sm">
                  Built with Next.js 13 App Router, optimized performance, responsive design, efficient state management, and scalable component architecture for enterprise deployment.
                </p>
              </CardContent>
            </Card>

            {/* Security & Testing */}
            <Card className="border-2 border-purple-200 bg-purple-50/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">�</span>
                </div>
                <CardTitle className="text-purple-800">Security & Reliability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700 text-sm">
                  Firebase Authentication, secure data handling, input validation, error boundaries, comprehensive testing, and production-ready deployment configurations.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quality Highlights */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">What Makes This Project Exceptional</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-600 text-sm">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Performance Optimized</h4>
                    <p className="text-gray-600 text-sm">Lightning-fast loading times, optimized bundle sizes, efficient rendering, and smooth user interactions across all devices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm">🧑‍💻</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Professional Development</h4>
                    <p className="text-gray-600 text-sm">Built with Next.js 13, TypeScript, Firebase, and modern best practices following enterprise development standards</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 text-sm">�</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Production Ready</h4>
                    <p className="text-gray-600 text-sm">Comprehensive error handling, secure authentication, responsive design, and deployment-ready configuration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-600 text-sm">�</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">User-Centric Design</h4>
                    <p className="text-gray-600 text-sm">Intuitive interface, accessibility compliance, mobile-first approach, and seamless user experience design</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Description */}
      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">About FinanceBuddy</h2>
              <p className="text-gray-600">
                FinanceBuddy is a modern financial management platform that combines the power of AI with intuitive design to help you take control of your finances. Built with cutting-edge technologies and focused on user experience, it offers a comprehensive suite of tools for expense tracking, budgeting, and investment management.
              </p>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Technologies Used</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Next.js 13 with App Router</li>
                  <li>Firebase Authentication & Realtime Database</li>
                  <li>TailwindCSS & Shadcn/ui</li>
                  <li>Binance API Integration</li>
                  <li>AI-Powered Financial Analysis</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Key Benefits</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Comprehensive Analytics</h3>
                    <p className="text-gray-600">Detailed financial reports and visualizations to understand your money better.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI-Powered Insights</h3>
                    <p className="text-gray-600">Smart recommendations and predictions to optimize your financial decisions.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Comprehensive Reports</h3>
                    <p className="text-gray-600">Generate detailed financial reports with charts, analytics, and exportable data for better decision making.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Footer */}
      <footer className="border-t bg-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold">About the Developer</h3>
              
              <div className="space-y-2">
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold">Connect With Me</h3>
              <div className="space-y-4">
                <Link
                  href="https://www.linkedin.com/in/mrunal-thamake-b94a10267/"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-sm md:text-base">LinkedIn Profile</span>
                </Link>
                <Link
                  href="https://github.com/MRUnal1232"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-sm md:text-base">GitHub Repository</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm md:text-base text-gray-600">© 2024 FinanceBuddy. Built with ❤️ by Deepship</p>
          </div>
        </div>
      </footer>

    </div>
  )
}