import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <div>
          <h3>Total Users</h3>
          <p>{stats?.totalUsers || 0}</p>
        </div>
        <div>
          <h3>Total Stores</h3>
          <p>{stats?.totalStores || 0}</p>
        </div>
        <div>
          <h3>Total Ratings</h3>
          <p>{stats?.totalRatings || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;