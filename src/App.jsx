import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'

// Lazy load heavy components for better initial load performance
const Landing = lazy(() => import('./pages/Landing'))
const Story = lazy(() => import('./pages/Story'))
const About = lazy(() => import('./pages/About'))

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/story" element={<Story />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
