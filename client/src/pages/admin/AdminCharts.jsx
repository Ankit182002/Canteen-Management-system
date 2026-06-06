import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function AdminCharts({ orders }) {

  // 🔥 GROUP ORDERS BY DATE
  const grouped = {};

  orders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString();

    if (!grouped[date]) {
      grouped[date] = { date, revenue: 0, orders: 0 };
    }

    grouped[date].revenue += order.total;
    grouped[date].orders += 1;
  });

  const data = Object.values(grouped);

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">

      {/* REVENUE */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-3">Revenue Trend</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ORDERS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-3">Orders Trend</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}