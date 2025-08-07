import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext';
import logo from "../assets/Logo.png";

export const LoginPage: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [credentials, setCredentials] = useState({ emailOrPhone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useOTP, setUseOTP] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSendLoading, setIsSendLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleGoogleRedirect = () => {
    window.location.href = '/auth/google';
  };

  const handleSendLink = async() => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    setIsSendLoading(true)
    const response = await fetch('/auth/reset-request',{
      method: "POST",
      headers: {'content-type':'application/json'},
      body: JSON.stringify({email:email}),
    })
    const data = await response.json();
    alert(data.message);
    setIsSendLoading(false);
    return
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const loginUser = {
        email: credentials.emailOrPhone,
        password: credentials.password
      };
      console.log(loginUser);
      login(loginUser);
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  // Lock scroll + Esc key close
  useEffect(() => {
    if (showForgotModal) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setShowForgotModal(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "auto";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [showForgotModal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center">
              <img src={logo} alt="Aarogya Mitra" className="max-h-full max-w-full object-contain" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('login.welcomeBack')}</h2>
          <p className="text-gray-600">{t('login.signInToAccount')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Login Method Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${loginMethod === 'email'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Mail className="w-4 h-4" />
              <span>{t('login.email')}</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${loginMethod === 'phone'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Phone className="w-4 h-4" />
              <span>{t('login.phone')}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email / Phone Field */}
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-2">
                {loginMethod === 'email' ? t('login.emailAddress') : t('login.phoneNumber')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {loginMethod === 'email'
                    ? <Mail className="h-5 w-5 text-gray-400" />
                    : <Phone className="h-5 w-5 text-gray-400" />}
                </div>
                <input
                  id="emailOrPhone"
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  required
                  value={credentials.emailOrPhone}
                  onChange={(e) => setCredentials({ ...credentials, emailOrPhone: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={loginMethod === 'email' ? t('login.emailPlaceholder') : t('login.phonePlaceholder')}
                />
              </div>
            </div>

            {/* Password Field */}
            {!useOTP && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('login.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword
                      ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
              <div
                className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center [&>*+*]:mt-0"
                onClick={() => setShowForgotModal(false)}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg w-96 [&>*+*]:!mt-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
                  <p className="text-sm text-gray-600 mb-3">
                    Enter the email you have an account with.
                  </p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="border w-full px-3 py-2 rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSendLink}
                      disabled={isSendLoading}
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {isSendLoading && <span>Sending Link</span>}
                      {!isSendLoading && <span>Send Link</span>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 disabled:opacity-50"
            >
              {isLoading
                ? <span>{t('login.signingIn')}</span>
                : useOTP ? t('login.sendOTP') : t('login.signIn')}
            </button>
          </form>

          {/* Google Sign In */}
          <div className="mt-6 flex justify-center">
            <button
              className="flex items-center border border-gray-300 rounded-lg shadow-sm px-4 py-2 bg-white hover:bg-gray-50"
              onClick={handleGoogleRedirect}
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="w-5 h-5 mr-3" />
              <span className="text-gray-700 font-medium">{t('login.googleSignIn')}</span>
            </button>
          </div>

          {/* Signup Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            {t('login.noAccount')}{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700">
              {t('login.signUpNow')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
