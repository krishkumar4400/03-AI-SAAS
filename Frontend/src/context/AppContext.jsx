import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppProvider.jsx";

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  const value = {
    axios,
    navigate,
    token,
    setToken,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
