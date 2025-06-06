import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AuthLayout from "./Layouts/auth-layout"
import LoginPage from "./app/auth/login-page"
import ReactQueryProvider from "./Providers/react-query"
import { UserContextProvider } from "./context/user-context"
import { Toaster } from "./components/ui/sonner"

function App() {

  const router = createBrowserRouter([
    {
      path : "auth/",
      element : <AuthLayout />,
      children : [
        {
          path : '',
          element : <LoginPage />
        }
      ]
    }
  ])


  return (
  <>

  <ReactQueryProvider>
  <UserContextProvider>
  <RouterProvider router={router} />

  </UserContextProvider>
  <Toaster />
  </ReactQueryProvider>
  </>
  )
}

export default App
