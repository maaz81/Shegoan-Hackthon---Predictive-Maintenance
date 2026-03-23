import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart, AlertTriangle, Wrench } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Analytics", icon: BarChart, path: "/analytics" },
    { name: "Alerts", icon: AlertTriangle, path: "/alerts" },
    { name: "Maintenance", icon: Wrench, path: "/maintenance" },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 border-r border-gray-800 p-6">
      <h1 className="text-lg font-semibold mb-10">Predictive AI</h1>

      <ul className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === item.path
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1"
                  }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;