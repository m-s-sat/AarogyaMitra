'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Navigation, 
  Clock,
  Heart,
  Stethoscope,
  Ambulance,
  Shield
} from 'lucide-react';

export const EmergencyPage: React.FC = () => {
  const [sosActivated, setSosActivated] = useState(false);

  const handleSOS = () => {
    setSosActivated(true);
    // In a real app, this would trigger emergency services
    setTimeout(() => {
      setSosActivated(false);
    }, 5000);
  };

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', icon: AlertTriangle, urgent: true },
    { name: 'Ambulance', number: '911', icon: Ambulance, urgent: true },
    { name: 'Poison Control', number: '1-800-222-1222', icon: Shield, urgent: false },
    { name: 'Mental Health Crisis', number: '988', icon: Heart, urgent: false }
  ];

  const nearbyFacilities = [
    {
      name: 'City General Hospital',
      type: 'Emergency Room',
      distance: '0.8 miles',
      waitTime: '15 mins',
      rating: 4.5
    },
    {
      name: 'QuickCare Urgent Care',
      type: 'Urgent Care',
      distance: '1.2 miles',
      waitTime: '5 mins',
      rating: 4.2
    },
    {
      name: 'MedCenter Pharmacy',
      type: 'Pharmacy',
      distance: '0.5 miles',
      waitTime: 'Open 24/7',
      rating: 4.7
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
            Emergency Services
          </h1>
          <p className="text-gray-600 text-lg">
            Immediate assistance and nearby healthcare facilities
          </p>
        </motion.div>

        {/* SOS Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.button
            onClick={handleSOS}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-48 h-48 mx-auto rounded-full font-bold text-2xl text-white shadow-2xl transition-all duration-300 ${
              sosActivated
                ? 'bg-red-700 animate-pulse'
                : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
            }`}
          >
            {sosActivated ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Phone className="w-12 h-12 mb-2" />
                <span>CALLING...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <AlertTriangle className="w-16 h-16 mb-2" />
                <span>SOS</span>
                <span className="text-sm font-normal">EMERGENCY</span>
              </div>
            )}
          </motion.button>
          
          {sosActivated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-100 rounded-lg border border-red-200"
            >
              <p className="text-red-800 font-semibold">Emergency services have been contacted</p>
              <p className="text-red-600 text-sm">Help is on the way. Stay calm and wait for assistance.</p>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Contacts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Phone className="w-6 h-6 mr-3 text-red-600" />
              Emergency Contacts
            </h2>
            
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    contact.urgent
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      contact.urgent
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      <contact.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-gray-600 text-sm">{contact.number}</p>
                    </div>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      contact.urgent
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Call Now
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Nearby Facilities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-blue-600" />
              Nearby Facilities
            </h2>
            
            <div className="space-y-4">
              {nearbyFacilities.map((facility, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                      <p className="text-blue-600 text-sm font-medium">{facility.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-yellow-500 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xs ${
                            i < Math.floor(facility.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}>★</span>
                        ))}
                        <span className="text-gray-600 text-xs ml-1">{facility.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Navigation className="w-4 h-4" />
                      <span>{facility.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{facility.waitTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                      Get Directions
                    </button>
                    <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                      Call
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Safety Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <Stethoscope className="w-6 h-6 mr-3" />
            Emergency Safety Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Before Emergency Services Arrive:</h4>
              <ul className="text-sm space-y-1">
                <li>• Stay calm and breathe slowly</li>
                <li>• Apply pressure to any bleeding wounds</li>
                <li>• Keep the person comfortable and warm</li>
                <li>• Do not move someone with suspected spinal injury</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Important Information to Provide:</h4>
              <ul className="text-sm space-y-1">
                <li>• Your exact location and address</li>
                <li>• Nature of the emergency</li>
                <li>• Number of people involved</li>
                <li>• Any known medical conditions or allergies</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};