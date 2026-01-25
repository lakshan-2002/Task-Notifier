import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Camera, User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Profile state
  const [profileData, setProfileData] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    occupation: '',
    bio: '',
    profileImage: null
  });

  const [originalData, setOriginalData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);

  // API Base URL
  const API_URL = 'http://44.217.52.15:8080/user_profile';

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.id) {
      toast.error('User not found. Please login again.');
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/${user.id}`);
      if (response.data && (response.data.firstName || response.data.email)) {
        const userData = response.data;
        const profileInfo = {
          id: userData.id || null,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || user.email || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          dateOfBirth: userData.dateOfBirth || '',
          occupation: userData.occupation || '',
          bio: userData.bio || '',
          profileImage: userData.profileImage || null
        };
        
        // Set preview image if exists
        if (userData.profileImage) {
          setPreviewImage(userData.profileImage);
        }
        
        setProfileData(profileInfo);
        setOriginalData(profileInfo);
        setIsNewProfile(false);
      } else {
        // No profile found, use user data from localStorage as starting point
        const profileInfo = {
          id: null,
          firstName: '',
          lastName: '',
          email: user.email || '',
          phoneNumber: '',
          address: '',
          dateOfBirth: '',
          occupation: '',
          bio: '',
          profileImage: null
        };
        setProfileData(profileInfo);
        setOriginalData(profileInfo);
        setIsNewProfile(true);
        setIsEditing(true); 
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      
      // If 404 or profile not found, treat as new profile
      if (err.response?.status === 404 || err.response?.status === 500) {
        const profileInfo = {
          firstName: '',
          lastName: '',
          email: user.email || '',
          phoneNumber: '',
          address: '',
          dateOfBirth: '',
          occupation: '',
          bio: '',
          profileImage: null
        };
        setProfileData(profileInfo);
        setOriginalData(profileInfo);
        setIsNewProfile(true);
        setIsEditing(true);
        toast.info('Please complete your profile');
      } else {
        toast.error('Failed to load profile data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileData(prev => ({
          ...prev,
          profileImage: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    // Validate required fields
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      toast.error('Please fill in all required fields (First Name, Last Name, Email)');
      return;
    }

    try {
      setIsSaving(true);
      
      // Prepare profile data
      const profilePayload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber || null,
        address: profileData.address || '',
        dateOfBirth: profileData.dateOfBirth || '',
        occupation: profileData.occupation || '',
        bio: profileData.bio || '',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      };

      let response;
      if (isNewProfile) {
        // Create new profile
        response = await axios.post(`${API_URL}`, profilePayload);
        setIsNewProfile(false);
        toast.success('Profile created successfully!');
      } else {
        // Update existing profile
        const updatePayload = {
          ...profilePayload,
          id: profileData.id
        };
        response = await axios.put(`${API_URL}`, updatePayload);
        toast.success('Profile updated successfully!');
      }
      
      // Update local state
      setOriginalData(profileData);
      setIsEditing(false);
      
    
    } catch (err) {
      console.error('Error saving profile:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save profile';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isNewProfile) {
      // For new profiles, just reset to empty but keep editing enabled
      setProfileData(originalData);
    } else {
      setProfileData(originalData);
      setIsEditing(false);
    }
  };

  const getInitials = () => {
    const first = profileData.firstName?.charAt(0)?.toUpperCase() || 'U';
    const last = profileData.lastName?.charAt(0)?.toUpperCase() || 'N';
    return `${first}${last}`;
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={isSidebarOpen}
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className={`main ${!isSidebarOpen ? 'main-expanded' : ''}`}>
        <header className="header">
          <div className="header-left">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="menu-btn"
            >
              <div className="hamburger-icon">  
                <span></span>
                <span></span>
                <span></span>
              </div>  
            </button>
            <h1 className="page-title">Profile</h1>
          </div>
        </header>

        {/* Profile Container */}
        <div className="profile-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading profile...</p>
            </div>
          ) : (
          <div className="profile-card">
            {/* Profile Header Section */}
            <div className="profile-header-section">
              <div className="profile-image-container">
                <div className="profile-image-wrapper">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="profile-image" />
                  ) : (
                    <div className="profile-image-placeholder">
                      <span className="profile-initials">{getInitials()}</span>
                    </div>
                  )}
                  {isEditing && (
                    <label htmlFor="profile-image-input" className="profile-image-upload">
                      <Camera size={20} />
                      <input
                        type="file"
                        id="profile-image-input"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                <div className="profile-header-info">
                  <h2 className="profile-name">
                    {profileData.firstName || profileData.lastName 
                      ? `${profileData.firstName} ${profileData.lastName}` 
                      : 'Your Name'}
                  </h2>
                  <p className="profile-occupation">{profileData.occupation || 'Your Occupation'}</p>
                </div>
              </div>
              
              {!isEditing && (
                <button 
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Form */}
            <form className="profile-form" onSubmit={handleSubmit}>
              {/* Bio Section */}
              <div className="profile-section">
                <h3 className="section-title">About</h3>
                <div className="profile-form-group">
                  <label htmlFor="bio" className="profile-form-label">
                    <Briefcase size={18} />
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="profile-form-textarea"
                    placeholder="Tell us about yourself..."
                    rows="3"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="profile-section">
                <h3 className="section-title">Personal Information</h3>
                
                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label htmlFor="firstName" className="profile-form-label">
                      <User size={18} />
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="profile-form-input"
                      placeholder="Enter your first name"
                      disabled={true}
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="lastName" className="profile-form-label">
                      <User size={18} />
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="profile-form-input"
                      placeholder="Enter your last name"
                      disabled={true}
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label htmlFor="dateOfBirth" className="profile-form-label">
                      <Calendar size={18} />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      className="profile-form-input"
                      placeholder="Select your date of birth"
                      disabled={true}
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="occupation" className="profile-form-label">
                      <Briefcase size={18} />
                      Occupation
                    </label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      value={profileData.occupation}
                      onChange={handleInputChange}
                      className="profile-form-input"
                      placeholder="Enter your occupation"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="profile-section">
                <h3 className="section-title">Contact Information</h3>
                
                <div className="profile-form-group">
                  <label htmlFor="email" className="profile-form-label">
                    <Mail size={18} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="profile-form-input"
                    placeholder="Enter your email address"
                    disabled={true}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="phoneNumber" className="profile-form-label">
                    <Phone size={18} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                    className="profile-form-input"
                    placeholder="Enter your phone number"
                    disabled={!isEditing}
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="address" className="profile-form-label">
                    <MapPin size={18} />
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="profile-form-input"
                    placeholder="Enter your address"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Form Actions */}
              {isEditing && (
                <div className="profile-form-actions">
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    className="profile-btn profile-btn-cancel"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="profile-btn profile-btn-save"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;