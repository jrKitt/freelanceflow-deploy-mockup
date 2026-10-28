'use client'
import { AuthProvider } from '../Authentication/AuthenticationContext'
import { Toaster } from '../components/ui/sonner'
import { ThemeProvider } from 'next-themes'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
      <AuthProvider>
        {children}
        <Toaster richColors closeButton />
      </AuthProvider>
    </ThemeProvider>
  )
}
