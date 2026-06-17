import { useState }  from 'react';
import axiosInstance from '../services/axiosInstance';
import useAuth       from '../hooks/useAuth';
import InputField    from '../components/InputField';

const Profile = () => {
  const { user, updateUserContext } = useAuth();

  // Pre-fill form with current values from the auth context
  const [profile, setProfile] = useState({
    name:   user?.name   || '',
    phone:  user?.phone  || '',
    avatar: user?.avatar || '',
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
  });

  // Separate success and error messages for each form
  const [profileMsg,   setProfileMsg]   = useState('');
  const [pwMsg,        setPwMsg]        = useState('');
  const [profileError, setProfileError] = useState('');
  const [pwError,      setPwError]      = useState('');

  // ===== HANDLE PROFILE UPDATE =====
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    try {
      await axiosInstance.put('/users/me', profile);

      // Re-fetch fresh user data from the database and update the context
      // This ensures the navbar and other parts of the UI reflect the change
      await updateUserContext();
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Update failed');
    }
  };

  // ===== HANDLE PASSWORD CHANGE =====
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMsg('');
    setPwError('');

    // Client-side length check before hitting the server
    if (passwords.newPassword.length < 6) {
      return setPwError('New password must be at least 6 characters');
    }

    try {
      // Server verifies old password before allowing the change
      await axiosInstance.put('/users/me/password', passwords);
      setPwMsg('Password changed successfully.');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Account Settings</h2>
      </div>

      {/* ===== PROFILE SECTION ===== */}
      <div className="profile-section">
        <h3>Personal Information</h3>
        {profileMsg   && <div className="alert alert--success">{profileMsg}</div>}
        {profileError && <div className="alert alert--error">{profileError}</div>}
        <form onSubmit={handleProfileSubmit}>
          <InputField
            label="Display Name"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
          />
          <InputField
            label="Phone Number"
            value={profile.phone}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
          />
          <InputField
            label="Avatar URL"
            value={profile.avatar}
            onChange={e => setProfile({ ...profile, avatar: e.target.value })}
            placeholder="https://..."
          />
          <button type="submit" className="btn btn--primary">
            Save Profile
          </button>
        </form>
      </div>

      {/* ===== PASSWORD SECTION ===== */}
      <div className="profile-section">
        <h3>Change Password</h3>
        {pwMsg   && <div className="alert alert--success">{pwMsg}</div>}
        {pwError && <div className="alert alert--error">{pwError}</div>}
        <form onSubmit={handlePasswordSubmit}>
          <InputField
            label="Current Password"
            type="password"
            value={passwords.oldPassword}
            onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
          />
          <InputField
            label="New Password"
            type="password"
            value={passwords.newPassword}
            onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
          <button type="submit" className="btn btn--primary">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;