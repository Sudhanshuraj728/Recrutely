import { Routes } from 'react-router-dom';
import { ToastProvider } from '../components/ui';
import { AuthProvider } from '../context/AuthContext';
import { IntroProvider } from '../context/IntroContext';
import { ThemeProvider } from '../context/ThemeContext';
import { IntroOverlay } from '../pages/landing/IntroOverlay';
import { appRoutes } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <IntroProvider>
        <AuthProvider>
          <ToastProvider>
            <IntroOverlay />
            <Routes>{appRoutes}</Routes>
          </ToastProvider>
        </AuthProvider>
      </IntroProvider>
    </ThemeProvider>
  );
}
