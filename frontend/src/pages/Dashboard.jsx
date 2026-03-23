import Sidebar from "../components/Sidebar";
import Card from "../components/Card";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar />

      <div className="flex-1 p-10 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-400">
            Monitor machine health and predictive insights
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-6">
          <Card title="Total Machines" value="12" change="+2%" />
          <Card title="Active Alerts" value="3" change="-1%" />
          <Card title="Critical Issues" value="1" change="+0.5%" />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT - CHART */}
          <div className="col-span-2 bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm text-gray-400 mb-4">
              Machine Health Overview
            </h2>

            <div className="h-[250px] flex items-center justify-center text-gray-500">
              Chart loading...
            </div>
          </div>

          {/* RIGHT - ALERTS */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm text-gray-400 mb-4">Recent Alerts</h2>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">
                  Machine A overheating
                </p>
              </div>

              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-400">
                  Machine B vibration high
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI INSIGHT */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/20 rounded-2xl p-6">
          <h2 className="text-sm text-gray-400 mb-2">AI Insight</h2>
          <p className="text-gray-200">
            Abnormal vibration detected in Machine A. Maintenance recommended within 5 days.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;