import { Navigate, Route } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import DevKit from '../pages/DevKit';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Resume from '../pages/Resume';
import ResumeAnalysis from '../pages/ResumeAnalysis';
import Jobs from '../pages/Jobs';
import JobDetails from '../pages/JobDetails';
import Companies from '../pages/Companies';
import CompanyDetails from '../pages/CompanyDetails';
import Networking from '../pages/Networking';
import Templates from '../pages/Templates';
import Applications from '../pages/Applications';
import Upgrade from '../pages/Upgrade';
import Pricing from '../pages/Pricing';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Admin from '../pages/Admin';
import NotFound from '../pages/NotFound';

export const appRoutes = (
  <>
    <Route index element={<Landing />} />
    <Route element={<AppLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/resume/:id" element={<Resume />} />
      <Route path="/analysis/:id" element={<ResumeAnalysis />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/companies/:id" element={<CompanyDetails />} />
      <Route path="/networking" element={<Networking />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/upgrade" element={<Upgrade />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/devkit" element={<DevKit />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/home" element={<Navigate to="/" replace />} />
  </>
);
