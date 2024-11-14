import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./signup.css";

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const navigate = useNavigate();

  const springProps = useSpring({
    from: { transform: "translateY(-100%)" },
    to: { transform: "translateY(0%)" },
    config: { tension: 170, friction: 20 },
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|br)$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => password.length >= 6;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailTouched(true);

    if (value && !validateEmail(value)) {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordTouched(true);

    if (value && !validatePassword(value)) {
      setPasswordValid(false);
    } else {
      setPasswordValid(true);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordTouched(true);

    setConfirmPasswordValid(value === password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setConfirmPasswordValid(false);
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://auth-coin-production.up.railway.app/auth/register', {
        name,
        email,
        password
      });

      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data.message || 'Erro ao criar conta. Tente novamente.');
      console.error('Erro ao cadastrar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
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

      <animated.div style={springProps} className="signup-content">
        <div className="coin-title">Coin</div>
        <div className="signup-box">
          <div className="back-arrow" onClick={() => navigate('/')}>
            &#8592;
          </div>

          <form className="signupform" onSubmit={handleSignup}>
            <div>
              <input
                type="text"
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setEmailTouched(true)}
                className={`email-input ${emailTouched && email ? (emailValid ? "input-success" : "input-error") : ""}`}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setPasswordTouched(true)}
                className={`password-input ${passwordTouched && password ? (passwordValid ? "input-success" : "input-error") : ""}`}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirme a Senha"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={() => setConfirmPasswordTouched(true)}
                className={`password-input ${confirmPasswordTouched && confirmPassword ? (confirmPasswordValid ? "input-success" : "input-error") : ""}`}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="button-group">
              <button type="submit" disabled={loading}>
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  "Cadastrar"
                )}
              </button>
            </div>
          </form>
        </div>
      </animated.div>
    </div>
  );
}

export default Signup;
