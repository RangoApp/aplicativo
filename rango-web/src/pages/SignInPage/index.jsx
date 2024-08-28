import { getAdditionalUserInfo, GoogleAuthProvider, linkWithPhoneNumber, RecaptchaVerifier, setPersistence, signInWithCustomToken, signInWithPopup } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import './SignInPage.css';
import MessageComponent from "../../components/MessageComponent";

const SignInPage = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [showAlreadyHaveAccount,setShowAlreadyHaveAccount] = useState(false);

  const navigator = useNavigate();
  const { status } = useParams(); 

  const [message, setMessage] = useState(null);

  const showMessage = (type, text) => {
      setMessage({ type, text });
      setTimeout(() => {
          setMessage(null);
      }, 3000); // A mensagem desaparece após 3 segundos
  };

  useEffect(() => {
    // const user = auth.currentUser;
    // if(user != null && user.emailVerified && user.phoneNumber != null) {
    //   navigator('/home')
    // }

    if(status == 1) {
      showMessage("error","Erro: Servidor Desligado")
    }
  },[])

  const handleGoogleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
        var result = await signInWithPopup(auth,provider)
        console.log(result)
        navigator("/entrar/celular")
        
      } catch (error) {
        console.error("Erro ao realizar o login", error);
        setIsLoading(false);
      }
  };

  return(
      <>
       {message && <MessageComponent type={message.type} text={message.text} />}
       {
          showAlreadyHaveAccount && 
          <div className="background-shadow">
          <div className="already-have-account-modal">
          <button onClick={e=>setShowAlreadyHaveAccount(false)} className="back-btn"><i className="fa fa-angle-left"></i></button>
            <div className="already-have-account-body">
              <p>Como deseja continuar?</p>
              <Link to="/entrar/email">Email</Link>
            </div>
          </div>
          </div>
        }
      <div className="sign-in-page">
        <div id='recaptcha-container'></div>
        <div className="sign-in-options">
          <h1>Falta pouco para<br/> matar sua fome!</h1>
          <h2>Como deseja continuar?</h2>
          {/* <button className="already-have-account" onClick={e=>setShowAlreadyHaveAccount(true)}>Já tenho uma conta</button> */}
          <Link className="new-account" to="/entrar/email">E-mail</Link>
          <div className="providers-section">
            <button className="facebook-btn"><i className="fa-brands fa-facebook"></i>Continuar com Facebook</button>
            <button className="google-btn" onClick={handleGoogleSignIn}><i className="fa-brands fa-google"></i>Continuar com Google</button>
          </div>
        </div>
    </div>
    </>
  );
};

export default SignInPage;