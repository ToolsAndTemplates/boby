'use client'

import { useState } from 'react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏦</span>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Bank Feedback
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition">How It Works</a>
              <a href="#stats" className="text-gray-600 hover:text-blue-600 transition">Stats</a>
              <a href="/admin" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                Admin
              </a>
              <a href="/feedback" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                Give Feedback
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
                Features
              </a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
                How It Works
              </a>
              <a href="#stats" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition">
                Stats
              </a>
              <a href="/admin" className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                Admin Dashboard
              </a>
              <a href="/feedback" className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center mx-4">
                Give Feedback
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24 md:pt-32 md:pb-28 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 rounded-full text-blue-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="hidden xs:inline">Real-time Feedback Collection</span>
              <span className="xs:hidden">Real-time</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              <span className="block">Transform Your</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Customer Experience
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              Modern, intelligent feedback system designed for Bank of Baku.
              Collect, analyze, and act on customer insights across all branches in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="/feedback"
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                <span>Submit Feedback</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/admin"
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-50 border-2 border-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Admin Dashboard
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-gray-500 px-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Mobile Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Simple, fast, and effective feedback collection in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200"></div>

            {/* Step 1 */}
            <div className="relative text-center px-4">
              <div className="inline-flex w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full items-center justify-center mb-4 sm:mb-6 shadow-lg text-white text-xl sm:text-2xl font-bold relative z-10">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Select Branch</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Choose your branch location from our interactive map or list
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center px-4">
              <div className="inline-flex w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full items-center justify-center mb-4 sm:mb-6 shadow-lg text-white text-xl sm:text-2xl font-bold relative z-10">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Rate & Comment</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Rate your experience and share detailed feedback with us
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center px-4">
              <div className="inline-flex w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full items-center justify-center mb-4 sm:mb-6 shadow-lg text-white text-xl sm:text-2xl font-bold relative z-10">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Submit & Track</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Submit instantly and help us improve our services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to collect and analyze customer feedback effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 hover:shadow-2xl transition-all duration-300 border border-blue-200">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Collection</h3>
              <p className="text-gray-600">
                Collect feedback instantly with our easy-to-use mobile-friendly interface
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 hover:shadow-2xl transition-all duration-300 border border-green-200">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-600">
                Visualize trends and insights with beautiful interactive charts
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 hover:shadow-2xl transition-all duration-300 border border-purple-200">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🗺️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Branch Management</h3>
              <p className="text-gray-600">
                Track performance across all 93 locations with detailed analytics
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 hover:shadow-2xl transition-all duration-300 border border-orange-200">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Optimized</h3>
              <p className="text-gray-600">
                Perfect experience on any device - phone, tablet, or desktop
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 hover:shadow-2xl transition-all duration-300 border border-pink-200">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Bank-grade security with GDPR compliance and data encryption
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 hover:shadow-2xl transition-all duration-300 border border-indigo-200">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📎</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">File Attachments</h3>
              <p className="text-gray-600">
                Upload photos and documents to provide more context
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">Trusted by Bank of Baku</h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 px-4">Real numbers, real impact</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-1 sm:mb-2">93</div>
              <div className="text-blue-100 text-sm sm:text-base md:text-lg font-medium">Total Locations</div>
              <div className="text-blue-200 text-xs sm:text-sm mt-1 hidden sm:block">Branches, ATMs & Service Points</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-1 sm:mb-2">24/7</div>
              <div className="text-blue-100 text-sm sm:text-base md:text-lg font-medium">Always Available</div>
              <div className="text-blue-200 text-xs sm:text-sm mt-1 hidden sm:block">Round-the-clock accessibility</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-1 sm:mb-2">
                <span className="text-3xl sm:text-4xl">⚡</span>
              </div>
              <div className="text-blue-100 text-sm sm:text-base md:text-lg font-medium">Real-time</div>
              <div className="text-blue-200 text-xs sm:text-sm mt-1 hidden sm:block">Instant feedback processing</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-1 sm:mb-2">
                <span className="text-3xl sm:text-4xl">🔒</span>
              </div>
              <div className="text-blue-100 text-sm sm:text-base md:text-lg font-medium">100% Secure</div>
              <div className="text-blue-200 text-xs sm:text-sm mt-1 hidden sm:block">Bank-grade encryption</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 shadow-2xl text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Your Voice Matters
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-8 sm:mb-10 px-2">
              Help us serve you better. Share your experience in less than 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="/feedback"
                className="group inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-white text-blue-600 text-base sm:text-lg font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                <span>Submit Feedback Now</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/admin"
                className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-transparent text-white text-base sm:text-lg font-semibold rounded-xl hover:bg-white/10 border-2 border-white transform hover:scale-105 transition-all duration-200"
              >
                View Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🏦</span>
                <span className="text-xl font-bold">Bank Feedback System</span>
              </div>
              <p className="text-gray-400 mb-4">
                Modern feedback collection platform designed for Bank of Baku to enhance customer experience across all branches.
              </p>
              <div className="flex gap-4">
                <span className="text-gray-400 text-sm">© 2024 Bank of Baku</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/feedback" className="text-gray-400 hover:text-white transition">Submit Feedback</a></li>
                <li><a href="/admin" className="text-gray-400 hover:text-white transition">Admin Dashboard</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">System Stats</h3>
              <ul className="space-y-2 text-gray-400">
                <li>🏢 22 Branches</li>
                <li>🏧 36 ATMs</li>
                <li>📍 35 Service Points</li>
                <li>🌐 Real-time Processing</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>Built with modern technology for optimal performance and security</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
