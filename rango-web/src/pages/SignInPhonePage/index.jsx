import { linkWithPhoneNumber, RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/ApiConfig";
import './SignInPhonePage.css';
import MessageComponent from "../../components/MessageComponent";
import { useAuth } from "../../components/AuthContext";
import LoadingCustom from "../../components/LoadingCustom";
import AddressModal from "../../components/AddressModal";
import { useUser } from "../../components/UserProvider";
import OTPInput from "../../components/OTPInput";

const SignInPhonePage = () => {
    const {fetchUser,user,noAddress}=useUser();
    const { setUser,setIsAuthenticated } = useAuth();
    const [phoneNumber,setPhoneNumber] = useState('');
    const [otp,setOtp] = useState('');
    const [showOtpSection,setShowOTPSection] = useState(false);
    const [confirmationResult, setConfirmationResult]= useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isValid, setIsValid ] = useState(true);
    const [openAddressModal, setOpenAddressModal] = useState(false);

    const [message, setMessage] = useState(null);

    const navigator = useNavigate();

    useEffect(()=>{
        localStorage.removeItem("idToken");
        localStorage.removeItem("idRemember");
        localStorage.removeItem("isAuthenticated");
    },[])

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage(null);
        }, 3000); // A mensagem desaparece após 3 segundos
    };
    const onVerifyRECaptcha = () => {
        if(!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                'recaptcha-container',
                {
                    'size': 'invisible',
                    'callback': (res) => {
                        sendOTPCode()
                    },
                    'expired-callback': (e) => {
                        console.log("expired-callback: " + e.toString())
                        // showMessage("error","Erro de ReCAPTCH, por favor reinicie a página")
                    }
                }
            )
        }
    }
    const sendOTPCode = async () => {
        const unformattedPhone = `+55${phoneNumber.replace(/[()-\s]/g, '')}`;

        setIsLoading(true);
        try {
            onVerifyRECaptcha();
            if (!window.recaptchaVerifier) {
                throw new Error("reCAPTCHA não foi inicializado corretamente");
            }
            const appVerifier = window.recaptchaVerifier;

            const confirmation = await linkWithPhoneNumber(auth.currentUser,unformattedPhone,appVerifier)
            setConfirmationResult(confirmation);
            setShowOTPSection(true);
        } catch (e) {
            if (e.toString().indexOf("provider-already-linked") > 0 ) {
                if(auth.currentUser.phoneNumber != unformattedPhone) {
                    showMessage("error","Erro: Número de telefone diferente do usuário cadastrado");
                } else {
                    if (!window.recaptchaVerifier) {
                        throw new Error("reCAPTCHA não foi inicializado corretamente");
                    }
                    const appVerifier = window.recaptchaVerifier;
                    const confirmationAlready = await signInWithPhoneNumber(auth,unformattedPhone,appVerifier);
                    setConfirmationResult(confirmationAlready);
                    setShowOTPSection(true)
                }
            } else if(e.toString().indexOf("auth/too-many-requests") > 0) {
                showMessage("error","Erro: Cota de SMS do servidor atingido. Por favor volte amanhã");
            } else {
                showMessage("error","Erro: " + e.toString());
            }
            
        } finally {
            setIsLoading(false);
        }
    }
    const formatPhone = (value) => {
        // Remove tudo que não for número
        const cleaned = value.replace(/\D/g, '');

        // Formata o valor com parênteses e traço
        let formatted = cleaned;

        if (cleaned.length > 2) {
            formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2)}`;
        }
        if (cleaned.length > 7) {
            formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`;
        }

        return formatted;
    };
    const handleChange = (e) => {
        const rawValue = e.target.value;
        const formattedValue = formatPhone(rawValue);
        if(formattedValue.length < 14) {
            setIsValid(false)
        } else {
            setIsValid(true)
        }
        setPhoneNumber(formattedValue);
    };
    const register = async () => {
        try {
            const res = await api.post("/auth/register");
            if(res.status == 200) {
                const idRemember = res.data.id;
                localStorage.setItem("idRemember",idRemember);

                await fetchUser();
                return res.data.hasEndereco;
            }
            return false;
        } catch(e) {
            localStorage.removeItem("idToken");
            localStorage.removeItem("idRemember");
            await signOut(auth);
            navigator("/entrar/1");
        }
    }
    const onOTPVerify = async () => {
        setIsLoading(true);
        try {
            await confirmationResult.confirm(otp);
            
            const currentUser = auth.currentUser;
            setUser(currentUser);
            const idToken = await currentUser.getIdToken(true);
            
            localStorage.setItem("idToken", idToken);

            const hasAddress = await register();
            if(!hasAddress) {
                setOpenAddressModal(true);
            } else {
                setIsAuthenticated(true);
                localStorage.setItem("isAuthenticated",'true');
                navigator("/home"); // Redireciona para a página inicial
            }
        } catch(e) {
            if( e.message == "Firebase: Error (auth/invalid-verification-code)." ) {
                showMessage("error","Erro: código inválido");
            } else {
                localStorage.clear();
                await signOut(auth);
                
                navigator("/entrar/1");
            }
        } finally {
          setIsLoading(false);
        }
    };

    return(
        <>
        {openAddressModal && <AddressModal setOpenAddressModal={setOpenAddressModal} openAddressModal={openAddressModal} />}
        {message && <MessageComponent type={message.type} text={message.text} />}
        <div id='recaptcha-container'></div>
        <div className="sign-in-phone-page">
        <img id="rango-banner" src="/assets/img/rango-banner.jpeg"/>
            <div className="sign-in-phone-container">
                <Link to="/" className="back-btn"><i className="fa fa-angle-left"></i></Link>
                {!showOtpSection &&
                <div className="phone-number-sign-in">
                    
                <p>Informe o número do seu celular para continuar</p>
                <div className="phone-number-wrapper">
                    <div className="country-area">
                        <img src="/assets/img/brazil.png" alt="brasil bandeira" width={30} height={30}/>
                        <p>+55</p>
                    </div>
                    <div className="phone-number-input-wrapper">
                        <input
                        style={{"borderColor":isValid?"var(--border)":"var(--error)"}}
                        placeholder="Informe o seu número de celular"
                        value={phoneNumber} 
                        onChange={handleChange} 
                        maxLength="15" /> 
                        <span>{!isValid && "Número de celular inválido"}</span>
                    </div>
                    </div>
                    <button style={{"pointerEvents":(isValid && phoneNumber != '' && !isLoading)  ? "visible" : "none",
                    "opacity":(isValid && phoneNumber != '' && !isLoading) ? "1" : "0.6"
                }} onClick={sendOTPCode}>{isLoading ? <LoadingCustom/>:"Enviar Código"}</button>
                </div> 
                }
               
                {showOtpSection &&
                <div className="otp-phone-number-sign-in">
                    <p>Digite o código de 6 dígitos que enviamos por SMS para o</p>
                    <p className="phone-or-email-sign-in">{phoneNumber}</p>
                    <OTPInput onChange={setOtp} />
                    <button style={{"opacity": !isLoading ? "1" : "0.6", "pointerEvents": !isLoading ? "visible":"none"}} onClick={onOTPVerify}>{isLoading ? <LoadingCustom/> : "Continuar"}</button>
                </div>
                }
            </div>
        </div>
        </>
    );
};

export default SignInPhonePage;