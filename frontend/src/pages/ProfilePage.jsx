import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-scroll pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6 sm:p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
            <p className="mt-1.5 text-sm text-base-content/60">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-base-200 shadow-md"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0
                  bg-primary hover:bg-primary-focus hover:scale-105
                  p-2.5 rounded-full cursor-pointer shadow-lg
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-primary-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-base-content/60">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="text-xs font-medium uppercase tracking-wide text-base-content/50 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200/60 rounded-xl border border-base-300 font-medium">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-medium uppercase tracking-wide text-base-content/50 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200/60 rounded-xl border border-base-300 font-medium">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl p-5 bg-base-200/40 border border-base-300">
            <h2 className="text-base font-semibold mb-4 tracking-tight">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2.5 border-b border-base-300">
                <span className="text-base-content/60">Member Since</span>
                <span className="font-medium">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-base-content/60">Account Status</span>
                <span className="badge badge-success badge-sm gap-1.5 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
