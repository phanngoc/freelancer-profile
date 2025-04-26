'use client';

import React, { useState, useRef } from 'react';
import { FaUpload, FaFile, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { Spinner } from '../../components/Spinner';

export default function UploadCVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadMessage('');
      setUploadStatus(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadMessage('');
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('Vui lòng chọn file CV trước khi tải lên');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadMessage('');
    setUploadStatus(null);

    // Kiểm tra loại file
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadMessage('Chỉ hỗ trợ file PDF và Word (.doc, .docx)');
      setUploadStatus('error');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('cv_file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload-cv`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadMessage('CV đã được tải lên thành công!');
        setUploadStatus('success');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const error = await response.json();
        setUploadMessage(`Lỗi: ${error.detail || 'Không thể tải lên CV'}`);
        setUploadStatus('error');
      }
    } catch (error) {
      setUploadMessage('Lỗi kết nối đến server');
      setUploadStatus('error');
      console.error('Lỗi khi tải lên CV:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-8">
          <div className="inline-block bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
            Hồ sơ chuyên nghiệp
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tải lên CV của bạn
          </h1>
          <p className="text-gray-600">
            Tải lên CV hoặc hồ sơ của bạn để phân tích và tạo hồ sơ ứng viên tự động
          </p>
        </header>
        
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
              file ? 'border-teal-300 bg-teal-50' : 'border-gray-200 hover:border-teal-200 hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center">
              {file ? (
                <>
                  <div className="w-16 h-16 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center mb-4">
                    <FaFile className="text-3xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">
                    {file.name}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-teal-600 text-sm">
                    Nhấp vào đây để chọn file khác
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaUpload className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Kéo và thả CV của bạn vào đây
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Hoặc nhấp vào đây để tìm kiếm file trên máy tính của bạn
                  </p>
                  <p className="text-gray-400 text-sm">
                    Hỗ trợ định dạng PDF và Word (.doc, .docx)
                  </p>
                </>
              )}
            </div>
          </div>
          
          {uploadMessage && (
            <div className={`mt-6 px-4 py-3 rounded-lg flex items-center ${
              uploadStatus === 'success' 
                ? 'bg-green-50 text-green-600 border border-green-100' 
                : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {uploadStatus === 'success' ? (
                <FaCheck className="mr-2" />
              ) : (
                <FaExclamationTriangle className="mr-2" />
              )}
              <p>{uploadMessage}</p>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || !file}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                !file 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
            >
              {isUploading ? (
                <>
                  <Spinner size="small" color="white" />
                  <span className="ml-2">Đang tải lên...</span>
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" />
                  <span>Tải lên CV</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Freelancer Profile Generator</p>
        </footer>
      </div>
    </div>
  );
}