import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Projects from '@/components/pages/Projects'
import TestCases from '@/components/pages/TestCases'
import Bugs from '@/components/pages/Bugs'
import Reports from '@/components/pages/Reports'
import ProjectDetail from '@/components/pages/ProjectDetail'
import TestCaseDetail from '@/components/pages/TestCaseDetail'
import BugDetail from '@/components/pages/BugDetail'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="test-cases" element={<TestCases />} />
          <Route path="test-cases/:id" element={<TestCaseDetail />} />
          <Route path="bugs" element={<Bugs />} />
          <Route path="bugs/:id" element={<BugDetail />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-50"
        toastClassName="bg-white shadow-lg rounded-lg"
      />
    </>
  )
}

export default App