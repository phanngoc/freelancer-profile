'use client';

import { useState } from 'react';
import { Spinner } from './Spinner';

interface FormData {
  job_description: string;
  freelancer_skills: string;
  experience_level: string;
  tone: string;
  additional_info: string;
}

const INITIAL_FORM_DATA: FormData = {
  job_description: '',
  freelancer_skills: '',
  experience_level: '',
  tone: 'Professional',
  additional_info: '',
};

const TONE_OPTIONS = [
  'Professional',
  'Friendly',
  'Enthusiastic',
  'Formal',
  'Creative',
];

export default function CoverLetterForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.job_description.trim()) {
      setError('Vui lòng nhập mô tả công việc');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Không thể tạo cover letter');
      }
      
      const data = await response.json();
      setCoverLetter(data.cover_letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    alert('Đã sao chép vào clipboard!');
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setCoverLetter('');
    setError(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-blue-100 p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">Thông tin</h2>
          
          <div className="mb-6">
            <label htmlFor="job_description" className="block text-blue-700 font-medium mb-2">
              Mô tả công việc <span className="text-red-500">*</span>
            </label>
            <textarea
              id="job_description"
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              placeholder="Dán mô tả công việc từ nền tảng freelance hoặc khách hàng của bạn..."
              className="w-full p-3 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 min-h-48"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="freelancer_skills" className="block text-blue-700 font-medium mb-2">
              Kỹ năng của bạn
            </label>
            <textarea
              id="freelancer_skills"
              name="freelancer_skills"
              value={formData.freelancer_skills}
              onChange={handleChange}
              placeholder="Mô tả kỹ năng và chuyên môn của bạn..."
              className="w-full p-3 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 min-h-24"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="experience_level" className="block text-blue-700 font-medium mb-2">
                Kinh nghiệm
              </label>
              <input
                type="text"
                id="experience_level"
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                placeholder="Ví dụ: 5 năm kinh nghiệm"
                className="w-full p-3 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            
            <div>
              <label htmlFor="tone" className="block text-blue-700 font-medium mb-2">
                Giọng điệu
              </label>
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                className="w-full p-3 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                {TONE_OPTIONS.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="additional_info" className="block text-blue-700 font-medium mb-2">
              Thông tin bổ sung
            </label>
            <textarea
              id="additional_info"
              name="additional_info"
              value={formData.additional_info}
              onChange={handleChange}
              placeholder="Thông tin thêm mà bạn muốn đề cập..."
              className="w-full p-3 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 min-h-24"
            />
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md border border-red-100">
              {error}
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 flex items-center justify-center shadow-none border border-blue-600"
            >
              {loading ? <Spinner /> : 'Tạo Cover Letter'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-6 border border-blue-200 rounded-md hover:bg-blue-100 active:bg-blue-200 transition-colors duration-150 text-blue-700 bg-white shadow-none"
            >
              Làm mới
            </button>
          </div>
        </form>
      </div>
      
      <div className="w-full md:w-1/2">
        <div className="bg-white rounded-lg border border-blue-100 p-6 h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-800">Cover Letter</h2>
            {coverLetter && (
              <button
                onClick={handleCopy}
                className="text-blue-600 hover:text-blue-800 active:text-blue-900 flex items-center gap-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Sao chép
              </button>
            )}
          </div>
          
          <div className="prose max-w-none min-h-96 bg-blue-50 p-4 rounded-md whitespace-pre-wrap border border-blue-100">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner size="large" />
                <p className="ml-3 text-blue-600">Đang tạo cover letter...</p>
              </div>
            ) : coverLetter ? (
              coverLetter
            ) : (
              <p className="text-blue-500 italic">
                Cover letter của bạn sẽ xuất hiện ở đây sau khi được tạo. Vui lòng nhập thông tin và nhấn &quot;Tạo Cover Letter&quot;.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 