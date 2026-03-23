import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Analytics", path: "/analytics" },
    { name: "Alerts", path: "/alerts" },
    { name: "Maintenance", path: "/maintenance" },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 border-r border-gray-800 p-6">
      <h1 className="text-lg font-semibold tracking-wide mb-10">
        Predictive AI
      </h1>

      <ul className="space-y-2">
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded-lg text-sm transition ${
                location.pathname === item.path
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;