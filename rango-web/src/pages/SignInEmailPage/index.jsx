import { useRef, useState } from "react";
import api from "../../config/ApiConfig";
import { Link, useNavigate } from "react-router-dom";
import { signInWithCustomToken, signInWithPhoneNumber, signInWithRedirect } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import MessageComponent from "../../components/MessageComponent";

const SignInEmailPage = () => {
    
    const [isLoading, setIsLoading] = useState(true);
    const [otpEmail,setOtpEmail] = useState('');
    const [emailInput,setEmailInput] = useState("");
    const [isValid, setIsValid ] = useState(false);
    const [showOTPEmail,setShowOTPEmail] = useState(false);
    const navigator = useNavigate();

    const [message, setMessage] = useState(null);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => {
            setMessage(null);
        }, 3000); // A mensagem desaparece após 3 segundos
    };

    const handleEmailSignIn = async () => {
        setIsLoading(true);
        var body = {
            email: emailInput
        }
        
        try {
            await api.post("/auth/sendEmailVerification",body);
            setShowOTPEmail(true);
        } catch(e) {
            showMessage("error","Erro no Servidor: " + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailCodeVerification = async () => {
        setIsLoading(true);
        var body = {
            email: emailInput,
            code: otpEmail
        }
        try {
            const result = await api.post("/auth/verificateEmailCode",body);
            await signInWithCustomToken(auth,result.data);
            navigator("/entrar/celular");
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        const rawValue = e.target.value;
        if(rawValue.indexOf("@")>0 && rawValue.indexOf(".")>0) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
        setEmailInput(rawValue);
    };

    
    return(
        <>
        {message && <MessageComponent type={message.type} text={message.text} />}
       
        <div className="sign-in-phone-page">
            <div className="sign-in-phone-container">
                <Link to="/" className="back-btn"><i className="fa fa-angle-left"></i></Link>
                {!showOTPEmail &&
                <div className="phone-number-sign-in">
                <p>Informe o seu e-mail para continuar</p>
                <div className="phone-number-input-wrapper">
                        <input
                        placeholder="Informe o seu e-mail"
                        value={emailInput} 
                        onChange={handleChange} 
                         /> 
                        <span></span>
                    </div>
                <button style={{"pointerEvents":isValid ? "visible" : "none",
                    "opacity":isValid? "1" : "0.6"
                }} onClick={handleEmailSignIn}>Continuar</button>
            </div>
                }
                
                {showOTPEmail && <div className="otp-phone-number-sign-in">
                    <input value={otpEmail} onChange={e=>setOtpEmail(e.target.value)}/>
                    <button onClick={handleEmailCodeVerification}>Verificar Código Email</button>
                </div>}
                
            </div>
        </div>
        </>
    )
};

export default SignInEmailPage;