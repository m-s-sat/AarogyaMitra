import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  Plus,
  Edit3,
  X,
  Check,
  AlertTriangle,
  UserX,
  RotateCcw,
  Eye,
  Download,
  Upload,
  Bell,
  MapPin,
  Video,
  FileText,
  Save,
  Trash2,
  RefreshCw,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

interface Doctor {
  id: string;
  name: string;
  department: string;
  specialization: string;
}

interface Appointment {
  id: string;
  patient: Patient;
  doctor: Doctor;
  date: string;
  time: string;
  type: 'online' | 'walk-in';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reason?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  isEmergency?: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export const HospitalAppointmentManager: React.FC = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'all' | 'schedule' | 'walk-in'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showConflictWarning, setShowConflictWarning] = useState(false);
  const [conflictDetails, setConflictDetails] = useState<string>('');

  // Mock data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'APT001',
      patient: {
        id: 'PAT001',
        name: 'John Doe',
        phone: '+91-9876543210',
        email: 'john.doe@email.com',
        age: 35,
        gender: 'male'
      },
      doctor: {
        id: 'DOC001',
        name: 'Dr. Sarah Johnson',
        department: 'Cardiology',
        specialization: 'Heart Disease'
      },
      date: '2025-01-16',
      time: '10:00',
      type: 'online',
      status: 'scheduled',
      notes: 'Follow-up consultation for chest pain',
      createdBy: 'Admin',
      createdAt: '2025-01-15T09:30:00Z',
      updatedAt: '2025-01-15T09:30:00Z'
    },
    {
      id: 'APT002',
      patient: {
        id: 'PAT002',
        name: 'Maria Rodriguez',
        phone: '+91-9876543211',
        age: 28,
        gender: 'female'
      },
      doctor: {
        id: 'DOC002',
        name: 'Dr. Michael Chen',
        department: 'General Medicine',
        specialization: 'Internal Medicine'
      },
      date: '2025-01-16',
      time: '11:30',
      type: 'walk-in',
      status: 'completed',
      notes: 'Regular checkup completed',
      createdBy: 'Receptionist',
      createdAt: '2025-01-16T08:00:00Z',
      updatedAt: '2025-01-16T12:00:00Z'
    },
    {
      id: 'APT003',
      patient: {
        id: 'PAT003',
        name: 'Robert Smith',
        phone: '+91-9876543212',
        age: 45,
        gender: 'male'
      },
      doctor: {
        id: 'DOC001',
        name: 'Dr. Sarah Johnson',
        department: 'Cardiology',
        specialization: 'Heart Disease'
      },
      date: '2025-01-15',
      time: '14:00',
      type: 'online',
      status: 'no-show',
      notes: 'Patient did not attend scheduled appointment',
      createdBy: 'System',
      createdAt: '2025-01-14T10:00:00Z',
      updatedAt: '2025-01-15T14:30:00Z'
    },
    {
      id: 'APT004',
      patient: {
        id: 'PAT004',
        name: 'Emily Davis',
        phone: '+91-9876543213',
        age: 32,
        gender: 'female'
      },
      doctor: {
        id: 'DOC003',
        name: 'Dr. Emily Rodriguez',
        department: 'Pediatrics',
        specialization: 'Child Health'
      },
      date: '2025-01-16',
      time: '15:30',
      type: 'online',
      status: 'cancelled',
      reason: 'Patient requested cancellation due to emergency',
      createdBy: 'Patient Portal',
      createdAt: '2025-01-14T16:00:00Z',
      updatedAt: '2025-01-16T09:00:00Z'
    }
  ]);

  const [doctors] = useState<Doctor[]>([
    {
      id: 'DOC001',
      name: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      specialization: 'Heart Disease'
    },
    {
      id: 'DOC002',
      name: 'Dr. Michael Chen',
      department: 'General Medicine',
      specialization: 'Internal Medicine'
    },
    {
      id: 'DOC003',
      name: 'Dr. Emily Rodriguez',
      department: 'Pediatrics',
      specialization: 'Child Health'
    }
  ]);

  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientAge: '',
    patientGender: 'male' as const,
    doctorId: '',
    date: '',
    time: '',
    type: 'walk-in' as const,
    notes: '',
    isEmergency: false,
    isRecurring: false,
    recurringPattern: ''
  });

  // Generate time slots for a doctor on a specific date
  const generateTimeSlots = (doctorId: string, date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const existingAppointment = appointments.find(
          apt => apt.doctor.id === doctorId && 
                 apt.date === date && 
                 apt.time === time && 
                 apt.status !== 'cancelled'
        );
        
        slots.push({
          time,
          available: !existingAppointment,
          appointmentId: existingAppointment?.id
        });
      }
    }
    
    return slots;
  };

  // Check for slot conflicts
  const checkSlotConflict = (doctorId: string, date: string, time: string, excludeId?: string): boolean => {
    return appointments.some(apt => 
      apt.doctor.id === doctorId && 
      apt.date === date && 
      apt.time === time && 
      apt.status !== 'cancelled' &&
      apt.id !== excludeId
    );
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
    const matchesDate = !dateFilter || appointment.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Get status color
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
      case 'no-show': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'no-show': return <UserX className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Handle add appointment
  const handleAddAppointment = () => {
    // Check for conflicts
    if (checkSlotConflict(newAppointment.doctorId, newAppointment.date, newAppointment.time)) {
      if (!newAppointment.isEmergency) {
        setConflictDetails(`Time slot ${newAppointment.time} is already booked for this doctor on ${newAppointment.date}`);
        setShowConflictWarning(true);
        return;
      }
    }

    const appointment: Appointment = {
      id: `APT${String(appointments.length + 1).padStart(3, '0')}`,
      patient: {
        id: `PAT${String(appointments.length + 1).padStart(3, '0')}`,
        name: newAppointment.patientName,
        phone: newAppointment.patientPhone,
        email: newAppointment.patientEmail,
        age: parseInt(newAppointment.patientAge),
        gender: newAppointment.patientGender
      },
      doctor: doctors.find(d => d.id === newAppointment.doctorId)!,
      date: newAppointment.date,
      time: newAppointment.time,
      type: newAppointment.type,
      status: 'scheduled',
      notes: newAppointment.notes,
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEmergency: newAppointment.isEmergency,
      isRecurring: newAppointment.isRecurring,
      recurringPattern: newAppointment.recurringPattern
    };

    setAppointments(prev => [...prev, appointment]);
    setShowAddModal(false);
    setNewAppointment({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      patientAge: '',
      patientGender: 'male',
      doctorId: '',
      date: '',
      time: '',
      type: 'walk-in',
      notes: '',
      isEmergency: false,
      isRecurring: false,
      recurringPattern: ''
    });
  };

  // Handle update appointment status
  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status'], reason?: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status, reason, updatedAt: new Date().toISOString() }
        : apt
    ));
  };

  // Handle edit appointment
  const handleEditAppointment = () => {
    if (!selectedAppointment) return;

    // Check for conflicts if time/date/doctor changed
    const hasConflict = checkSlotConflict(
      selectedAppointment.doctor.id, 
      selectedAppointment.date, 
      selectedAppointment.time,
      selectedAppointment.id
    );

    if (hasConflict) {
      setConflictDetails(`Time slot ${selectedAppointment.time} is already booked`);
      setShowConflictWarning(true);
      return;
    }

    setAppointments(prev => prev.map(apt => 
      apt.id === selectedAppointment.id 
        ? { ...selectedAppointment, updatedAt: new Date().toISOString() }
        : apt
    ));
    
    setShowEditModal(false);
    setSelectedAppointment(null);
  };

  // Export appointments
  const exportAppointments = () => {
    const csvContent = [
      'ID,Patient Name,Doctor,Date,Time,Status,Type,Notes',
      ...filteredAppointments.map(apt => 
        `${apt.id},${apt.patient.name},${apt.doctor.name},${apt.date},${apt.time},${apt.status},${apt.type},"${apt.notes || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'all', label: 'All Appointments', icon: Calendar },
    { id: 'schedule', label: 'Today\'s Schedule', icon: Clock },
    { id: 'walk-in', label: 'Walk-in Queue', icon: Users }
  ];

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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/hospital/dashboard')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Appointment Manager
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage all hospital appointments and schedules
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportAppointments}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Appointment</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No Shows</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.status === 'no-show').length}
                </p>
              </div>
              <UserX className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Walk-ins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.type === 'walk-in').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by patient name, doctor, or appointment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="online">Online</option>
                <option value="walk-in">Walk-in</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => (
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

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-100 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or add a new appointment</p>
            </div>
          ) : (
            filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{appointment.patient.name}</h3>
                      <span className="text-sm text-gray-500">#{appointment.id}</span>
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="capitalize">{appointment.status.replace('-', ' ')}</span>
                      </div>
                      {appointment.isEmergency && (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                          <Zap className="w-3 h-3" />
                          <span>Emergency</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{appointment.doctor.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {appointment.type === 'online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        <span className="capitalize">{appointment.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{appointment.patient.phone}</span>
                      </div>
                      {appointment.patient.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{appointment.patient.email}</span>
                        </div>
                      )}
                      <span>Age: {appointment.patient.age}</span>
                    </div>

                    {appointment.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    )}

                    {appointment.reason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-700"><strong>Reason:</strong> {appointment.reason}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {appointment.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                          title="Mark as Completed"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'no-show')}
                          className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                          title="Mark as No Show"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for cancellation (optional):');
                            updateAppointmentStatus(appointment.id, 'cancelled', reason || undefined);
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Cancel Appointment"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowEditModal(true);
                      }}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit Appointment"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Add Appointment Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Add New Appointment</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Patient Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          value={newAppointment.patientName}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, patientName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter patient name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={newAppointment.patientPhone}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, patientPhone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={newAppointment.patientEmail}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, patientEmail: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age *
                        </label>
                        <input
                          type="number"
                          value={newAppointment.patientAge}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, patientAge: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter age"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender *
                        </label>
                        <div className="flex space-x-4">
                          {(['male', 'female', 'other'] as const).map(gender => (
                            <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="gender"
                                value={gender}
                                checked={newAppointment.patientGender === gender}
                                onChange={(e) => setNewAppointment(prev => ({ ...prev, patientGender: e.target.value as any }))}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="capitalize">{gender}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Doctor *
                        </label>
                        <select
                          value={newAppointment.doctorId}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, doctorId: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select doctor</option>
                          {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.department}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type *
                        </label>
                        <select
                          value={newAppointment.type}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="walk-in">Walk-in</option>
                          <option value="online">Online</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          value={newAppointment.date}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time *
                        </label>
                        <input
                          type="time"
                          value={newAppointment.time}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Options</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="emergency"
                          checked={newAppointment.isEmergency}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, isEmergency: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="emergency" className="text-sm font-medium text-gray-700">
                          Emergency Override (allows overbooking)
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="recurring"
                          checked={newAppointment.isRecurring}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, isRecurring: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                          Recurring Appointment
                        </label>
                      </div>

                      {newAppointment.isRecurring && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recurring Pattern
                          </label>
                          <select
                            value={newAppointment.recurringPattern}
                            onChange={(e) => setNewAppointment(prev => ({ ...prev, recurringPattern: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select pattern</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={newAppointment.notes}
                          onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Any additional notes..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAppointment}
                      disabled={!newAppointment.patientName || !newAppointment.patientPhone || !newAppointment.doctorId || !newAppointment.date || !newAppointment.time}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Appointment
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conflict Warning Modal */}
        <AnimatePresence>
          {showConflictWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowConflictWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Scheduling Conflict</h3>
                  <p className="text-gray-600 mb-6">{conflictDetails}</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowConflictWarning(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Choose Different Time
                    </button>
                    <button
                      onClick={() => {
                        setShowConflictWarning(false);
                        if (showAddModal) {
                          setNewAppointment(prev => ({ ...prev, isEmergency: true }));
                          handleAddAppointment();
                        } else if (showEditModal) {
                          handleEditAppointment();
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Override (Emergency)
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};