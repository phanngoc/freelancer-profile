import CoverLetterForm from '../components/CoverLetterForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Cover Letter Generator <span className="text-blue-600">cho Freelancer</span>
          </h1>
          <p className="text-blue-700">
            Tạo cover letter chuyên nghiệp dựa trên mô tả công việc để gây ấn tượng với khách hàng tiềm năng
          </p>
        </header>
        
        <CoverLetterForm />
        
        <footer className="mt-16 text-center text-blue-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Freelancer Profile Generator</p>
        </footer>
      </div>
    </div>
  );
} 