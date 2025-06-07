import { useState } from "react";
import { Button } from "../ui/button";
import { LogOut, Plus } from "lucide-react";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import { removeCookie } from "typescript-cookie";

const Navbar = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate()
  const Logout = async () => {
    const response = await axiosInstance.post("/api/auth/logout");
    if (response.status === 200) {
    //   window.location.href = "/auth";
    removeCookie('loggedin')
      navigate('/auth')
    }
  }
  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <span className="text-2xl font-[Pacifico]">CWJ Tasks</span>
        </div>
        <div className="flex items-center space-x-4">
       
          <Button onClick={Logout} variant="outline" className="flex items-center">
            <LogOut />
            Logout
          </Button>
        </div>
      </nav>
      {/* Uncomment when CreateTaskModal is implemented */}
      {/* <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      /> */}
    </>
  );
};

export default Navbar;