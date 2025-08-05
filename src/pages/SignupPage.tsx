'use client'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext';
import logo from "../assets/Logo.png";

export const SignupPage: React.FC = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  dob: '',
  pincode: '',
  password: '',
  confirmPassword: '',
  preferredLanguage: 'en',
  agreeToTerms: false
});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const { availableLanguages, t } = useLanguage();
  const navigate = useNavigate();

  const handleGoogleRedirect = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t('signup.passwordMismatch'));
      return;
    }
    if (!formData.agreeToTerms) {
      alert(t('signup.mustAgree'));
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        preferredLanguage: formData.preferredLanguage,
        avatar: ''
      };
      
      signup(newUser);
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center">
              <img
                src={logo}
                alt="Aarogya Mitra"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('signup.createAccountTitle')}</h2>
          <p className="text-gray-600">{t('signup.createAccountSubtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t('signup.fullName')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t('signup.fullNamePlaceholder')}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('signup.emailAddress')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t('signup.emailPlaceholder')}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('signup.phoneNumber')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t('signup.phonePlaceholder')}
                />
              </div>
            </div>
            <div>
  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
    Date of Birth
  </label>
  <div className="relative">
    <input
      id="dob"
      type="date"
      required
      value={formData.dob || ""}
      onChange={(e) => handleInputChange('dob', e.target.value)}
      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
    />
  </div>
</div>

{/* Location / Pincode */}
<div>
  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
    Location / Pincode
  </label>
  <div className="relative">
    <input
      id="pincode"
      type="text"
      required
      value={formData.pincode || ""}
      onChange={(e) => handleInputChange('pincode', e.target.value)}
      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      placeholder="Enter your area pincode"
    />
  </div>
</div>
            {/* Preferred Language */}
            <div>
              <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-2">
                {t('signup.preferredLanguage')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white"
                >
                  {availableLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('signup.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t('signup.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('signup.confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t('signup.confirmPasswordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                id="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                {t('signup.agreeToTerms')}{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  {t('signup.terms')}
                </button>{' '}
                {t('signup.and')}{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  {t('signup.privacy')}
                </button>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('signup.creatingAccount')}</span>
                </div>
              ) : (
                t('signup.createAccountBtn')
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('signup.orSignUpWith')}</span>
              </div>
            </div>

            {/* Google Sign In */}
            <div className="mt-6 flex justify-center">
              <button onClick={handleGoogleRedirect} className="flex items-center border border-gray-300 rounded-lg shadow-sm px-4 py-2 bg-white hover:bg-gray-50 transition-colors">
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="w-5 h-5 mr-3"
                />
                <span className="text-gray-700 font-medium">{t('signup.googleSignIn')}</span>
              </button>
            </div>
          </div>

          {/* Already have account */}
          <p className="mt-8 text-center text-sm text-gray-600">
            {t('signup.alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              {t('signup.signIn')}
            </Link>
          </p>
        </div>

        {/* Terms Modal */}
        {showTerms && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
              <h2 className="text-xl font-bold mb-4">{t('signup.termsTitle')}</h2>
              <div className="text-sm text-gray-600 overflow-y-auto max-h-60 space-y-3">
                <p>{t('signup.termsIntro')}</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>{t('signup.termsEligibility')}</li>
                  <li>{t('signup.termsResponsibility')}</li>
                  <li>{t('signup.termsUse')}</li>
                  <li>{t('signup.termsAccuracy')}</li>
                  <li>{t('signup.termsChanges')}</li>
                  <li>{t('signup.termsTermination')}</li>
                  <li>{t('signup.termsLiability')}</li>
                </ol>
                <p>{t('signup.termsConclusion')}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowTerms(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('signup.close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Modal */}
        {showPrivacy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
              <h2 className="text-xl font-bold mb-4">{t('signup.privacyTitle')}</h2>
              <div className="text-sm text-gray-600 overflow-y-auto max-h-60 space-y-3">
                <p>{t('signup.privacyIntro')}</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>{t('signup.privacyCollect')}</li>
                  <li>{t('signup.privacyUse')}</li>
                  <li>{t('signup.privacyShare')}</li>
                  <li>{t('signup.privacySecurity')}</li>
                  <li>{t('signup.privacyRights')}</li>
                  <li>{t('signup.privacyUpdates')}</li>
                </ol>
                <p>{t('signup.privacyContact')}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('signup.close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
