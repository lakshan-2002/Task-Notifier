import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Camera, User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: 'Lakshan',
    lastName: 'Imantha',
    email: 'lakshan.imantha02@gmail.com',
    phone: '0702294900',
    address: 'No 301/3, Kanampitiya Road, Galle',
    dateOfBirth: '2002-10-02',
    occupation: 'Backend Developer',
    bio: 'Backend developer and a Java enthusiast. Passionate about building scalable web applications and enjoy working with Java and Spring Boot.',
    profileImage: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    setIsEditing(false);
    // Add your API call here to save profile data
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  const getInitials = () => {
    return `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`;
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
                  <h2 className="profile-name">{profileData.firstName} {profileData.lastName}</h2>
                  <p className="profile-occupation">{profileData.occupation}</p>
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
                    placeholder="Tell us about yourself"
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
                      placeholder="First name"
                      disabled={!isEditing}
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
                      placeholder="Last name"
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      placeholder="Your occupation"
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
                    placeholder="your.email@example.com"
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="phone" className="profile-form-label">
                    <Phone size={18} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="profile-form-input"
                    placeholder="+1 (555) 123-4567"
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
                    placeholder="Your address"
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
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="profile-btn profile-btn-save"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;