import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./forgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [newPasswordValid, setNewPasswordValid] = useState(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|br)$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => password.length >= 6;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailTouched(true);

    setEmailValid(validateEmail(value) || !value);
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setNewPasswordTouched(true);

    setNewPasswordValid(validatePassword(value) || !value);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordTouched(true);

    setConfirmPasswordValid(value === newPassword);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setConfirmPasswordValid(false);
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post("https://auth-coin-production.up.railway.app/auth/reset-password", {
        email,
        newPassword,
      });

      setSuccess("Senha redefinida com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError("Erro ao redefinir a senha. Tente novamente.");
      console.error("Erro:", error);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="forgot-password-box">
        <h2>Redefinir Senha</h2>
        <form onSubmit={handlePasswordReset} className="forgot-password-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => setEmailTouched(true)}
            className={`email-input ${emailTouched && email ? (emailValid ? "input-success" : "input-error") : ""}`}
            required
          />
          <input
            type="password"
            placeholder="Nova Senha"
            value={newPassword}
            onChange={handleNewPasswordChange}
            onBlur={() => setNewPasswordTouched(true)}
            className={`password-input ${newPasswordTouched && newPassword ? (newPasswordValid ? "input-success" : "input-error") : ""}`}
            required
          />
          <input
            type="password"
            placeholder="Confirme Nova Senha"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={() => setConfirmPasswordTouched(true)}
            className={`password-input ${confirmPasswordTouched && confirmPassword ? (confirmPasswordValid ? "input-success" : "input-error") : ""}`}
            required
          />
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit">Redefinir Senha</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
