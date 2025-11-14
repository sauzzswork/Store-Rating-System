import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './StoreOwner.css';


const StoreOwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchDashboard();
  }, []);


  const fetchDashboard = async () => {
    try {
      const response = await api.get('/store/dashboard');
      setDashboard(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard');
      setLoading(false);
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  return (
    <div>
      <h2>Store Dashboard - {dashboard?.store}</h2>
      <div>
        <div>
          <h3>Average Rating</h3>
          <p>{dashboard?.averageRating} / 5</p>
        </div>
        <div>
          <h3>Total Ratings</h3>
          <p>{dashboard?.totalRatings}</p>
        </div>
      </div>


      <h3>User Ratings</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>User Email</th>
            <th>Rating</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {dashboard?.ratings.map((rating) => (
            <tr key={rating.id}>
              <td>{rating.user_name}</td>
              <td>{rating.user_email}</td>
              <td>{rating.rating} / 5</td>
              <td>{new Date(rating.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default StoreOwnerDashboard