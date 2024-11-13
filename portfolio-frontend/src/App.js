import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import './index.css';

function App() {
  const [showVideo, setShowVideo] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { login, authMessage, loading } = useContext(AuthContext);

  const handleVideoOpen = () => {
    setShowVideo(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
    navigate('/create-account');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginSuccess = await login({ username, password });
    if (loginSuccess) {
      navigate('/home'); 
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
      }}
    >
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <video
            ref={videoRef}
            src={`${process.env.PUBLIC_URL}/create_acc_vid.mp4`}
            autoPlay
            className="w-full h-full object-cover"
            style={{ display: 'block' }}
            playsInline
            onEnded={handleVideoEnd}
          />
        </div>
      )}

      <div
        className="p-4 rounded-lg flex flex-row items-center w-full max-w-xs"
        style={{ transform: 'translateY(-5px)' }}
      >
        <form className="flex flex-col w-full" onSubmit={handleLogin}>
          <label className="flex mb-3 items-center">
            <span className="italic font-medium w-2/5 text-right pr-2 text-sm">Username:</span>
            <input
              type="text"
              className="ml-auto w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xs"
              style={{ background: 'transparent' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="flex mb-3 items-center">
            <span className="italic font-medium w-2/5 text-right pr-2 text-sm">Password:</span>
            <input
              type="password"
              className="ml-auto w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 text-xs"
              style={{ background: 'transparent' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {authMessage && <p className="text-red-500 text-sm">{authMessage}</p>}
          <button
            type="submit"
            className="bg-green-400 text-black h-9 w-2/4 border-2 border-black rounded-lg mt-8 text-sm self-center"
            disabled={loading}
          >
            <em><i>{loading ? 'Logging in...' : 'Log in!'}</i></em>
          </button>
          <button
            type="button"
            onClick={handleVideoOpen}
            className="bg-blue-500 text-black h-9 w-2/4 border-2 border-black rounded-lg mt-2 text-sm self-center"
          >
            <em><i>Sign up!</i></em>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
