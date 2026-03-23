import Sidebar from "../components/Sidebar";

const Maintenance = () => {
  const schedule = [
    { machine: "Machine A", date: "Tomorrow" },
    { machine: "Machine B", date: "In 3 days" },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Maintenance</h1>

        {schedule.map((m, i) => (
          <div key={i} className="bg-white p-4 rounded shadow mb-3">
            {m.machine} → {m.date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;