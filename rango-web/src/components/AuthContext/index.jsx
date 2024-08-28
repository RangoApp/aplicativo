
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';


// Crie o contexto
const AuthContext = createContext();

// Crie o provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const emailRemember = localStorage.getItem("emailRemember");

      if (user != null && emailRemember != null && user.emailVerified && user.phoneNumber != null && emailRemember === user.email) {
        const idToken = await user.getIdToken(true);

        localStorage.setItem("idToken", idToken);
        setUser(user);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Crie um hook para usar o AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
