'use client';

import React, { useState, useEffect } from 'react';
import { FaCode, FaPlusCircle, FaTimesCircle, FaSave, FaCheck } from 'react-icons/fa';
import { Spinner } from '../../components/Spinner';

export default function SkillsPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    // Tải kỹ năng hiện có
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:8000/skills');
        if (response.ok) {
          const data = await response.json();
          setSkills(data.skills || []);
        }
      } catch (error) {
        console.error('Lỗi khi tải kỹ năng:', error);
      }
    };

    fetchSkills();
  }, []);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setSaveStatus(null);

    try {
      const response = await fetch('http://localhost:8000/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills,
        }),
      });

      if (response.ok) {
        setSaveMessage('Đã lưu kỹ năng thành công!');
        setSaveStatus('success');
        setTimeout(() => {
          setSaveMessage('');
          setSaveStatus(null);
        }, 3000);
      } else {
        const error = await response.json();
        setSaveMessage(`Lỗi: ${error.detail || 'Không thể lưu kỹ năng'}`);
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
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <FaCode className="text-teal-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Quản lý kỹ năng
                </h2>
              </div>
              
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none"
                  placeholder="Thêm kỹ năng mới (ví dụ: React, Node.js, UI/UX Design)"
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-5 py-3 bg-teal-500 text-white rounded-r-lg hover:bg-teal-600 focus:outline-none flex items-center"
                >
                  <FaPlusCircle className="mr-2" />
                  Thêm
                </button>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-100"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                          aria-label="Remove skill"
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Bạn chưa thêm kỹ năng nào. Thêm kỹ năng để hoàn thiện hồ sơ của mình.
                  </p>
                )}
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
                    <span>Lưu thay đổi</span>
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