import CoverLetterForm from '../components/CoverLetterForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Cover Letter Generator <span className="text-indigo-600">cho Freelancer</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Tạo cover letter chuyên nghiệp dựa trên mô tả công việc để gây ấn tượng với khách hàng tiềm năng
          </p>
        </header>
        
        <CoverLetterForm />
        
        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Cover Letter Generator - Công cụ tạo cover letter cho freelancer</p>
        </footer>
      </div>
    </main>
  );
} 