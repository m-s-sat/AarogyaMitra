import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  Pill, 
  Video, 
  Phone, 
  MessageCircle,
  AlertTriangle,
  Activity,
  Users,
  MapPin,
  Globe2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext';
import { QuickActionCard } from '../components/QuickActionCard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: MessageCircle,
      title: t('dashboard.quickActions.assistant'),
      description: t('dashboard.quickActions.assistantDesc'),
      onClick: () => navigate('/chat'),
      gradient: 'bg-gradient-to-r from-pink-500 to-pink-600'
    },
    {
      icon: Calendar,
      title: t('features.appointments'),
      description: t('dashboard.quickActions.appointmentsDesc'),
      onClick: () => navigate('/appointments'),
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      icon: FileText,
      title: t('dashboard.quickActions.reports'),
      description: t('dashboard.quickActions.reportsDesc'),
      onClick: () => navigate('/reports'),
      gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
    },
    {
      icon: Pill,
      title: t('dashboard.quickActions.medicines'),
      description: t('dashboard.quickActions.medicinesDesc'),
      onClick: () => navigate('/medicines'),
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      icon: Video,
      title: t('dashboard.quickActions.visits'),
      description: t('dashboard.quickActions.visitsDesc'),
      onClick: () => navigate('/visits'),
      gradient: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
    },
    {
      icon: Phone,
      title: t('dashboard.quickActions.helpdesk'),
      description: t('dashboard.quickActions.helpdeskDesc'),
      onClick: () => navigate('/helpdesk'),
      gradient: 'bg-gradient-to-r from-orange-500 to-orange-600'
    }
  ];

  const upcomingAppointments = [
    {
      doctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      date: '2025-01-15',
      time: '10:30 AM',
      type: 'video' as const
    },
    {
      doctor: 'Dr. Michael Chen',
      department: 'General Medicine',
      date: '2025-01-18',
      time: '2:00 PM',
      type: 'physical' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('dashboard.greeting', { name: user?.name || t('common.there') })}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('dashboard.subtitle')}
          </p>
        </motion.div>

        {/* Health Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.nextAppointment')}</p>
                <p className="text-2xl font-bold text-gray-900">{t('dashboard.stats.today')}</p>
                <p className="text-sm text-blue-600">10:30 AM</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.activeMedicines')}</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-emerald-600">{t('dashboard.stats.dueToday', { count: String(2) })}</p>
              </div>
              <Pill className="w-8 h-8 text-emerald-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.healthScore')}</p>
                <p className="text-2xl font-bold text-gray-900">85</p>
                <p className="text-sm text-purple-600">{t('dashboard.stats.good')}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('dashboard.stats.reports')}</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-orange-600">{t('dashboard.stats.recentReports', { count: String(3) })}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.quickActions.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <QuickActionCard
                    key={index}
                    icon={action.icon}
                    title={action.title}
                    description={action.description}
                    onClick={action.onClick}
                    gradient={action.gradient}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </motion.div>

            {/* Emergency Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{t('dashboard.emergency.title')}</h3>
                  <p className="text-red-100 mb-4">{t('dashboard.emergency.subtitle')}</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate('/emergency')}
                      className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>{t('dashboard.emergency.sos')}</span>
                    </button>
                    <button className="bg-red-600 border-2 border-white text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{t('dashboard.emergency.findHospital')}</span>
                    </button>
                  </div>
                </div>
                <AlertTriangle className="w-16 h-16 text-red-200" />
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.upcoming.title')}</h3>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {appointment.type === 'video' ? (
                        <Video className="w-6 h-6 text-blue-600" />
                      ) : (
                        <MapPin className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{appointment.doctor}</p>
                      <p className="text-xs text-gray-500">{appointment.department}</p>
                      <p className="text-xs text-gray-500">{appointment.date} {t('common.at')} {appointment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/appointments')}
                className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {t('dashboard.upcoming.viewAll')}
              </button>
            </motion.div>

            {/* Coming Soon Features */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, delay: 0.7 }}
  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
>
  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('landing.comingSoon.title')}</h3>
  <div className="space-y-3">
    {/* Regional Languages */}
     <div className="flex items-center space-x-3">
      <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
        <Globe2 className="w-4 h-4 text-orange-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">Multiple Regional Languages</p>
        <p className="text-xs text-gray-500">
          Access MediMitra in various Indian languages for better reach and inclusivity.
        </p>
      </div>
    </div>

    {/* Family Health */}
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
        <Users className="w-4 h-4 text-orange-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{t('dashboard.comingSoon.familyHealth')}</p>
        <p className="text-xs text-gray-500">{t('dashboard.comingSoon.familyHealthDesc')}</p>
      </div>
    </div>

    {/* Wearable Integration */}
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
        <Activity className="w-4 h-4 text-orange-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{t('dashboard.comingSoon.wearableIntegration')}</p>
        <p className="text-xs text-gray-500">{t('dashboard.comingSoon.wearableIntegrationDesc')}</p>
      </div>
    </div>

    {/* Stay Tuned Badge */}
    <div className="text-center mt-4">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
        {t('common.stayTuned')}
      </span>
    </div>
  </div>
</motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};
