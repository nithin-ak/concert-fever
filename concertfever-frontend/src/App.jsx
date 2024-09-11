import Router from './Router';
import { ContextProvider } from './Context';

// Importing bootstrap CSS globally
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
  <ContextProvider>
    <Router />
  </ContextProvider>
);

export default App;
