import Sidebar from "../components/Sidebar";

const Alerts = () => {
  const alerts = [
    { msg: "Machine A overheating", level: "Critical" },
    { msg: "Machine B vibration high", level: "Warning" },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Alerts</h1>

        {alerts.map((a, i) => (
          <div
            key={i}
            className={`p-4 mb-3 rounded shadow ${
              a.level === "Critical" ? "bg-red-200" : "bg-yellow-200"
            }`}
          >
            {a.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;