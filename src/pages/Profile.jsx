import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Calendar, Trash2, Edit3, Star, Users, Layout, MapPin, Link as LinkIcon } from 'lucide-react';
import Heatmap from '../components/Heatmap';
import './Profile.css';

const Profile = ({ setFlash }) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/user/${user.username}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.delete('/api/user/profile');
        setFlash({ message: "Account deleted.", type: "info" });
        logout();
      } catch (err) {
        setFlash({ message: "Deletion failed", type: "error" });
      }
    }
  };

  if (!profile) return <div className="loading-text">Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="profile-avatar-large">
          {profile.username[0].toUpperCase()}
        </div>
        <h1 className="profile-name">{profile.username}</h1>
        <p className="profile-bio">Full-stack Developer | Custom VCS Contributor</p>
        
        <button className="follow-btn">Follow</button>

        <div className="profile-stats-counts">
          <div className="count-item">
            <Users size={16} />
            <span><b>{profile.followers?.length || 0}</b> followers</span>
          </div>
          <div className="count-item">
            <span><b>{profile.following?.length || 0}</b> following</span>
          </div>
        </div>

        <div className="profile-meta-list">
          <div className="meta-item"><MapPin size={16} /> Mumbai, India</div>
          <div className="meta-item"><Mail size={16} /> {profile.email}</div>
          <div className="meta-item"><LinkIcon size={16} /> https://vcs-portfolio.com</div>
          <div className="meta-item"><Calendar size={16} /> Joined on {new Date(profile.joinedAt).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="profile-main">
        <nav className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Layout size={18} /> Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'starred' ? 'active' : ''}`}
            onClick={() => setActiveTab('starred')}
          >
            <Star size={18} /> Starred <span className="tab-count">{profile.starRepos?.length || 0}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers <span className="tab-count">{profile.followers?.length || 0}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following <span className="tab-count">{profile.following?.length || 0}</span>
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="pinned-repos">
                <h3>Pinned Repositories</h3>
                <div className="pinned-grid">
                  {profile.repositories?.slice(0, 4).map(repo => (
                    <div key={repo._id} className="pinned-card">
                      <div className="pinned-repo-header">
                        <Layout size={14} color="#8b949e" />
                        <span className="repo-name-link">{repo.name}</span>
                      </div>
                      <p className="repo-desc">Custom VCS repository for {repo.name}</p>
                      <div className="repo-footer">
                        <span className="lang-dot"></span> JavaScript
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Heatmap userContributions={profile.contributions} />
            </div>
          )}

          {activeTab === 'starred' && (
            <div className="starred-section">
              <h3>Starred Repositories</h3>
              <div className="repo-list-full">
                {profile.starRepos?.length > 0 ? (
                  profile.starRepos.map(repo => (
                    <div key={repo._id} className="repo-row">
                      <h4>{repo.name}</h4>
                      <button className="unstar-btn"><Star size={14} fill="#e3b341" color="#e3b341" /> Starred</button>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No starred repositories yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="followers-section">
              <h3>Followers</h3>
              <div className="user-list">
                <p className="empty-state">You don't have any followers yet.</p>
              </div>
            </div>
          )}

          {activeTab === 'following' && (
            <div className="following-section">
              <h3>Following</h3>
              <div className="user-list">
                <p className="empty-state">You aren't following anyone yet.</p>
              </div>
            </div>
          )}
        </div>

        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <button onClick={handleDelete} className="delete-btn-minimal">
            <Trash2 size={16} /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
