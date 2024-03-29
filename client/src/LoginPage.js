import React, { useEffect } from "react";
import "./loginindex.css";
import ReactDOM from "react-dom";
import GoogleLogin from "@stack-pulse/next-google-login";
import { useNavigate } from "react-router-dom";

async function login() {
  const response = await fetch("/auth/google/callback");
  console.log("Response:", response);
  const data = await response.json();

  // Store the JWT in the local storage
  localStorage.setItem("jwt", data.token);
}

async function getProtectedData() {
  const token = localStorage.getItem("jwt");

  const response = await fetch("/auth/protected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  // Do something with the data
}
function LoginPage() {
  const navigate = useNavigate();
  console.log("LoginPage is being rendered");
  useEffect(() => {
    const name = localStorage.getItem("name");
    // If all the required fields are present, redirect to the ProfileSummary page
    if (name) {
      navigate("/profile-summary");
    }
  }, []);
  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Handle login form submission here
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log("Form submitted:", { email, password });
    // You can send the form data to your backend for authentication
  };

  const responseGoogle = async (response) => {
    console.log("Google login response:", response);
    const googleUser = response.profileObj;
    const { tokenId } = response;
    console.log("Token ID:", tokenId);
    console.log("Google user information:", googleUser);
    const { profileObj, tokenResponse } = response;
    const { name, email, imageUrl, googleId } = profileObj;

    // console.log("Name:", name);
    // console.log("Email:", email);
    // console.log("Picture:", imageUrl);
    // console.log("Google ID:", googleId);
    // console.log("Token Response:", tokenResponse);
    await login();
    navigate("/success");
    navigate("/birthdate", { state: { name, email, imageUrl, googleId } });
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>

      <div>
        <p>
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>

      <br />
      <GoogleLogin
        clientId="1095865446899-ij588crmvvagq1jco12pvljahfma6oo6.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
}

export default LoginPage;
