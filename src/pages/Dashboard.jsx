import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import './Dashboard.css';

const API_BASE = "http://localhost:5000/api/repo";

const Dashboard = () => {
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all`);
      setRepos(res.data);
    } catch (err) {
      console.error("Failed to fetch repos", err);
    }
  };

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        
        {/* Suggested Repositories Column */}
        <div className="dashboard-column">
          <h2 className="column-title">Suggested Repositories</h2>
          <div className="repo-list">
            <div className="repo-item-simple">testRepo</div>
            <div className="repo-item-simple">open-source-project</div>
            <div className="repo-item-simple">learning-git</div>
          </div>
        </div>

        {/* Your Repositories Column */}
        <div className="dashboard-column middle">
          <h2 className="column-title">Your Repositories</h2>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search..." 
              className="repo-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="repo-list">
            {filteredRepos.map(repo => (
              <motion.div
                key={repo._id}
                whileHover={{ x: 5 }}
                className="repo-item-simple"
              >
                {repo.name}
              </motion.div>
            ))}
            {repos.length === 0 && <p className="empty-text">No repositories found</p>}
          </div>
        </div>

        {/* Upcoming Events Column */}
        <div className="dashboard-column">
          <h2 className="column-title">Upcoming Events</h2>
          <ul className="events-list">
            <li>Tech Conference - Dec 15</li>
            <li>Developer Meetup - Dec 22</li>
            <li>New Year Hackathon - Jan 5</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
