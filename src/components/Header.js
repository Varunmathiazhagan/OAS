import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MountainIcon, LayoutDashboard, Users, Search, CheckSquare, Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, description: 'Your main control panel' },
    { href: '/employees', label: 'Employees', icon: Users, description: 'Manage employee data' },
    { href: '/track', label: 'Track', icon: Search, description: 'Track progress and tasks' },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare, description: 'Create and manage tasks' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-primary/90 backdrop-blur-lg shadow-lg' : 'bg-primary'
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <MountainIcon className="h-8 w-8 text-primary-foreground animate-pulse" />
          <span className="text-2xl font-bold text-primary-foreground hover:text-primary-foreground/80 transition-all">
            OSA SOFTWARE
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8">
          {navItems.map(({ href, label, icon: Icon, description }) => (
            <li key={href} className="relative group">
              <Link
                to={href}
                className="flex items-center space-x-2 text-primary-foreground hover:text-gradient-to-r from-purple-400 via-pink-500 to-red-500 transition-all duration-300"
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-400 to-red-500 transition-all duration-200 group-hover:w-full"></span>
              {/* Tooltip */}
              <span className="absolute left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 mt-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                {description}
              </span>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="outline-none p-2 transition-transform duration-300 transform hover:scale-110"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-primary-foreground" /> : <Menu className="h-6 w-6 text-primary-foreground" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-lg w-3/4 transition-all duration-300 transform scale-95 hover:scale-100">
            <ul className="space-y-4">
              {navItems.map(({ href, label, icon: Icon, description }) => (
                <li key={href}>
                  <Link
                    to={href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-primary-500 hover:text-primary-700 transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                  <p className="text-xs text-gray-500">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
