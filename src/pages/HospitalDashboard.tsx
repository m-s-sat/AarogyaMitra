import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Edit3,
  Save,
  Plus,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Mail,
  Clock,
  Bed,
  Activity,
  FileText,
  Shield,
  Settings,
  BarChart3,
  UserPlus,
  Bell,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { HospitalProfile, HospitalDoctor, HospitalStats } from '../types/hospital';

export const HospitalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'doctors' | 'analytics'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [hospitalProfile, setHospitalProfile] = useState<HospitalProfile | null>(null);
  const [hospitalStats, setHospitalStats] = useState<HospitalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend: Fetch hospital profile and stats
    fetchHospitalData();
  }, []);

  const fetchHospitalData = async () => {
    try {
      // Backend: API calls to fetch hospital data
      // const profileResponse = await api.get('/hospital/profile');
      // const statsResponse = await api.get('/hospital/stats');
      
      // Mock data for demonstration
      const mockProfile: HospitalProfile = {
        id: 'HOSP001',
        basicDetails: {
          name: 'City General Hospital',
          registrationNumber: 'REG123456',
          licenseNumber: 'LIC789012',
          hospitalType: 'Private',
          ownership: 'Private Limited Company',
          managingAuthority: 'City Healthcare Group',
          accreditation: ['NABH', 'ISO 9001:2015'],
          establishedYear: 1995
        },
        contactInfo: {
          generalPhone: '+91-22-12345678',
          emergencyContact: '+91-22-87654321',
          emailId: 'admin@citygeneralhospital.com',
          website: 'https://citygeneralhospital.com',
          socialMedia: {
            facebook: 'https://facebook.com/citygeneralhospital',
            twitter: 'https://twitter.com/citygenhosp'
          }
        },
        location: {
          state: 'Maharashtra',
          district: 'Mumbai',
          pincode: '400001',
          fullAddress: '123 Healthcare Street, Andheri West, Mumbai, Maharashtra 400001',
          street: '123 Healthcare Street',
          locality: 'Andheri West',
          landmark: 'Near Metro Station',
          coordinates: {
            latitude: 19.1136,
            longitude: 72.8697
          },
          googleMapsLink: 'https://maps.google.com/...'
        },
        timings: {
          opdTimings: {
            monday: { start: '09:00', end: '17:00' },
            tuesday: { start: '09:00', end: '17:00' },
            wednesday: { start: '09:00', end: '17:00' },
            thursday: { start: '09:00', end: '17:00' },
            friday: { start: '09:00', end: '17:00' },
            saturday: { start: '09:00', end: '13:00' },
            sunday: { start: '10:00', end: '12:00' }
          },
          specialistTimings: {},
          emergencyHours: '24/7',
          holidays: ['2025-01-26', '2025-08-15'],
          weeklyOffs: []
        },
        departments: {
          activeDepartments: ['Cardiology', 'General Medicine', 'Pediatrics', 'Orthopedics'],
          bedAllocation: {
            'Cardiology': { total: 20, occupied: 15, available: 5 },
            'General Medicine': { total: 30, occupied: 22, available: 8 },
            'Pediatrics': { total: 15, occupied: 10, available: 5 }
          },
          services: {
            labAvailable: true,
            pharmacyAvailable: true,
            icuAvailable: true,
            nicuAvailable: true,
            ambulanceService: true,
            bloodBankAvailable: false,
            dialysisCenter: true,
            emergencyServices: true,
            surgicalFacilities: true,
            diagnosticImaging: true
          }
        },
        infrastructure: {
          totalBeds: 150,
          icuBeds: 20,
          nicuBeds: 10,
          operationTheaters: 5,
          occupiedBeds: 120,
          availableBeds: 30,
          equipmentSummary: {
            'Ventilators': { total: 15, working: 14, underMaintenance: 1 },
            'X-Ray Machines': { total: 3, working: 3, underMaintenance: 0 }
          },
          parkingCapacity: 100,
          buildingFloors: 8
        },
        doctors: {
          totalRegistered: 25,
          doctorsList: [],
          departmentWiseCount: {
            'Cardiology': 5,
            'General Medicine': 8,
            'Pediatrics': 4,
            'Orthopedics': 3
          }
        },
        profileCompletion: {
          percentage: 85,
          completedSections: ['basicDetails', 'contactInfo', 'location', 'departments'],
          missingSections: ['timings', 'infrastructure'],
          lastUpdated: '2025-01-15T10:30:00Z'
        },
        adminLog: {
          lastUpdatedBy: 'Dr. Admin',
          lastUpdatedOn: '2025-01-15T10:30:00Z',
          updateHistory: [],
          pendingVerifications: ['Doctor Verification', 'Equipment Audit'],
          adminRemarks: 'All systems operational'
        },
        verification: {
          kycStatus: 'Verified',
          uploadedCertificates: [],
          lastVerificationDate: '2025-01-01T00:00:00Z',
          verifiedBy: 'Health Board Inspector',
          complianceStatus: {
            healthBoard: true,
            fireNoc: true,
            pollutionClearance: true,
            buildingApproval: true
          }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2025-01-15T10:30:00Z',
        isActive: true,
        isPubliclyVisible: true
      };

      const mockStats: HospitalStats = {
        totalPatients: 1250,
        todayAppointments: 45,
        occupancyRate: 80,
        revenue: {
          today: 125000,
          thisMonth: 2500000,
          thisYear: 25000000
        },
        departmentStats: {
          'Cardiology': { appointments: 12, revenue: 45000, occupancy: 75 },
          'General Medicine': { appointments: 20, revenue: 30000, occupancy: 73 }
        }
      };

      setHospitalProfile(mockProfile);
      setHospitalStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      setLoading(false);
    }
  };

  const updateHospitalProfile = async (updatedProfile: Partial<HospitalProfile>) => {
    try {
      // Backend: Update hospital profile
      // await api.put('/hospital/profile', updatedProfile);
      console.log('Updating hospital profile:', updatedProfile);
      
      if (hospitalProfile) {
        setHospitalProfile({ ...hospitalProfile, ...updatedProfile });
      }
    } catch (error) {
      console.error('Error updating hospital profile:', error);
    }
  };

  const addDoctor = async (doctorData: Omit<HospitalDoctor, 'id'>) => {
    try {
      // Backend: Add new doctor
      // await api.post('/hospital/doctors', doctorData);
      console.log('Adding doctor:', doctorData);
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  const calculateProfileCompletion = (profile: HospitalProfile): number => {
    // Backend: Calculate profile completion percentage
    const sections = [
      'basicDetails',
      'contactInfo', 
      'location',
      'timings',
      'departments',
      'infrastructure'
    ];
    
    let completed = 0;
    // Logic to check each section completion
    // This would be more sophisticated in real implementation
    
    return Math.round((completed / sections.length) * 100);
  };

  const canAddDoctors = hospitalProfile && hospitalProfile.profileCompletion.percentage >= 60;
  const emergencyUnlocked = hospitalProfile && hospitalProfile.profileCompletion.percentage >= 80;
  const publiclyVisible = hospitalProfile && hospitalProfile.profileCompletion.percentage >= 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hospital dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {hospitalProfile?.basicDetails.name || 'Hospital Dashboard'}
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your hospital operations and profile
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Profile Completion Alert */}
        {hospitalProfile && hospitalProfile.profileCompletion.percentage < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Complete Your Hospital Profile</h3>
                  <p className="text-orange-100 mb-2">
                    Your profile is {hospitalProfile.profileCompletion.percentage}% complete. 
                    Complete it to unlock all features.
                  </p>
                  <div className="w-64 bg-white bg-opacity-20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${hospitalProfile.profileCompletion.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Complete Profile
              </button>
            </div>
          </motion.div>
        )}

        {/* Feature Unlock Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className={`p-4 rounded-lg border ${canAddDoctors ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              {canAddDoctors ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400" />
              )}
              <span className={`font-medium ${canAddDoctors ? 'text-emerald-700' : 'text-gray-600'}`}>
                Add Doctors {canAddDoctors ? 'Unlocked' : 'Locked (60% required)'}
              </span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${emergencyUnlocked ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              {emergencyUnlocked ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400" />
              )}
              <span className={`font-medium ${emergencyUnlocked ? 'text-emerald-700' : 'text-gray-600'}`}>
                Emergency Panel {emergencyUnlocked ? 'Unlocked' : 'Locked (80% required)'}
              </span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border ${publiclyVisible ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              {publiclyVisible ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-400" />
              )}
              <span className={`font-medium ${publiclyVisible ? 'text-emerald-700' : 'text-gray-600'}`}>
                Public Visibility {publiclyVisible ? 'Enabled' : 'Disabled (100% required)'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="flex space-x-1 p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'profile', label: 'Hospital Profile', icon: Building2 },
              { id: 'doctors', label: 'Doctors', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && hospitalStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Patients</p>
                      <p className="text-2xl font-bold text-gray-900">{hospitalStats.totalPatients}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                      <p className="text-2xl font-bold text-gray-900">{hospitalStats.todayAppointments}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{hospitalStats.occupancyRate}%</p>
                    </div>
                    <Bed className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₹{(hospitalStats.revenue.thisMonth / 100000).toFixed(1)}L</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    disabled={!canAddDoctors}
                  >
                    <UserPlus className="w-6 h-6 text-blue-600" />
                    <span className="font-medium text-blue-700">Add New Doctor</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                    <span className="font-medium text-emerald-700">Manage Appointments</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <Activity className="w-6 h-6 text-purple-600" />
                    <span className="font-medium text-purple-700">Update Bed Status</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && hospitalProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Profile completion and edit controls */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Hospital Profile</h3>
                    <p className="text-gray-600">Manage your hospital information and settings</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                  </button>
                </div>

                {/* Profile sections would go here - Basic Details, Contact Info, etc. */}
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Profile editing interface would be implemented here</p>
                  <p className="text-sm">Including all sections: Basic Details, Contact Info, Location, Timings, etc.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Doctors Management</h3>
                    <p className="text-gray-600">Add and manage doctors in your hospital</p>
                  </div>
                  <button
                    disabled={!canAddDoctors}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Doctor</span>
                  </button>
                </div>

                {!canAddDoctors && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-700 font-medium">
                        Complete at least 60% of your hospital profile to add doctors
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Doctors management interface would be implemented here</p>
                  <p className="text-sm">Including doctor list, verification status, and department assignments</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Hospital Analytics</h3>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Analytics dashboard would be implemented here</p>
                  <p className="text-sm">Including charts, trends, and detailed reports</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};