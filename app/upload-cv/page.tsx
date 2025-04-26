'use client'

import React, { useState, useRef } from 'react';

interface ExtractedCV {
  tech_skills?: string;
  soft_skills?: string;
  work_experience?: string;
  projects?: string;
  education?: string;
}

export default function UploadCVPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedCV | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.[0]) {
      setUploadMessage('Vui lòng chọn file PDF để tải lên');
      return;
    }
    
    const file = fileInputRef.current.files[0];
    if (!file.name.endsWith('.pdf')) {
      setUploadMessage('Chỉ chấp nhận file PDF');
      return;
    }
    
    setIsUploading(true);
    setUploadMessage('Đang xử lý CV...');
    
    const formData = new FormData();
    formData.append('cv_file', file);
    
    try {
      const response = await fetch('http://localhost:8000/upload-cv', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setExtractedData(data);
        setUploadMessage('Đã xử lý CV thành công!');
      } else {
        const error = await response.json();
        setUploadMessage(`Lỗi: ${error.detail || 'Không thể xử lý CV'}`);
      }
    } catch (error) {
      setUploadMessage('Lỗi kết nối đến server');
      console.error('Lỗi khi tải lên CV:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }
      } else {
        setUploadMessage('Chỉ chấp nhận file PDF');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Upload CV
          </h1>
          <p className="text-gray-600">
            Tải lên CV của bạn để trích xuất thông tin
          </p>
        </header>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleUpload}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tải lên file CV</h2>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                onDragOver={handleFileDragOver}
                onDrop={handleFileDrop}
              >
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    Kéo và thả file PDF vào đây hoặc{' '}
                    <span 
                      className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                      onClick={handleFileSelect}
                    >
                      chọn tệp
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Chỉ chấp nhận file PDF</p>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={() => setUploadMessage('')}
                  />
                </div>
              </div>
              
              {uploadMessage && (
                <p className={`mt-2 text-center ${uploadMessage.startsWith('Lỗi') ? 'text-red-500' : uploadMessage === 'Đang xử lý CV...' ? 'text-blue-500' : 'text-green-500'}`}>
                  {uploadMessage}
                </p>
              )}
            </div>
            
            {extractedData && (
              <div className="mt-8 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin đã trích xuất</h2>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Kỹ năng kỹ thuật</h3>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-gray-800">{extractedData.tech_skills || 'Không có thông tin'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Kỹ năng mềm</h3>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-gray-800">{extractedData.soft_skills || 'Không có thông tin'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Kinh nghiệm làm việc</h3>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-gray-800 whitespace-pre-line">{extractedData.work_experience || 'Không có thông tin'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Dự án</h3>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-gray-800 whitespace-pre-line">{extractedData.projects || 'Không có thông tin'}</p>
                    </div>
                  </div>
                  
                  {extractedData.education && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Học vấn</h3>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <p className="text-gray-800 whitespace-pre-line">{extractedData.education}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="text-right">
              <button
                type="submit"
                disabled={isUploading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isUploading ? 'Đang xử lý...' : 'Xử lý CV'}
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