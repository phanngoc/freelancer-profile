'use client'

import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaProjectDiagram, FaCheck, FaSave } from 'react-icons/fa';
import { Spinner } from '../../components/Spinner';

export default function ExperiencePage() {
  const [workExperience, setWorkExperience] = useState('');
  const [projects, setProjects] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

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
    setSaveStatus(null);

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
        setSaveStatus('success');
        setTimeout(() => {
          setSaveMessage('');
          setSaveStatus(null);
        }, 3000);
      } else {
        const error = await response.json();
        setSaveMessage(`Lỗi: ${error.detail || 'Không thể lưu thông tin kinh nghiệm'}`);
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveMessage('Lỗi kết nối đến server');
      setSaveStatus('error');
      console.error('Lỗi khi lưu thông tin kinh nghiệm:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-8">
          <div className="inline-block bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
            Phát triển sự nghiệp
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
            Kinh nghiệm chuyên môn
          </h1>
          <p className="text-gray-600">
            Cập nhật kinh nghiệm làm việc và dự án nổi bật của bạn
          </p>
        </header>
        
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <div className="flex items-center mb-4">
                  <FaBriefcase className="text-teal-500 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Kinh nghiệm làm việc
                  </h2>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <textarea
                    id="work_experience"
                    name="work_experience"
                    rows={8}
                    value={workExperience}
                    onChange={(e) => setWorkExperience(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white resize-none focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-colors"
                    placeholder="Mô tả kinh nghiệm làm việc của bạn. Bao gồm tên công ty, thời gian làm việc, và mô tả công việc."
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <FaProjectDiagram className="text-teal-500 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Dự án nổi bật
                  </h2>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <textarea
                    id="projects"
                    name="projects"
                    rows={8}
                    value={projects}
                    onChange={(e) => setProjects(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white resize-none focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-colors"
                    placeholder="Mô tả các dự án bạn đã thực hiện. Bao gồm tên dự án, công nghệ sử dụng, và kết quả đạt được."
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end items-center">
              {saveMessage && (
                <div className={`mr-4 px-4 py-2 rounded-lg ${
                  saveStatus === 'success' 
                    ? 'bg-green-50 text-green-600 border border-green-100' 
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  <p className="flex items-center">
                    {saveStatus === 'success' && <FaCheck className="mr-2" />}
                    {saveMessage}
                  </p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Spinner size="small" color="white" />
                    <span className="ml-2">Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    <span>Lưu thông tin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Freelancer Profile Generator</p>
        </footer>
      </div>
    </div>
  );
}