import { useState } from 'react';
import Directory from './pages/Directory';
import AddEmployee from './pages/AddEmployee';
import Attendance from './pages/Attendance';
import { Users, ClipboardList, UserPlus, LogOut } from 'lucide-react';

type Page = 'directory' | 'add-employee' | 'attendance' | 'dashboard';

function App() {
  const [activePage, setActivePage] = useState<Page>('directory');

  const renderPage = () => {
    switch (activePage) {
      case 'directory':
        return <Directory onAdd={() => setActivePage('add-employee')} />;
      case 'add-employee':
        return <AddEmployee onBack={() => setActivePage('directory')} onSuccess={() => setActivePage('directory')} />;
      case 'attendance':
        return <Attendance />;
      default:
        return <Directory onAdd={() => setActivePage('add-employee')} />;
    }
  };

  const navItems = [
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList },
    { id: 'add-employee', label: 'Add Employee', icon: UserPlus },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-100 p-6 flex flex-col gap-8 shadow-sm">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">H</div>
          <span className="text-xl font-black text-slate-900 tracking-tight">HRMS<span className="text-blue-600">LITE</span></span>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as Page)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${activePage === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <item.icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all w-full">
            <LogOut size={20} />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
