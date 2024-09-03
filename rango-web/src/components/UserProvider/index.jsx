import { createContext, useContext, useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useAuth } from "../AuthContext";

// Criação do contexto
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const {isAuthenticated}  = useAuth()
    const [user, setUser] = useState(null);
    const [noAddress,setNoAddress] = useState(true);
    const [getSelecionado,setSelecionado] = useState(null);

    const fetchUser = async () => {
        const idStorage = localStorage.getItem("idRemember");

        if(idStorage) {
            try {
                console.log(idStorage)
                const res = await api.get("/users/" + idStorage);
                if(res.status==200) {
                   
                    const userApi = res.data;
                    setUser(userApi);
                    if(userApi.enderecos.length == 0) {
                        setNoAddress(true);
                    } else {
                        setNoAddress(false);

                         // Filtrar o endereço selecionado
                        const selected = userApi.enderecos.find(address => address.selecionado === true);
                        setSelecionado(selected || null); // Armazena o endereço selecionado ou null se não houver
                    }
                }
            } catch(e) {
                console.log(e)
            }
        }
    };

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ user, fetchUser, noAddress, setNoAddress, getSelecionado}}>
      {children}
    </UserContext.Provider>
  );
};