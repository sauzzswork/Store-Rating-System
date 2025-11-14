import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import './User.css';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);

  const fetchStores = useCallback(async () => {
    try {
      const params = {
        ...filters,
        sortBy,
        sortOrder,
      };
      const response = await api.get('/user/stores', { params });
      setStores(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleSubmitRating = async () => {
    if (!rating || rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }
    try {
      await api.post('/user/ratings', {
        storeId: selectedStore.id,
        rating: parseInt(rating),
      });
      alert('Rating submitted successfully!');
      setSelectedStore(null);
      setRating(0);
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Available Stores</h2>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by address..."
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <button type="submit">Search</button>
      </form>

      {/* Stores Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Store Name {sortBy === 'name' && (sortOrder === 'ASC' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('address')} style={{ cursor: 'pointer' }}>
              Address {sortBy === 'address' && (sortOrder === 'ASC' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('overall_rating')} style={{ cursor: 'pointer' }}>
              Overall Rating {sortBy === 'overall_rating' && (sortOrder === 'ASC' ? '↑' : '↓')}
            </th>
            <th>Your Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.overall_rating} / 5</td>
              <td>{store.user_rating ? `${store.user_rating} / 5` : 'Not rated'}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedStore(store);
                    setRating(store.user_rating || 0);
                  }}
                  className="btn-small"
                >
                  {store.user_rating ? 'Update Rating' : 'Rate Store'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rating Modal */}
      {selectedStore && (
        <div>
          <div>
            <h3>Rate {selectedStore.name}</h3>
            <div>
              <label>Select Rating (1-5):</label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`star ${star <= rating ? 'active' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div>
              <button onClick={handleSubmitRating} className="btn-primary">
                Submit Rating
              </button>
              <button onClick={() => setSelectedStore(null)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;
