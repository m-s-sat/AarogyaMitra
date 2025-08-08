  import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Clock,
  User,
  CheckCircle,
  ArrowLeft,
  Search
} from 'lucide-react';
interface SelectOption {
  value: string;
  label: string;
}
// Mock data for states and districts
const statesData = {
  'maharashtra': {
    name: 'Maharashtra',
    districts: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur']
  },
  'karnataka': {
    name: 'Karnataka',
    districts: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga']
  },
  'tamil-nadu': {
    name: 'Tamil Nadu',
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli']
  },
  'delhi': {
    name: 'Delhi',
    districts: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi']
  },
  'gujarat': {
    name: 'Gujarat',
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar']
  }
};

// Mock hospital data
const hospitalsData: Record<string, any[]> = {
  'mumbai': [
    {
      id: 'MH001',
      name: 'King Edward Memorial Hospital',
      address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
      govId: 'MH-MUM-KEM-001',
      type: 'Government',
      coordinates: { lat: 19.0176, lng: 72.8562 }
    },
    {
      id: 'MH002',
      name: 'Tata Memorial Hospital',
      address: 'Dr E Borges Rd, Parel, Mumbai, Maharashtra 400012',
      govId: 'MH-MUM-TMH-002',
      type: 'Government',
      coordinates: { lat: 19.0144, lng: 72.8479 }
    },
    {
      id: 'MH003',
      name: 'Lilavati Hospital',
      address: 'A-791, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050',
      govId: 'MH-MUM-LIL-003',
      type: 'Private',
      coordinates: { lat: 19.0596, lng: 72.8295 }
    }
  ],
  'pune': [
    {
      id: 'MH004',
      name: 'Sassoon General Hospital',
      address: 'Near Pune Railway Station, Pune, Maharashtra 411001',
      govId: 'MH-PUN-SGH-004',
      type: 'Government',
      coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    {
      id: 'MH005',
      name: 'Ruby Hall Clinic',
      address: '40, Sassoon Rd, near Pune Railway Station, Pune, Maharashtra 411001',
      govId: 'MH-PUN-RHC-005',
      type: 'Private',
      coordinates: { lat: 18.5314, lng: 73.8446 }
    }
  ],
  'bangalore': [
    {
      id: 'KA001',
      name: 'Victoria Hospital',
      address: 'Fort, Bengaluru, Karnataka 560002',
      govId: 'KA-BLR-VIC-001',
      type: 'Government',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: 'KA002',
      name: 'Manipal Hospital',
      address: '98, Rustum Bagh, Airport Rd, Bengaluru, Karnataka 560017',
      govId: 'KA-BLR-MAN-002',
      type: 'Private',
      coordinates: { lat: 13.0827, lng: 77.6094 }
    }
  ]
};

const departments = [
  'Cardiology',
  'General Medicine',
  'Pediatrics',
  'Orthopedics',
  'Gynecology',
  'Neurology',
  'Dermatology',
  'Psychiatry',
  'Emergency Medicine',
  'Radiology',
  'Pathology',
  'Anesthesiology'
];

export const HospitalSignupPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    adminName: '',
    adminEmail: '',
    phone: '',
    password: '',
    departments: [] as string[],
    emergencyContact: '',
    visitingHours: {
      start: '09:00',
      end: '17:00'
    }
  });

  const handleStateChange = (stateKey: string) => {
    setSelectedState(stateKey);
    setSelectedDistrict('');
    setSelectedHospital(null);
    setCurrentStep(2);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedHospital(null);
    setCurrentStep(3);
  };

  const handleHospitalSelect = (hospital: any) => {
    setSelectedHospital(hospital);
    setCurrentStep(4);
  };

  const handleDepartmentToggle = (department: string) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(department)
        ? prev.departments.filter(d => d !== department)
        : [...prev.departments, department]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      role: 'hospital',
      hospital: {
        id: selectedHospital.id,
        name: selectedHospital.name,
        address: selectedHospital.address,
        govId: selectedHospital.govId,
        type: selectedHospital.type,
        coordinates: selectedHospital.coordinates,
        state: selectedState,
        district: selectedDistrict
      },
      admin: {
        name: formData.adminName,
        email: formData.adminEmail,
        phone: formData.phone,
        password: formData.password
      },
      departments: formData.departments,
      emergencyContact: formData.emergencyContact,
      visitingHours: formData.visitingHours
    };

    console.log('Hospital signup payload:', payload);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/hospital/dashboard');
    }, 2000);
  };

  const filteredHospitals = selectedDistrict 
    ? (hospitalsData[selectedDistrict.toLowerCase()] || []).filter(hospital =>
        hospital.name.toLowerCase().includes(hospitalSearch.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full space-y-8"
      >
        <div className="text-center">
          <Link 
            to="/signup"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to signup</span>
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hospital Registration</h2>
          <p className="text-gray-600">Register your hospital with verified credentials</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {currentStep === 1 && (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-6"
  >
    <h3 className="text-xl font-semibold text-gray-900">Select State</h3>
    <Select
      options={Object.entries(statesData).map(([key, state]) => ({
        value: key,
        label: state.name
      }))}
      onChange={(option) => {
        if (option) handleStateChange(option.value);
      }}
      placeholder="Search and select a state..."
      isSearchable
    />
  </motion.div>
)}

{currentStep === 2 && selectedState && (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-6"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-gray-900">
        Select District in {statesData[selectedState as keyof typeof statesData].name}
      </h3>
      <button
        onClick={() => setCurrentStep(1)}
        className="text-blue-600 hover:text-blue-700"
      >
        Change State
      </button>
    </div>
    <Select
      options={statesData[selectedState as keyof typeof statesData].districts.map(district => ({
        value: district,
        label: district
      }))}
      onChange={(option) => {
        if (option) handleDistrictChange(option.value);
      }}
      placeholder="Search and select a district..."
      isSearchable
    />
  </motion.div>
)}


          {/* Step 3: Hospital Selection */}
          {currentStep === 3 && selectedDistrict && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Select Hospital in {selectedDistrict}
                </h3>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Change District
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  value={hospitalSearch}
                  onChange={(e) => setHospitalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredHospitals.map((hospital) => (
                  <button
                    key={hospital.id}
                    onClick={() => handleHospitalSelect(hospital)}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{hospital.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{hospital.address}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            {hospital.type}
                          </span>
                          <span className="text-xs text-gray-500">ID: {hospital.govId}</span>
                        </div>
                      </div>
                      <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Admin Details Form */}
          {currentStep === 4 && selectedHospital && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Admin Details</h3>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Change Hospital
                </button>
              </div>

              {/* Hospital Info (Read-only) */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h4 className="font-semibold text-gray-900 mb-2">Selected Hospital</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Name:</strong> {selectedHospital.name}</p>
                  <p><strong>Address:</strong> {selectedHospital.address}</p>
                  <p><strong>Government ID:</strong> {selectedHospital.govId}</p>
                  <p><strong>Type:</strong> {selectedHospital.type}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        required
                        value={formData.adminName}
                        onChange={(e) => setFormData(prev => ({ ...prev, adminName: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter admin name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={formData.adminEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter admin email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Visiting Hours *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          required
                          value={formData.visitingHours.start}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            visitingHours: { ...prev.visitingHours, start: e.target.value }
                          }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Time</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="time"
                          required
                          value={formData.visitingHours.end}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            visitingHours: { ...prev.visitingHours, end: e.target.value }
                          }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Departments Offered * (Select at least 3)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {departments.map((department) => (
                      <button
                        key={department}
                        type="button"
                        onClick={() => handleDepartmentToggle(department)}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          formData.departments.includes(department)
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {department}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {formData.departments.length} departments
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || formData.departments.length < 3}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Registering Hospital...</span>
                    </div>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};