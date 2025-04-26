import CoverLetterForm from '../components/CoverLetterForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <header className="mb-10">
            <div className="inline-block bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
              Công cụ đa năng
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Cover Letter Generator <span className="text-teal-600">cho Freelancer</span>
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Tạo cover letter chuyên nghiệp dựa trên mô tả công việc để gây ấn tượng với khách hàng tiềm năng
            </p>
          </header>
          
          <CoverLetterForm />
        </div>
        
        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Freelancer Profile Generator</p>
        </footer>
      </div>
    </div>
  );
}