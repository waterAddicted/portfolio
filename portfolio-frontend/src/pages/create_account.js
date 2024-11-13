import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const { register, authMessage, loading } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const userDetails = {
        username,
        fullName,
        birthDate,
        password,
        profilePicture, 
      };
      register(userDetails);
    }
  };

  const handleBirthDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);
    setBirthDate(value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePasswords(e.target.value, repeatPassword);
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
    validatePasswords(password, e.target.value);
  };

  const validatePasswords = (pass, repeatPass) => {
    if (pass.length < 8) {
      setError('Password must be at least 8 characters long.');
    } else if (pass !== repeatPass) {
      setError('Passwords do not match.');
    } else {
      setError('');
    }
  };

  const isFormValid = () => {
    return (
      username && 
      fullName && 
      birthDate && 
      password.length >= 8 && 
      password === repeatPassword && 
      error === '' &&
      profilePicture 
    );
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); 
      };
      reader.readAsDataURL(file);
    }    
  };

  return (
    <div
      className="min-h-screen flex items-start justify-start bg-cover bg-center p-10"
      style={{ backgroundImage: "url('/background_create_acc.jpg')" }}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="profile-picture" className="cursor-pointer">
            <div className="w-32 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center mb-4">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover rounded" />
              ) : (
                <span className="text-gray-500">+</span> 
              )}
            </div>
          </label>
          <input
            id="profile-picture"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden" 
          />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <label className="text-gray-700 font-medium mb-1 w-1/3">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-2/3 border-b border-gray-400 focus:outline-none focus:border-blue-500 text-sm bg-transparent placeholder-gray-500"
            />
          </div>
          
          <div className="flex items-center">
            <label className="text-gray-700 font-medium mb-1 w-1/3">Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-2/3 border-b border-gray-400 focus:outline-none focus:border-blue-500 text-sm bg-transparent placeholder-gray-500"
            />
          </div>
          
          <div className="flex items-center">
            <label className="text-gray-700 font-medium mb-1 w-1/3">Birth Date:</label>
            <input
              type="text"
              maxLength={10} 
              placeholder="dd/mm/yyyy" 
              value={birthDate} 
              onChange={handleBirthDateChange} 
              className="w-2/3 border-b border-gray-400 focus:outline-none focus:border-blue-500 text-sm bg-transparent placeholder-gray-500"
            />
          </div>

          <div className="flex items-center">
            <label className="text-gray-700 font-medium mb-1 w-1/3">Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-2/3 border-b border-gray-400 focus:outline-none focus:border-blue-500 text-sm bg-transparent placeholder-gray-500"
            />
          </div>

          <div className="flex items-center">
            <label className="text-gray-700 font-medium mb-1 w-1/3">Repeat Password:</label>
            <input
              type="password"
              value={repeatPassword}
              onChange={handleRepeatPasswordChange}
              className="w-2/3 border-b border-gray-400 focus:outline-none focus:border-blue-500 text-sm bg-transparent placeholder-gray-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {authMessage && <p className="text-green-500 text-sm">{authMessage}</p>}

          {isFormValid() && (
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
