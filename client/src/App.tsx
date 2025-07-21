import { Layout } from '@/components';
import { Router } from '@/routes';

const App = () => {
  return <Layout children={<Router />} />;
};

export default App;
