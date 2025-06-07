import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AuthLayout from "./Layouts/auth-layout"
import LoginPage from "./app/auth/login-page"
import ReactQueryProvider from "./Providers/react-query"
import { UserContextProvider } from "./context/user-context"
import { Toaster } from "sonner"
import EmailVerify from "./app/auth/email-verify"
import MainLayout from "./Layouts/main-layout"
import Home from "./app/Home"

function App() {

  const router = createBrowserRouter([
    {
      path : "auth/",
      element : <AuthLayout />,
      children : [
        {
          path : '',
          element : <LoginPage />
        },
        {
          path : 'verify/:token',
          element : <EmailVerify />
        }
      ]
    },
    {
      path : "/",
      element : <MainLayout />,
      children : [
        {
          path : "",
          element : <Home />
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
