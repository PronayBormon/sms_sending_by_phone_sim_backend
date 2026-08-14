
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import UserLayout from '@/layouts/user-layout';

export default function UserProfile() {
  const { user } = usePage().props as any;

  // Profile tab state
  const [firstName, setFirstName] = useState(user.first_name || '');
  const [lastName, setLastName] = useState(user.last_name || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar ? `/${user.avatar}` : "/backend/assets/images/placholder.png");

  console.log(user.avatar)

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: 'Save changes?',
      text: 'Your profile information will be updated.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, save',
    });
    if (!result.isConfirmed) return;

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    console.log(formData + "--------------");
    router.post('/user/profile', formData);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: 'Change password?',
      text: 'Your new password will be saved.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Change',
    });
    if (!result.isConfirmed) return;

    router.post('/user/password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <UserLayout>
      <div className="card card-body border-0">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Profile</h2>
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'security' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="mb-4">

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {avatarPreview && (
                    <img src={avatarPreview} alt="Avatar preview" className="rounded-circle admin-img-width-for-mobile" style={{ height: "120px", width: "120px", objectFit: "cover", borderRadius: "50%" }} />
                  )}</label>
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </div>
              <label htmlFor="firstName mb-2" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                type="text"
                className="form-control rounded-5 h-12"
                style={{
                  height: "auto",
                  padding: "10px 12px"
                }}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                type="text"
                className="form-control rounded-5 h-12"
                style={{
                  height: "auto",
                  padding: "10px 12px"
                }}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control rounded-5 h-12"
                style={{
                  height: "auto",
                  padding: "10px 12px"
                }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>


            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
              Save Profile
            </button>
          </form>
        )}

        {/* Security tab */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                className="form-control rounded-5 h-12"
                style={{
                  height: "auto",
                  padding: "10px 12px"
                }}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="form-control rounded-5 h-12"
                style={{
                  height: "auto",
                  padding: "10px 12px"
                }}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control rounded-5 h-12"
                style={{
                  height: "auto",
                  padding: "10px 12px"
                }}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
              Change Password
            </button>
          </form>
        )}

      </div>
    </UserLayout>
  );
}
