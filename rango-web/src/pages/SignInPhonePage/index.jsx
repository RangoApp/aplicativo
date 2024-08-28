import { deleteUser, fetchSignInMethodsForEmail, linkWithPhoneNumber, RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/ApiConfig";
import './SignInPhonePage.css';
import MessageComponent from "../../components/MessageComponent";
import { useAuth } from "../../components/AuthContext";

const SignInPhonePage = () => {

    const { setUser } = useAuth();
    const [phoneNumber,setPhoneNumber] = useState('');
    const [otp,setOtp] = useState('');
    const [showOtpSection,setShowOTPSection] = useState(false);
    const [confirmationResult, setConfirmationResult]= useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigator = useNavigate();
    const [isValid, setIsValid ] = useState(true);

    const [message, setMessage] = useState(null);

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
                    'expired-callback': () => {}
                }
            )
        }
    }
    const sendOTPCode = async () => {
        const unformattedPhone = `+55${phoneNumber.replace(/[()-\s]/g, '')}`;

        setIsLoading(true);
        try {
            onVerifyRECaptcha();
            const appVerifier = window.recaptchaVerifier;

            console.log(unformattedPhone)
            const confirmation = await linkWithPhoneNumber(auth.currentUser,unformattedPhone,appVerifier)
            setConfirmationResult(confirmation);
            setShowOTPSection(true);
        } catch (e) {
            if (e.toString().indexOf("provider-already-linked") > 0 ) {

                if(auth.currentUser.phoneNumber != unformattedPhone) {
                    showMessage("error","Erro: Número de telefone diferente do usuário cadastrado");
                } else {
                    const appVerifier = window.recaptchaVerifier;
                    const confirmationAlready = await signInWithPhoneNumber(auth,unformattedPhone,appVerifier);
                    setConfirmationResult(confirmationAlready);
                    setShowOTPSection(true)
                }
               
            } else {
                showMessage("error","Erro de reCAPTCH: Por favor reinicie a página e tente novamente");
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

    const onOTPVerify = async () => {
        setIsLoading(true);
        try {
          await confirmationResult.confirm(otp);
          const currentUser = auth.currentUser;
          const idToken = await currentUser.getIdToken(true);
         
          localStorage.setItem("refreshToken",currentUser.stsTokenManager.refreshToken);
          localStorage.setItem("idToken", idToken);
          localStorage.setItem("emailRemember",currentUser.email);
      
          var res = await api.post("/auth/register");
          var idRemember = res.data;
          localStorage.setItem("idRemember",idRemember); 
            setUser(currentUser);
          navigator("/home"); // Redireciona para a página inicial
        } catch(e) {
            await deleteUser(auth.currentUser);
            
            navigator("/entrar/1");
        } finally {
          setIsLoading(false);
        }
    };

    return(
        <>
        {message && <MessageComponent type={message.type} text={message.text} />}
        <div id='recaptcha-container'></div>
        <div className="sign-in-phone-page">
            <div className="sign-in-phone-container">
                <Link to="/" className="back-btn"><i className="fa fa-angle-left"></i></Link>
                {!showOtpSection &&
                <div className="phone-number-sign-in">
                    
                <p>Informe o número do seu celular para continuar</p>
                <div className="phone-number-wrapper">
                    <div className="country-area">
                        <img />
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
                    <button style={{"pointerEvents":isValid && phoneNumber != '' ? "visible" : "none",
                    "opacity":isValid && phoneNumber != ''? "1" : "0.6"
                }} onClick={sendOTPCode}>Enviar Código</button>
                </div> 
                }
               
                {showOtpSection &&
                <div className="otp-phone-number-sign-in">
                    <p>Digite o código de 6 dígitos que enviamos por SMS para o</p>
                    <p className="phone-or-email-sign-in">{phoneNumber}</p>
                    <input type="number" maxLength={6} value={otp} onChange={e=> setOtp(e.target.value)}/>
                    <button onClick={onOTPVerify}>Continuar</button>
                </div>
                }
            </div>
        </div>
        </>
    );
};

export default SignInPhonePage;