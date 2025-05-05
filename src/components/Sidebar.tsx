"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaFileAlt, FaTools, FaBriefcase, FaUpload, FaUser } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();

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
        {user && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                <FaUser size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}
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