import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react'; // import the icon

function Sidebar({ filters, activeFilter, setActiveFilter }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white p-6 border-r border-gray-200 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <ul className="space-y-2">
          {filters.map((filter) => (
            <li key={filter}>
              <button
                onClick={() => setActiveFilter(filter)}
                className={`w-full text-left px-4 py-2 rounded-lg transition font-medium capitalize ${
                  activeFilter === filter
                    ? 'bg-sky-500 text-white'
                    : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                }`}
              >
                {filter}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
