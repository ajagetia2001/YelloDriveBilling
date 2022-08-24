import React, { useState, useContext, useEffect } from "react";
import { auth, database as db } from "./firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "./AuthProvider";
import "./Home.css";
import BillDetail from "./Components/BillDetail";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";

function Home() {
  const { currentUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      const starCountRef = ref(db, "users/" + currentUser.uid);
      onValue(starCountRef, snapshot => {
        if (snapshot.exists()) {
          var data = snapshot.val();
          setUsername(data.firstName + " " + data.lastName);
        }
      });
    }
  }, [currentUser]);

  const clickLogin = () => {
    if (currentUser) {
      signOut(auth);
    } else {
      navigate("/login");
    }
  };

  const clickSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="mainContainer">
      <div className="upper-section">
        <div className="upper-left">
          {currentUser ? <p>Welcome, {username}</p> : <div>s</div>}
        </div>
        <div className="upper-right">
          <button onClick={clickLogin}>
            {currentUser ? "Log Out" : "Login"}
          </button>
          {!currentUser && <button onClick={clickSignup}>Sign Up</button>}
        </div>
      </div>
      <div className="buttons">
        {currentUser ? <BillDetail></BillDetail> : <div>Hello</div>}
      </div>
    </div>
  );
}

export default Home;
