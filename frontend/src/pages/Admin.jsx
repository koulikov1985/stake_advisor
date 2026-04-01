import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLicense, setNewLicense] = useState({ email: '', plan: 'monthly', days: 30 });

  const headers = {
    'Content-Type': 'application/json',
    'x-admin-password': password
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, licensesRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/licenses?search=${search}&status=${filter}`, { headers })
      ]);

      if (!statsRes.ok || !licensesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const statsData = await statsRes.json();
      const licensesData = await licensesRes.json();

      setStats(statsData);
      setLicenses(licensesData.licenses);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, { headers });
      if (res.ok) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Connection failed');
    }
    setLoading(false);
  };

  const toggleActive = async (id, currentActive) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/licenses/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ active: !currentActive })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update');
      }
      fetchData();
    } catch (err) {
      alert('Error: ' + err.message);
      setError('Failed to update license');
    }
  };

  const deleteLicense = async (id) => {
    if (!confirm('Are you sure you want to delete this license?')) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/licenses/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      fetchData();
      alert('License deleted');
    } catch (err) {
      alert('Error: ' + err.message);
      setError('Failed to delete license');
    }
  };

  const extendLicense = async (id, days) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/licenses/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ extend_days: days })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to extend');
      }
      fetchData();
      alert('License extended by ' + days + ' days');
    } catch (err) {
      alert('Error: ' + err.message);
      setError('Failed to extend license');
    }
  };

  const addLicense = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log('Creating license:', newLicense);
      const res = await fetch(`${API_URL}/api/admin/licenses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newLicense)
      });

      const data = await res.json();
      console.log('Response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create license');
      }

      setShowAddModal(false);
      setNewLicense({ email: '', plan: 'monthly', days: 30 });
      fetchData();
      alert('License created successfully!');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [search, filter]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatus = (license) => {
    if (!license.active) return { text: 'Deactivated', class: 'status-deactivated' };
    if (new Date(license.expires_at) < new Date()) return { text: 'Expired', class: 'status-expired' };
    return { text: 'Active', class: 'status-active' };
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🦈 SharkScope Pro Admin</h1>
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          + Add License
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.total_licenses}</span>
            <span className="stat-label">Total Licenses</span>
          </div>
          <div className="stat-card active">
            <span className="stat-number">{stats.active_licenses}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card expired">
            <span className="stat-number">{stats.expired_licenses}</span>
            <span className="stat-label">Expired</span>
          </div>
          <div className="stat-card deactivated">
            <span className="stat-number">{stats.deactivated_licenses}</span>
            <span className="stat-label">Deactivated</span>
          </div>
        </div>
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Search by email or license key..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Licenses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="deactivated">Deactivated</option>
        </select>
        <button onClick={fetchData} className="btn-refresh">Refresh</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="licenses-table-container">
          <table className="licenses-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>License Key</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => {
                const status = getStatus(license);
                return (
                  <tr key={license.id}>
                    <td>{license.email}</td>
                    <td className="license-key">{license.license_key || 'No key'}</td>
                    <td className="plan">{license.plan}</td>
                    <td><span className={`status ${status.class}`}>{status.text}</span></td>
                    <td>{formatDate(license.expires_at)}</td>
                    <td className="actions">
                      <button
                        className={license.active ? 'btn-deactivate' : 'btn-activate'}
                        onClick={() => toggleActive(license.id, license.active)}
                      >
                        {license.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn-extend"
                        onClick={() => extendLicense(license.id, 7)}
                      >
                        +7 days
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteLicense(license.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {licenses.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-data">No licenses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New License</h3>
            <form onSubmit={addLicense}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newLicense.email}
                  onChange={(e) => setNewLicense({ ...newLicense, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Plan</label>
                <select
                  value={newLicense.plan}
                  onChange={(e) => setNewLicense({ ...newLicense, plan: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration (days)</label>
                <input
                  type="number"
                  value={newLicense.days}
                  onChange={(e) => setNewLicense({ ...newLicense, days: e.target.value })}
                  min="1"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create License'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
