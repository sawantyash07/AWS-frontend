import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AlertCircle, MessageSquare, Send } from 'lucide-react';
import './IssueDetail.css';

const IssueDetail = ({ setFlash }) => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/issue/${id}`);
      setIssue(res.data);
    } catch (err) {
      console.error("Failed to fetch issue", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}/issue/${id}/comment`, { text: commentText });
      setCommentText('');
      setFlash({ message: "Comment added!", type: "success" });
      fetchIssue();
    } catch (err) {
      setFlash({ message: "Failed to add comment", type: "error" });
    }
  };

  if (loading) return <div className="loading-text">Loading issue...</div>;
  if (!issue) return <div className="loading-text">Issue not found</div>;

  return (
    <div className="issue-detail-container">
      <div className="issue-header">
        <h1>{issue.title} <span className="issue-number">#{issue._id.substring(0, 5)}</span></h1>
        <div className={`status-badge ${issue.status}`}>{issue.status}</div>
      </div>

      <div className="issue-meta">
        <span className="author">{issue.createdBy?.username}</span> opened this issue on {new Date(issue.createdAt).toLocaleDateString()}
      </div>

      <div className="issue-body">
        <div className="comment-card opener">
          <div className="comment-header">
            <strong>{issue.createdBy?.username}</strong> commented
          </div>
          <div className="comment-text">{issue.description}</div>
        </div>

        <div className="comments-timeline">
          {issue.comments?.map((comment, idx) => (
            <div key={idx} className="comment-card">
              <div className="comment-header">
                <strong>{comment.user?.username}</strong> commented
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))}
        </div>

        <div className="add-comment">
          <form onSubmit={handleAddComment}>
            <textarea
              placeholder="Leave a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="comment-btn">
              <Send size={18} /> Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
