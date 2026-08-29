import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/RootLayout'
import AboutPage from '@/pages/AboutPage'
import CounterPage from '@/pages/CounterPage'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'contador', element: <CounterPage /> },
      { path: 'sobre', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
