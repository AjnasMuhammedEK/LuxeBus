import {
  Bus,
  Users,
  Ticket,
  IndianRupee,
 } from "lucide-react";

const stats = [
  {
    title: "Operators",
    value: "Comming Soon",
    icon: Bus,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Users",
    value: "Comming Soon",
    icon: Users,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Bookings",
    value: "Comming Soon",
    icon: Ticket,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Revenue",
    value: "Comming Soon",
    icon: IndianRupee,
    color: "bg-purple-100 text-purple-600",
  },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Heading */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome Back 👋
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your LuxeBus platform from here.
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`rounded-full p-3 ${item.color}`}
                >
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      Comming Soon 

    </div>
  );
};

export default AdminDashboard;