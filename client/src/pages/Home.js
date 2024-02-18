import Nav from "../components/Nav";
import AuthModal from "../components/AuthModal";
import { useState } from "react";
import { useCookies } from "react-cookie";
import logo from "../images/logo.svg"; // Import the logo

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const authToken = cookies.AuthToken;

  const handleClick = () => {
    if (authToken) {
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
      window.location.reload();
      return;
    }
    setShowModal(true);
    setIsSignUp(true);
  };

  const handleClick2 = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  return (
    <div className="overlay">
      {/* <Nav
        authToken={authToken}
        minimal={false}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp}
      /> */}
      <div className="home">
        <h1 className="primary-title">
          <img src={logo} alt="Logo" /> {/* Use the imported logo */}
        </h1>

        {/* <button className="primary-button" onClick={handleClick}>
          {authToken ? "Signout" : "Create Account"}
        </button> */}

        {!authToken && (
          <button
            onClick={handleClick2} // Replace handleClick with handleClick2
            disabled={showModal} // Add disabled attribute
            style={{
              backgroundColor: "#292932",
              color: "#ffffff",
              padding: "15px 30px",
              borderRadius: "5px",
              marginRight: "60px",
              marginTop: "-20px",
              fontSize: "18px",
            }}
          >
            Login
          </button>
        )}

        <button
          onClick={handleClick}
          style={{
            backgroundColor: "#0062FF",
            color: "#ffffff",
            marginTop: "-20px", // Increase negative value
            padding: "15px 30px",
            borderRadius: "5px",
            fontSize: "18px",
          }}
        >
          {authToken ? "Signout" : "Sign Up"}
        </button>

        {showModal && (
          <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
        )}
      </div>
    </div>
  );
};
export default Home;
