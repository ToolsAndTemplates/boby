import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Feedback Collection System',
  description: 'Bank branch feedback collection and management system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
