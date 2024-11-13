import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useContext(AuthContext); 
  const [artworks, setArtworks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editArtworkData, setEditArtworkData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtworks = async () => {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access Token:', accessToken);
    
      if (!accessToken) {
        console.error('Access token is missing. User might not be authenticated.');
        return;
      }
    
      try {
        const response = await axios.get('http://localhost:8000/artwork', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        console.log('Received artworks:', response.data);
        setArtworks(response.data);
      } catch (error) {
        console.error('Error fetching artworks:', error.response ? error.response.data : error.message);
      }
    };
    

    fetchArtworks();
}, [user]); 

  const handleAddArtwork = async (e) => {
    e.preventDefault();
    if (!editArtworkData?.file) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('title', editArtworkData?.title || '');
    formData.append('description', editArtworkData?.description || '');
    formData.append('status', editArtworkData?.status === 'VISIBLE' ? 0 : 1);
    formData.append('file', editArtworkData.file);

    try {
      const response = await axios.post('http://localhost:8000/artwork', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      });
      setArtworks([...artworks, response.data]);
      setEditArtworkData(null);
      setShowAddForm(false);
      alert('Artwork added successfully!');
    } catch (error) {
      console.error('Error adding artwork:', error);
    }
  };

  const handleEditArtwork = (artwork) => {
    setEditArtworkData({ ...artwork, file: null });
  };

  const handleSaveEdit = async (artworkId) => {
    const formData = new FormData();
    formData.append('title', editArtworkData?.title || '');
    formData.append('description', editArtworkData?.description || '');
    formData.append('status', editArtworkData?.status === 'VISIBLE' ? 0 : 1);
    if (editArtworkData?.file) {
      formData.append('file', editArtworkData.file);
    }

    try {
      const response = await axios.patch(`http://localhost:8000/artwork/${artworkId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      });
      setArtworks(
        artworks.map((artwork) =>
          artwork.id === artworkId ? { ...artwork, ...response.data } : artwork
        )
      );
      setEditArtworkData(null);
      alert('Artwork updated successfully!');
    } catch (error) {
      console.error('Error updating artwork:', error);
    }
  };

  const handleDeleteArtwork = async (artworkId) => {
    try {
      await axios.delete(`http://localhost:8000/artwork/${artworkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      });
      setArtworks(artworks.filter((artwork) => artwork.id !== artworkId));
    } catch (error) {
      console.error('Error deleting artwork:', error);
    }
  };

  return (
    <div className="home-container min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/home_background.png)' }}>
      <header className="header flex justify-between items-center p-4 bg-opacity-75">
        <div className="logo text-2xl font-bold text-white">Art Gallery</div>
        <div className="user-profile flex items-center space-x-4">
          <img src={user?.profilePictureUrl ? `http://localhost:8000${user.profilePictureUrl}` : '/placeholder_image.png'} alt="Profile" className="profile-pic w-10 h-10 rounded-full" />
          <span className="text-white font-medium">{user?.userName}</span>
          <button onClick={() => navigate('/profile')} className="bg-blue-500 text-white px-4 py-2 rounded">Profile</button>
        </div>
      </header>

      {parseInt(localStorage.getItem('userId')) === 10 && (
        <div className="flex justify-start p-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-4 py-2 rounded ${showAddForm ? 'bg-red-500' : 'bg-green-500'} text-white`}
          >
            {showAddForm ? 'Close Form' : 'Add Artwork'}
          </button>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddArtwork} className="add-artwork-form p-4 bg-white rounded-lg shadow-md my-4 max-w-md mx-auto">
          <input
            type="text"
            value={editArtworkData?.title || ''}
            onChange={(e) => setEditArtworkData({ ...editArtworkData, title: e.target.value })}
            placeholder="Title"
            required
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            value={editArtworkData?.description || ''}
            onChange={(e) => setEditArtworkData({ ...editArtworkData, description: e.target.value })}
            placeholder="Description"
            className="w-full p-2 mb-2 border rounded"
          ></textarea>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setEditArtworkData({ ...editArtworkData, file: e.target.files[0] })}
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            value={editArtworkData?.status || 'VISIBLE'}
            onChange={(e) => setEditArtworkData({ ...editArtworkData, status: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="VISIBLE">Visible</option>
            <option value="HIDDEN">Hidden</option>
          </select>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Artwork</button>
        </form>
      )}

      <div className="gallery grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="artwork-card bg-white rounded-lg shadow-md overflow-hidden">
            {editArtworkData?.id === artwork.id ? (
              <div className="edit-artwork-form p-4">
                <input
                  type="text"
                  value={editArtworkData?.title || ''}
                  onChange={(e) => setEditArtworkData({ ...editArtworkData, title: e.target.value })}
                  placeholder="Title"
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  value={editArtworkData?.description || ''}
                  onChange={(e) => setEditArtworkData({ ...editArtworkData, description: e.target.value })}
                  placeholder="Description"
                  className="w-full p-2 mb-2 border rounded"
                ></textarea>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => setEditArtworkData({ ...editArtworkData, file: e.target.files[0] })}
                  className="w-full p-2 mb-2 border rounded"
                />
                <select
                  value={editArtworkData?.status || 'VISIBLE'}
                  onChange={(e) => setEditArtworkData({ ...editArtworkData, status: e.target.value })}
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="VISIBLE">Visible</option>
                  <option value="HIDDEN">Hidden</option>
                </select>
                <button onClick={() => handleSaveEdit(artwork.id)} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              </div>
            ) : (
              <>
                <img src={artwork.artworkImageUrl ? `http://localhost:8000${artwork.artworkImageUrl}` : '/placeholder_image.png'} alt={artwork.title} className="artwork-image w-full h-48 object-cover" />
                <div className="artwork-info p-4">
                  <h3 className="text-xl font-semibold">{artwork.title}</h3>
                  <p className="text-gray-600">{artwork.description}</p>
                </div>
                {parseInt(localStorage.getItem('userId')) === 10 && (
                  <div className="artwork-actions flex justify-between p-4">
                    <button onClick={() => handleEditArtwork(artwork)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                    <button onClick={() => handleDeleteArtwork(artwork.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;