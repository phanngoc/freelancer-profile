'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import type { AuthFormData } from '@/components/AuthForm';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: AuthFormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Đăng ký thất bại');
      }

      // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Có lỗi xảy ra khi đăng ký');
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
            Tạo tài khoản mới để bắt đầu
          </p>
        </div>

        <AuthForm mode="register" onSubmit={handleRegister} />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <a href="/login" className="font-medium text-teal-600 hover:text-teal-500">
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 