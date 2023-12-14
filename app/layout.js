import { Open_Sans } from 'next/font/google'
import './globals.css'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'UniVibe',
  description: 'The College Social Networking platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}

