"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaFileAlt, FaTools, FaBriefcase, FaUpload } from 'react-icons/fa';

interface NavItemProps {
  href: string;
  text: string;
  icon: React.ReactNode;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, text, icon, active }) => {
  return (
    <Link href={href}
      className={`flex items-center px-4 py-3 rounded-md mb-3 transition-all ${
        active 
          ? 'bg-teal-50 text-teal-600 font-medium border-l-4 border-teal-500' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-teal-500'
      }`}
    >
      <span className={`mr-3 ${active ? 'text-teal-500' : 'text-gray-400'}`}>
        {icon}
      </span>
      <span>{text}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', text: 'Cover Letter', icon: <FaFileAlt /> },
    { href: '/skills', text: 'Kỹ năng', icon: <FaTools /> },
    { href: '/experience', text: 'Kinh nghiệm', icon: <FaBriefcase /> },
    { href: '/upload-cv', text: 'Upload CV', icon: <FaUpload /> },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-100 shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-teal-600 mb-10 flex items-center">
          <span className="bg-teal-500 w-8 h-8 rounded-md text-white flex items-center justify-center mr-3">F</span>
          Freelancer
        </h2>
        <nav>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              text={item.text}
              icon={item.icon}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;