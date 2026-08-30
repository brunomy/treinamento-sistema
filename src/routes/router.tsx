import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/RootLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import PlayerPage from '@/pages/PlayerPage'
import RedirectPage from '@/pages/RedirectPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'treino/:guideId/:mode', element: <PlayerPage /> },
      { path: 'ir', element: <RedirectPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
