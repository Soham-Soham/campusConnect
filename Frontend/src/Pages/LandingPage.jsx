import { useState } from 'react';
import {
  Menu,
  X,
  Users,
  MessageCircle,
  BarChart2,
  Calendar,
  Settings,
  Globe,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';

// Main App component which combines all sections
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-800">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}

// Navbar component with responsive design
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4 md:px-8">
        {/* Logo and brand name */}
        <div className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">CampusConnect</span>
        </div>

        {/* Desktop navigation links: hidden on mobile, visible on medium screens and up */}
        <nav className="hidden space-x-6 md:flex">
          <a href="#hero" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors duration-200">Home</a>
          <a href="#features" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors duration-200">Features</a>
          <a href="#about" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors duration-200">About</a>
          <a href="#footer" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors duration-200">Contact</a>
        </nav>

        {/* Desktop login/register buttons: hidden on mobile, visible on medium screens and up */}
        <div className="hidden space-x-3 md:flex">
          <a href="/login" className="rounded-full bg-transparent px-5 py-2 text-sm font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors duration-200">Login</a>
          <a href="/register" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors duration-200">Register</a>
        </div>

        {/* Mobile menu button: visible on mobile, hidden on medium screens and up */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile navigation menu: dynamically rendered based on state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-1 p-4 bg-white shadow-lg">
            <a href="#hero" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Home</a>
            <a href="#features" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Features</a>
            <a href="#about" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">About</a>
            <a href="#footer" onClick={() => setIsOpen(false)} className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Contact</a>
            <hr className="my-2" />
            <a href="/login" className="block rounded-full bg-transparent px-5 py-2 text-sm font-semibold text-blue-600 border border-blue-600 text-center hover:bg-blue-50">Login</a>
            <a href="/register" className="block rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white text-center shadow-md hover:bg-blue-700">Register</a>
          </div>
        </div>
      )}
    </header>
  );
};

// Hero section with responsive animations and layout
const HeroSection = () => {
  return (
    <section id="hero" className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-white p-4 text-center">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="animate-fade-in-down text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to the new era of <span className="block text-blue-600">CampusConnect</span>
        </h1>
        <p className="animate-fade-in-up text-lg text-gray-600 sm:text-xl">
          A social media platform for institutes to connect students and teachers. Chat with institute friends or teachers in real-time.
        </p>
        <div className="flex animate-fade-in-up flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <a
            href="/login"
            className="group inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Login
          </a>
          <a
            href="/register"
            className="group inline-flex items-center justify-center rounded-full border-2 border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-600 shadow-md transition-transform duration-300 hover:scale-105 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200"
          >
            Register
          </a>
        </div>
      </div>
      {/* Banner below the hero section */}
      <div className="mt-12 flex w-full flex-col items-center justify-center bg-gray-100 py-8 text-center sm:py-12">
        <p className="text-xl font-bold text-gray-700 sm:text-2xl">Join over <span className="text-blue-600">10,000+</span> users today!</p>
      </div>
    </section>
  );
};

// Features section with responsive grid layout
const FeaturesSection = () => {
  const features = [
    {
      name: 'Connect with Peers',
      description: 'Easily find and connect with other students and teachers from your institution.',
      icon: Users,
    },
    {
      name: 'Real-time Chat',
      description: 'Engage in instant messaging with friends and faculty for quick discussions.',
      icon: MessageCircle,
    },
    {
      name: 'Academic Insights',
      description: 'View performance analytics and receive personalized academic tips and resources.',
      icon: BarChart2,
    },
    {
      name: 'Event Management',
      description: 'Stay updated on all campus events, workshops, and deadlines in one place.',
      icon: Calendar,
    },
  ];

  return (
    <section id="features" className="bg-gray-100 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Key Features
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A comprehensive suite of tools designed to enhance your campus experience.
          </p>
        </div>
        {/* Responsive grid for features: 2 columns on small screens, 4 on large screens */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.name}</h3>
              <p className="mt-2 text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About section with responsive layout
const AboutSection = () => {
  return (
    <section id="about" className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Responsive grid: single column on mobile, two columns on large screens */}
        <div className="mx-auto max-w-4xl lg:grid lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              CampusConnect was built with a simple mission: to bridge the gap between students and educators, fostering a more collaborative and informed campus community. We believe in the power of connection and its ability to transform the educational experience.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Our platform provides a safe and intuitive space for communication, learning, and collaboration, ensuring every member of the institute has the tools they need to succeed.
            </p>
            <a
              href="#"
              className="mt-8 self-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 lg:self-start"
            >
              Learn More
            </a>
          </div>
          {/* Placeholder image with a subtle animation */}
          <div className="mt-12 lg:mt-0">
            <img
              src="https://placehold.co/600x400/3B82F6/FFFFFF?text=Campus+Life"
              alt="Students collaborating on a project"
              className="h-auto w-full rounded-lg object-cover shadow-xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer component with responsive grid
const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-800 py-12 text-gray-300">
      <div className="container mx-auto px-4">
        {/* Responsive grid: single column on mobile, three columns on medium screens and up */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <h4 className="mb-4 text-lg font-bold">CampusConnect</h4>
            <p className="text-sm">
              Connecting students and teachers to create a smarter, more collaborative campus community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-bold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#hero" className="hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="#features" className="hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#about" className="hover:text-white transition-colors duration-200">About</a></li>
              <li><a href="#footer" className="hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="mb-4 text-lg font-bold">Connect with Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2024 CampusConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
