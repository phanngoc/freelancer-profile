"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  text: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, text, active }) => {
  return (
    <Link href={href}
      className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700 font-medium' 
          : 'text-gray-700 hover:bg-blue-50'
      }`}
    >
      <span>{text}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', text: 'Cover Letter' },
    { href: '/skills', text: 'Kỹ năng' },
    { href: '/experience', text: 'Kinh nghiệm' },
    { href: '/upload-cv', text: 'Upload CV' },
  ];

  return (
    <div className="w-60 bg-white h-screen border-r border-blue-100">
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-700 mb-8">Freelancer Profile</h2>
        <nav>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              text={item.text}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 