
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Pencil, KeyRound, User, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

import { getMyProfile } from "../services/passengerService";
import type { IUser } from "@/types/user.types";
import { updateUser } from "@/redux/slice/authSlice"

import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

interface FieldProps {
  label: string;
  value?: string;
  icon: React.ReactNode;
  className?: string;
}

const Field = ({ label, value, icon, className = "" }: FieldProps) => (
  <div className={className}>
    <span className="mb-1.5 block text-xs font-medium text-slate-500">
      {label}
    </span>

    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900">
      <span className="mt-0.5 text-slate-400">{icon}</span>

      <span className="whitespace-pre-line break-words">
        {value || <span className="text-slate-400">Not added</span>}
      </span>
    </div>
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();

  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch user profile
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyProfile();

        if (!cancelled) {
          setProfile(data);

          // Keep Redux user data synchronized
          dispatch(updateUser(data));
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Profile fetching failed:", error);
        setError("Failed to load profile");
        toast.error("Failed to load profile");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

 
const handleProfileUpdate = (updated: IUser) => {
  setProfile(updated);
  dispatch(updateUser(updated));
  setShowEdit(false);
};

  return (
    <section className="min-h-screen w-full bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">

        {/* Welcome Banner */}
        <div className="rounded-2xl bg-blue-950 px-6 py-6 shadow-lg">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Welcome back, {profile?.name ?? "..."}
          </h1>

          <p className="mt-1 text-xs text-blue-200">
            Manage your personal details and account security.
          </p>
        </div>

        {/* Account Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Account Settings
            </h2>

            <div className="flex flex-wrap gap-2">

              {/* Change Password Button */}
              <button
                type="button"
                disabled={!profile}
                onClick={() => setShowPassword(true)}
                className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Change Password
              </button>

              {/* Edit Profile Button */}
              <button
                type="button"
                disabled={!profile}
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 rounded-full border border-green-600 px-3.5 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-50 disabled:opacity-40"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </button>

            </div>
          </div>

          {/* Loading */}
          {loading && (
            <p className="py-10 text-center text-sm text-slate-500">
              Loading profile...
            </p>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-10 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 text-sm font-semibold text-blue-700 hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Profile Details */}
          {!loading && profile && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <Field
                label="Full Name"
                value={profile.name}
                icon={<User className="h-4 w-4" />}
              />

              <Field
                label="Email Address"
                value={profile.email}
                icon={<Mail className="h-4 w-4" />}
              />

              <Field
                label="Phone Number"
                value={profile.phone}
                icon={<Phone className="h-4 w-4" />}
              />

            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && profile && (
<EditProfileModal
  profile={profile}
  onClose={() => setShowEdit(false)}
  onUpdated={handleProfileUpdate}
/>
      )}

      {/* Change Password Modal */}
      {showPassword && (
        <ChangePasswordModal
          onClose={() => setShowPassword(false)}
          onChanged={() => setShowPassword(false)}
        />
      )}

    </section>
  );
};

export default Profile;
