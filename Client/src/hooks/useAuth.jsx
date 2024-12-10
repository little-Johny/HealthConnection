import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
