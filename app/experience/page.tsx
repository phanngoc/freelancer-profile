'use client'

import React, { useState, useEffect } from 'react';

export default function ExperiencePage() {
  const [workExperience, setWorkExperience] = useState('');
  const [projects, setProjects] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Tải thông tin kinh nghiệm hiện có
    const fetchExperience = async () => {
      try {
        const response = await fetch('http://localhost:8000/experience');
        if (response.ok) {
          const data = await response.json();
          setWorkExperience(data.work_experience || '');
          setProjects(data.projects || '');
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin kinh nghiệm:', error);
      }
    };

    fetchExperience();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('http://localhost:8000/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          work_experience: workExperience,
          projects: projects,
        }),
      });

      if (response.ok) {
        setSaveMessage('Đã lưu thông tin kinh nghiệm thành công!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const error = await response.json();
        setSaveMessage(`Lỗi: ${error.detail || 'Không thể lưu thông tin kinh nghiệm'}`);
      }
    } catch (error) {
      setSaveMessage('Lỗi kết nối đến server');
      console.error('Lỗi khi lưu thông tin kinh nghiệm:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kinh nghiệm
          </h1>
          <p className="text-gray-600">
            Cập nhật thông tin kinh nghiệm và dự án của bạn
          </p>
        </header>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết kinh nghiệm</h2>
              
              <div className="mb-4">
                <label htmlFor="work_experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Kinh nghiệm làm việc
                </label>
                <textarea
                  id="work_experience"
                  name="work_experience"
                  rows={6}
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Mô tả kinh nghiệm làm việc của bạn. Bao gồm tên công ty, thời gian làm việc, và mô tả công việc."
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="projects" className="block text-sm font-medium text-gray-700 mb-1">
                  Dự án
                </label>
                <textarea
                  id="projects"
                  name="projects"
                  rows={6}
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Mô tả các dự án bạn đã thực hiện. Bao gồm tên dự án, công nghệ sử dụng, và kết quả đạt được."
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