import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

export default function ProfilePage() {
  const { authUser, isUpdatingAvatar, updateAvatar } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const resizeImage = (file) => {
      return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = (event) => {
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800; // Adjust max width as needed
            const MAX_HEIGHT = 800; // Adjust max height as needed
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = (height * MAX_WIDTH) / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = (width * MAX_HEIGHT) / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.8)); // Adjust quality if needed
          };
        };
      });
    };

    const resizedBase64 = await resizeImage(file);
    setSelectedImage(resizedBase64); // Update preview with resized image
    await updateAvatar({ avatar: resizedBase64 }); // Send resized image to backend
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p>Your profile imformation</p>
          </div>

          {/* AVATAR UPLOAD SECITION */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="size-32 rounded-full p-1 bg-base-300 border-[3px]">
                <img
                  src={selectedImage || authUser.avatar || "/default.jpg"}
                  alt="Profile"
                  className="size-full rounded-full object-cover border-4"
                />
              </div>

              <label
                htmlFor="avatar-upload"
                className={`absolute -bottom-1 border-[3px] border-base-300 -right-1 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingAvatar ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="size-5 text-base-200" />
                <input
                  type="file"
                  name="avatar-upload"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingAvatar}
                  hidden
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingAvatar
                ? "Updating..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5 opacity-50 cursor-not-allowed">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="size-4" />
                Full Name
              </div>
              <p className="px-4 py-2 5 bg-base-200 rounded-lg border">
                {authUser?.fName}
              </p>
            </div>
            <div className="space-y-1.5 opacity-50 cursor-not-allowed">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="size-4" />
                Email Address
              </div>
              <p className="px-4 py-2 5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6 pb-0">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
