'use client'

import React, { useState, useEffect } from 'react';

export default function SkillsPage() {
  const [techSkills, setTechSkills] = useState('');
  const [softSkills, setSoftSkills] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Tải thông tin kỹ năng hiện có
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:8000/skills');
        if (response.ok) {
          const data = await response.json();
          setTechSkills(data.tech_skills || '');
          setSoftSkills(data.soft_skills || '');
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin kỹ năng:', error);
      }
    };

    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('http://localhost:8000/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tech_skills: techSkills,
          soft_skills: softSkills,
        }),
      });

      if (response.ok) {
        setSaveMessage('Đã lưu thông tin kỹ năng thành công!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const error = await response.json();
        setSaveMessage(`Lỗi: ${error.detail || 'Không thể lưu thông tin kỹ năng'}`);
      }
    } catch (error) {
      setSaveMessage('Lỗi kết nối đến server');
      console.error('Lỗi khi lưu thông tin kỹ năng:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kỹ năng & Kinh nghiệm
          </h1>
          <p className="text-gray-600">
            Cập nhật thông tin kỹ năng và kinh nghiệm của bạn
          </p>
        </header>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Kỹ năng</h2>
              
              <div className="mb-4">
                <label htmlFor="tech_skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Kỹ năng kỹ thuật
                </label>
                <textarea
                  id="tech_skills"
                  name="tech_skills"
                  rows={3}
                  value={techSkills}
                  onChange={(e) => setTechSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Liệt kê các kỹ năng kỹ thuật của bạn (React, Node.js, Python, SQL, v.v.)"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="soft_skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Kỹ năng mềm
                </label>
                <textarea
                  id="soft_skills"
                  name="soft_skills"
                  rows={3}
                  value={softSkills}
                  onChange={(e) => setSoftSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Liệt kê các kỹ năng mềm của bạn (Giao tiếp, Quản lý thời gian, Làm việc nhóm, v.v.)"
                />
              </div>
            </div>
            
            <div className="text-right">
              {saveMessage && (
                <p className={`mb-2 ${saveMessage.startsWith('Lỗi') ? 'text-red-500' : 'text-green-500'}`}>
                  {saveMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </div>
          </form>
        </div>
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Freelancer Profile Generator</p>
        </footer>
      </div>
    </div>
  );
} 