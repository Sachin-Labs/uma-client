import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Layout from './components/Layout/Layout';
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SetPassword from './pages/auth/SetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import MarkAttendance from './pages/attendance/MarkAttendance';
import MyAttendance from './pages/attendance/MyAttendance';
import ManageAttendance from './pages/attendance/ManageAttendance';
import MyLeaves from './pages/leave/MyLeaves';
import ManageLeaves from './pages/leave/ManageLeaves';
import ManageTeams from './pages/teams/ManageTeams';
import ManageUsers from './pages/users/ManageUsers';
import ManageHolidays from './pages/holidays/ManageHolidays';
import Holidays from './pages/holidays/Holidays';
import AuditLogs from './pages/audit/AuditLogs';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

import { ThemeProvider } from './context/ThemeContext';

function App() {
    const { loading } = useAuth();

    if (loading) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    return (
        <ThemeProvider>
            <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            <Route path="/set-password/:token" element={<PublicRoute><SetPassword /></PublicRoute>} />

            {/* Protected with Layout */}
            <Route path="/app" element={
                <ProtectedRoute><Layout /></ProtectedRoute>
            }>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* Employee */}
                <Route path="attendance/mark" element={
                    <ProtectedRoute allowedRoles={['EMPLOYEE']}><MarkAttendance /></ProtectedRoute>
                } />
                <Route path="attendance/my" element={
                    <ProtectedRoute allowedRoles={['EMPLOYEE']}><MyAttendance /></ProtectedRoute>
                } />
                <Route path="leaves/my" element={
                    <ProtectedRoute allowedRoles={['EMPLOYEE']}><MyLeaves /></ProtectedRoute>
                } />

                {/* Admin / HR */}
                <Route path="attendance/manage" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HR']}><ManageAttendance /></ProtectedRoute>
                } />
                <Route path="leaves/manage" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HR']}><ManageLeaves /></ProtectedRoute>
                } />
                <Route path="teams" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HR']}><ManageTeams /></ProtectedRoute>
                } />
                <Route path="holidays" element={
                    <ProtectedRoute><Holidays /></ProtectedRoute>
                } />
                <Route path="holidays/manage" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}><ManageHolidays /></ProtectedRoute>
                } />
                <Route path="audit-logs" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}><AuditLogs /></ProtectedRoute>
                } />
                <Route path="users" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HR']}><ManageUsers /></ProtectedRoute>
                } />
                <Route path="reports" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HR']}><Reports /></ProtectedRoute>
                } />
                <Route path="settings" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}><Settings /></ProtectedRoute>
                } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ThemeProvider>
    );
}

export default App;
