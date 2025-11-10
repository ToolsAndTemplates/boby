export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Feedback Collection System</h1>
        <p className="text-gray-600 mb-8">
          Bank branch feedback collection and management system
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/admin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Admin Panel
          </a>
          <a
            href="/feedback"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Submit Feedback
          </a>
        </div>
      </div>
    </main>
  )
}
