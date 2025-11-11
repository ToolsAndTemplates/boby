'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface AdminNavProps {
  user: {
    name: string
    email: string
    role: string
  }
}

export default function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/feedbacks', label: 'Feedbacks', icon: '💬' },
    { href: '/admin/branches', label: 'Branches', icon: '🏢' },
    { href: '/admin/branches-sync', label: 'Sync', icon: '🔄' },
    { href: '/admin/map', label: 'Map', icon: '🗺️' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { href: '/admin/feedback-links', label: 'Links', icon: '🔗' },
    { href: '/admin/custom-fields', label: 'Fields', icon: '📝' },
    ...(user.role === 'ADMIN' ? [{ href: '/admin/users', label: 'Users', icon: '👥' }] : []),
  ]

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              href="/admin/dashboard"
              className="text-xl font-bold text-white hover:text-blue-100 transition flex items-center gap-2"
            >
              <span className="text-2xl">🏦</span>
              <span className="hidden sm:inline">Feedback System</span>
              <span className="sm:hidden">FBS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  pathname === item.href
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-white hover:bg-blue-500'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* User Dropdown (Desktop) */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-blue-500 transition"
              >
                <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden xl:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-blue-200">{user.role}</div>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <div className="mt-1 inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {user.role}
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Sign Out (visible on small screens) */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="md:hidden px-3 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
            >
              🚪
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-blue-500 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  pathname === item.href
                    ? 'bg-white text-blue-700'
                    : 'text-white hover:bg-blue-500'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Mobile User Info */}
            <div className="md:hidden mt-4 pt-4 border-t border-blue-500">
              <div className="px-3 py-2 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-blue-200">{user.email}</div>
                  </div>
                </div>
                <div className="inline-block px-2 py-1 bg-blue-800 text-blue-100 text-xs rounded-full">
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click Outside to Close Dropdowns */}
      {(userMenuOpen || mobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false)
            setMobileMenuOpen(false)
          }}
        />
      )}
    </nav>
  )
}
