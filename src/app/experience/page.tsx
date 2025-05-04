'use client'

import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaProjectDiagram, FaCheck, FaSave, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { Spinner } from '../../components/Spinner';

interface Experience {
  id: number;
  work_experience: string;
  projects: string;
  created_at: string;
  updated_at: string;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [workExperience, setWorkExperience] = useState('');
  const [projects, setProjects] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/experience`);
      if (response.ok) {
        const responseJson = await response.json();
        setExperiences(responseJson.data || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin kinh nghiệm:', error);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setWorkExperience(exp.work_experience);
    setProjects(exp.projects);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setWorkExperience('');
    setProjects('');
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setSaveStatus(null);

    try {
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/experience/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/experience`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          work_experience: workExperience,
          projects: projects,
        }),
      });

      if (response.ok) {
        setSaveMessage(isEditing ? 'Đã cập nhật thông tin kinh nghiệm thành công!' : 'Đã lưu thông tin kinh nghiệm thành công!');
        setSaveStatus('success');
        setWorkExperience('');
        setProjects('');
        setEditingId(null);
        setIsEditing(false);
        fetchExperiences();
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa kinh nghiệm này?')) {
      return;
    }

    setIsDeleting(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/experience/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSaveMessage('Đã xóa kinh nghiệm thành công!');
        setSaveStatus('success');
        fetchExperiences(); // Refresh danh sách sau khi xóa
        setTimeout(() => {
          setSaveMessage('');
          setSaveStatus(null);
        }, 3000);
      } else {
        const error = await response.json();
        setSaveMessage(`Lỗi: ${error.detail || 'Không thể xóa kinh nghiệm'}`);
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveMessage('Lỗi kết nối đến server');
      setSaveStatus('error');
      console.error('Lỗi khi xóa kinh nghiệm:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="mx-auto px-3 py-5">
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

        {/* Danh sách kinh nghiệm dạng bảng */}
        <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kinh nghiệm làm việc
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dự án nổi bật
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cập nhật lần cuối
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-900">
                      {exp.work_experience}
                    </td>
                    <td className="px-6 py-4 whitespace-pre-line text-sm text-gray-900">
                      {exp.projects}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(exp.updated_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit className="inline-block mr-1" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        disabled={isDeleting === exp.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting === exp.id ? (
                          <>
                            <Spinner size="small" color="primary" />
                            <span className="ml-2">Đang xóa...</span>
                          </>
                        ) : (
                          <>
                            <FaTrash className="inline-block mr-1" />
                            <span>Xóa</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Form thêm mới/chỉnh sửa */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <FaPlus className="mr-2 text-teal-500" />
            {isEditing ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm mới'}
          </h2>
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
            
            <div className="mt-8 flex justify-end items-center space-x-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
              )}
              
              {saveMessage && (
                <div className={`px-4 py-2 rounded-lg ${
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
                    <span>{isEditing ? 'Cập nhật' : 'Lưu thông tin'}</span>
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