import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
// import "./Login.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import QRcode from "qrcode.react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [qr, setqr] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    function onRegister() {
      signInWithEmailAndPassword(auth, email, password).catch(error =>
        console.log(error)
      );

      navigate("/");
    }

    onRegister();
  };
  const getQr = async e => {
    e.preventDefault();
    const res = await fetch("/qr1");
    const data = await res.json();
    setqr(data.qr1);
    console.log(data);
  };

  return (
    <div>
      <form className="loginForm" onSubmit={handleSubmit}>
        <input
          placeholder="email"
          type="email"
          onChange={e => setEmail(e.target.value)}
        ></input>
        <input
          placeholder="password"
          type="password"
          onChange={e => setPassword(e.target.value)}
        ></input>
        <button>Login</button>
      </form>
      <button onClick={getQr}>Wa</button>
      <div>
        {qr ? (
          <QRcode id="myqr" value={qr} size={320} includeMargin={true} />
        ) : (
          <p>No QR code preview</p>
        )}
      </div>
    </div>
  );
};

export default Login;
