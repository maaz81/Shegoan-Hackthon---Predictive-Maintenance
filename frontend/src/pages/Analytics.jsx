import Sidebar from "../components/Sidebar";
import Chart from "../components/Chart";

const Analytics = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>

        <Chart />
      </div>
    </div>
  );
};

export default Analytics;