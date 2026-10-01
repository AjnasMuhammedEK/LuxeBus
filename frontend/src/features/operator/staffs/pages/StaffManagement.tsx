// src/features/operator/staff/pages/StaffManagement.tsx
import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Users, UserCheck, Search, Pencil, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import AddStaffModal from "@/features/operator/staffs/components/AddStaffModal";
import type { IStaff } from "@/types/staff.types";
import { getStaffs } from "../service/staffService";
import StaffDetailsModal from "../components/StaffDetailsModal";
import EditStaffModal from "../components/EditStaffModal";

const PAGE_SIZE = 5;

const StaffManagement = () => {
  const [staff, setStaff] = useState<IStaff[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("fullName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [selectedStaff, setSelectedStaff] = useState<IStaff | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [editStaff, setEditStaff] = useState<IStaff | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadStaffs = async () => {
      try {
        setIsLoading(true);

        const response = await getStaffs({
          page,
          limit: PAGE_SIZE,
          search,
          sortBy,
          sortOrder,
        });

        if (cancelled) return;

        setStaff(response.data.staff);
        setTotal(response.data.pagination.totalItems);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch staffs:", error);
        toast.error("Failed to load staff");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadStaffs();

    return () => {
      cancelled = true;
    };
  }, [page, search, sortBy, sortOrder,refreshKey])


  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const pageNumbers = useMemo(() => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);



  const handleViewStaff = (member: IStaff) => {
    setSelectedStaff(member);
    setDetailsOpen(true);
  };

  const handleEditStaff = (member: IStaff) => {
    setEditStaff(member);
    setEditOpen(true);
  };

  const handleStaffUpdated = (updated: IStaff) => {
    setStaff((prev) =>
      prev.map((member) => (member._id === updated._id ? { ...member, ...updated } : member))
    );
  };

  const onDutyCount = useMemo(() => {
    return staff.filter((member) => member.status === "on-duty").length;
  }, [staff]);

 

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold text-slate-900">Staff Management</h1>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800"
          >
            <Users className="h-4 w-4" />
            New Staff
          </button>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Total Staff
              </p>
              <p className="mt-1.5 text-2xl font-bold text-slate-900">{total}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-4 w-4 text-blue-700" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Active on Duty
              </p>
              {/* <p className="mt-1.5 text-2xl font-bold text-slate-900">{activeOnDuty}</p> */}
              <p className="mt-1 text-xs text-slate-400">{onDutyCount}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <UserCheck className="h-4 w-4 text-blue-700" />
            </div>
          </div>
        </div>

        {/* Directory */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-sm font-bold text-slate-900">Staff Directory</h2>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 sm:w-64">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search staff..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Sort by */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setPage(1);
                  setSortBy(e.target.value);
                }}
                className="h-[42px] rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="fullName">Name</option>
                <option value="joiningDate">Joining Date</option>
              </select>

              {/* Order */}
              <select
                value={sortOrder}
                onChange={(e) => {
                  setPage(1);
                  setSortOrder(e.target.value as "asc" | "desc");
                }}
                className="h-[42px] rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Staff Name</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Mobile Number</th>
                  <th className="px-6 py-3">Status</th>
                  <th  className="px-6 py-3">Blocked</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    </td>
                  </tr>
                ) : staff.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                      No staff match your search.
                    </td>
                  </tr>
                ) : (
                  staff.map((member) => (
                    <tr key={member._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-6 py-3.5 font-medium text-slate-800">{member.fullName}</td>
                      <td className="px-6 py-3.5 capitalize text-slate-500">{member.role}</td>
                      <td className="px-6 py-3.5 text-slate-500">{member.phone}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            member.status === "on-duty"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              member.status === "on-duty"
                                ? "bg-blue-600"
                                : "bg-slate-400"
                            }`}
                          />

                          {member.status === "on-duty" ? "On-duty" : "Off-duty"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            member.isBlocked
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {member.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleViewStaff(member)}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            aria-label={`View ${member.fullName}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditStaff(member)}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            aria-label={`Edit ${member.fullName}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row">
            <p className="text-xs text-slate-400">
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(page * PAGE_SIZE, total)} of {total} staff members
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  disabled={isLoading}
                  className={`h-7 w-7 rounded-md text-xs font-semibold ${
                    page === n ? "bg-blue-900 text-white" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddStaffModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          setPage(1);
          setRefreshKey((prev) => prev + 1);
        }}
      />

      <StaffDetailsModal
        open={detailsOpen}
        staff={selectedStaff}
        onClose={() => setDetailsOpen(false)}
      />

      {editOpen && editStaff && (
        <EditStaffModal
          key={editStaff._id}
          open={editOpen}
          staff={editStaff}
          onClose={() => setEditOpen(false)}
          onUpdated={handleStaffUpdated}
        />
      )}
    </div>
  );
};

export default StaffManagement;