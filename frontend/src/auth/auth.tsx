// src/context/AuthContext.tsx
import {
    createContext,
    useState,
    useEffect,
    useContext,
} from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_AUTH_HOST;

axios.defaults.withCredentials = true;

export type AuthContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    isLoading: true,
    checkAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // check if user is authenticated
    // generate accessToken from refreshToken
    // verifying user
    const checkAuth = async () => {
        try {
            // Only call /verifyingToken, let backend handle refresh logic
            const res = await axios.post(`${backendUrl}/verifyingToken`);
            setIsAuthenticated(res.data.valid === true);
        } catch (err) {
            console.error("Auth check failed", err);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };
    // checking if access token is valid
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                isLoading,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// custom hook for checking authentication

export const useAuth = () => {
    return useContext(AuthContext);
};
