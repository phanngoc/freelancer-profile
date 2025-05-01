'use client';

import React, { useState, useEffect } from 'react';
import { FaCode, FaPlusCircle, FaTimesCircle, FaSave, FaCheck } from 'react-icons/fa';
import { Spinner } from '../../components/Spinner';

// API Base URL constant
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export default function SkillsPage() {
  const [techSkills, setTechSkills] = useState<string>('');
  const [softSkills, setSoftSkills] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    // Tải kỹ năng hiện có
    const fetchSkills = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/skills`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setTechSkills(data.data.tech_skills || '');
            setSoftSkills(data.data.soft_skills || '');
          }
        } else {
          console.log("No skills found or API error");
        }
      } catch (error) {
        console.error('Lỗi khi tải kỹ năng:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setSaveStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tech_skills: techSkills,
          soft_skills: softSkills
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSaveMessage('Đã lưu kỹ năng thành công!');
        setSaveStatus('success');
        setTimeout(() => {
          setSaveMessage('');
          setSaveStatus(null);
        }, 3000);
      } else {
        setSaveMessage(`Lỗi: ${data.message || 'Không thể lưu kỹ năng'}`);
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveMessage('Lỗi kết nối đến server');
      setSaveStatus('error');
      console.error('Lỗi khi lưu kỹ năng:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-8">
          <div className="inline-block bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
            Năng lực chuyên môn
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kỹ năng chuyên môn
          </h1>
          <p className="text-gray-600">
            Thêm các kỹ năng và công nghệ bạn thành thạo để tiếp cận dự án phù hợp
          </p>
        </header>
        
        <div className="bg-white rounded-xl p-8 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="large" />
              <p className="ml-3 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <FaCode className="text-teal-500 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Kỹ năng kỹ thuật
                  </h2>
                </div>
                <textarea
                  value={techSkills}
                  onChange={(e) => setTechSkills(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none min-h-32"
                  placeholder="Liệt kê các kỹ năng kỹ thuật của bạn (ví dụ: React, JavaScript, Python, SQL, Docker...)"
                />
              </div>
              
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaCode className="text-teal-500 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Kỹ năng mềm
                  </h2>
                </div>
                <textarea
                  value={softSkills}
                  onChange={(e) => setSoftSkills(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none min-h-32"
                  placeholder="Liệt kê các kỹ năng mềm của bạn (ví dụ: Giao tiếp, Quản lý thời gian, Làm việc nhóm...)"
                />
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
                      <span>Lưu thay đổi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Freelancer Profile Generator</p>
        </footer>
      </div>
    </div>
  );
}