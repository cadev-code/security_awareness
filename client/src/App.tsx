import { Layout } from '@/components';
import { Router } from '@/routes';
import { useLocation } from 'react-router';

const App = () => {
  const location = useLocation();

  return location.pathname.startsWith('/admin') ? (
    <Router />
  ) : (
    <Layout children={<Router />} />
  );
};

export default App;
