import {
  Bus,
  Users,
  Ticket,
  IndianRupee,
  Clock,
} from "lucide-react";

const stats = [
  {
    title: "Operators",
    value: "28",
    icon: Bus,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Users",
    value: "1,245",
    icon: Users,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Bookings",
    value: "326",
    icon: Ticket,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Revenue",
    value: "₹52,430",
    icon: IndianRupee,
    color: "bg-purple-100 text-purple-600",
  },
];

const recentOperators = [
  {
    company: "ABC Travels",
    owner: "Rahul",
    status: "Pending",
  },
  {
    company: "Skyline Bus",
    owner: "Arun",
    status: "Approved",
  },
  {
    company: "Metro Travels",
    owner: "John",
    status: "Pending",
  },
  {
    company: "Royal Express",
    owner: "Akash",
    status: "Approved",
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

      {/* Pending Operators */}

      {/* <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Clock className="text-amber-500" size={20} />

          <h2 className="text-lg font-semibold">
            Recent Operator Registrations
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-3">Company</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOperators.map((operator) => (
                <tr
                  key={operator.company}
                  className="border-b last:border-none"
                >
                  <td className="py-4 font-medium">
                    {operator.company}
                  </td>

                  <td>{operator.owner}</td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        operator.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {operator.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="mt-5 rounded-lg bg-[#0B1437] px-5 py-2 text-sm font-medium text-white hover:bg-[#16245d]">
          View All Operators
        </button>
      </div> */}
    </div>
  );
};

export default AdminDashboard;