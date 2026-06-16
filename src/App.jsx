import { Outlet } from 'react-router-dom';
import Header from './components/header.jsx';

export default function App() {
  return (
    <div>
      <Header />
      <main className="mt-16">
        <Outlet />
      </main>
    </div>
  );
}
