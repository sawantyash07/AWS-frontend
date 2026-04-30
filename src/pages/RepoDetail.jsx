import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { GitBranch, GitCommit, AlertCircle, Star, Settings, Trash2 } from 'lucide-react';
import './RepoDetail.css';

const RepoDetail = ({ setFlash }) => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepoData();
  }, [id]);

  const fetchRepoData = async () => {
    try {
      const repoRes = await axios.get(`http://localhost:5000/api/repo/${id}`);
      setRepo(repoRes.data);
      
      const commitsRes = await axios.get(`http://localhost:5000/api/repo/commits/${repoRes.data.name}`);
      setCommits(commitsRes.data);
      
      const issuesRes = await axios.get(`http://localhost:5000/api/issue/repo/${repoRes.data.name}`);
      setIssues(issuesRes.data);
    } catch (err) {
      console.error("Failed to fetch repo data", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/repo/${id}/star`);
      setFlash({ message: res.data.message, type: "success" });
      fetchRepoData();
    } catch (err) {
      setFlash({ message: "Failed to toggle star", type: "error" });
    }
  };

  if (loading) return <div className="loading-text">Loading repository...</div>;
  if (!repo) return <div className="loading-text">Repository not found</div>;

  return (
    <div className="repo-detail-container">
      <div className="repo-header">
        <div className="repo-title-section">
          <GitBranch size={24} />
          <h1>{repo.name}</h1>
          <span className={`visibility-badge ${repo.visibility}`}>{repo.visibility}</span>
        </div>
        <div className="repo-actions">
          <button onClick={toggleStar} className="action-btn">
            <Star size={18} /> Star {repo.stars?.length || 0}
          </button>
        </div>
      </div>

      <div className="repo-tabs">
        <div className="tab active"><GitCommit size={18} /> Commits ({commits.length})</div>
        <Link to={`/repo/${id}/issues`} className="tab"><AlertCircle size={18} /> Issues ({issues.length})</Link>
      </div>

      <div className="repo-content">
        <div className="commits-section">
          {commits.map(commit => (
            <div key={commit._id} className="commit-card">
              <div className="commit-info">
                <h3>{commit.message}</h3>
                <p>{new Date(commit.timestamp).toLocaleString()}</p>
              </div>
              <code className="hash">{commit._id.substring(0, 7)}</code>
            </div>
          ))}
          {commits.length === 0 && <p className="empty-text">No commits yet</p>}
        </div>
      </div>
    </div>
  );
};

export default RepoDetail;
