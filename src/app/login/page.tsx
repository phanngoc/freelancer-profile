'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import type { AuthFormData } from '@/components/AuthForm';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: AuthFormData) => {
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('password', data.password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/token`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Đăng nhập thất bại');
      }

      const result = await response.json();
      
      // Lưu token vào localStorage
      localStorage.setItem('token', result.access_token);
      
      // Chuyển hướng về trang chủ
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Có lỗi xảy ra khi đăng nhập');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Freelancer Profile
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đăng nhập để quản lý hồ sơ của bạn
          </p>
        </div>

        <AuthForm mode="login" onSubmit={handleLogin} />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <a href="/register" className="font-medium text-teal-600 hover:text-teal-500">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 