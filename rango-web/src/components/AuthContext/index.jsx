
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';


// Crie o contexto
const AuthContext = createContext();

// Crie o provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth,async (user) => {
        const storedAuthState = localStorage.getItem('isAuthenticated');
        if(storedAuthState === 'true') {
          if (user) {
            // O usuário está autenticado no Firebase, mas você pode adicionar lógica para verificar a segunda etapa
            const isPhoneVerified = user.phoneNumber != null /* lógica para verificar se o telefone foi verificado */;
            if (isPhoneVerified) {
              const idToken = await user.getIdToken(true);
              localStorage.setItem("idToken", idToken);
              setIsAuthenticated(true);
              localStorage.setItem('isAuthenticated', 'true');
            } else {
              setIsAuthenticated(false);
              localStorage.setItem('isAuthenticated', 'false');
            }
          }
        } else {
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      });
      
    
    // const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //   const emailRemember = localStorage.getItem("emailRemember");

    //   if (user != null && emailRemember != null && user.emailVerified && user.phoneNumber != null && emailRemember === user.email) {
    //     const idToken = await user.getIdToken(true);

    //     localStorage.setItem("idToken", idToken);
    //     setUser(user);
    //   } else {
    //     setUser(null);
    //   }

    //   setIsLoading(false);
    // });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated,setIsAuthenticated,user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Crie um hook para usar o AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
