import { useState } from "react";
import { LogOut, User } from "lucide-react";
import "./Header.css";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  userName?: string;
}

export default function Header({ userName }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (confirmed) {
      setIsLoggingOut(true);
      try {
        await logout();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Dashboard</h1>
      </div>

      <div className="header-right">
        <div className="user-info">
          <User size={20} className="user-icon" />
          <span className="user-name">{userName || "User"}</span>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Logout"
        >
          <LogOut size={18} />
          <span className="logout-text">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </header>
  );
}
