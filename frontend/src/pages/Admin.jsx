import React, { useState, useEffect } from 'react';
import '../styles/admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dashboard state
  const [stats, setStats] = useState({
    totalLicenses: 0,
    activeLicenses: 0,
    totalUsers: 0,
    revenueToday: 0,
    revenueMonth: 0
  });

  // Licenses state
  const [licenses, setLicenses] = useState([]);
  const [licenseSearch, setLicenseSearch] = useState('');
  const [showCreateLicense, setShowCreateLicense] = useState(false);
  const [newLicense, setNewLicense] = useState({
    email: '',
    tier: 'month',
    days: 30,
    password: ''
  });

  // Users state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Settings state
  const [settings, setSettings] = useState({
    pricing: {
      day_price: 500,
      week_price: 2500,
      month_price: 6000,
      sixmonth_price: 31500,
      year_price: 54900,
      currency: 'USD'
    },
    downloads: {
      windows_url: '',
      mac_url: '',
      version: '1.0.0',
      release_notes: ''
    },
    license: {
      max_devices: 2,
      allow_device_reset: true
    }
  });

  // Auth check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/auth/me`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setAdmin(data);
        setIsAuthenticated(true);
        loadDashboard();
      }
    } catch (err) {
      console.log('Not authenticated');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
        setIsAuthenticated(true);
        loadDashboard();
      } else {
        const data = await res.json();
        setError(data.detail || 'Login failed');
      }
    } catch (err) {
      setError('Connection failed');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/admin/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {}
    setIsAuthenticated(false);
    setAdmin(null);
  };

  // Load functions
  const loadDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/analytics/dashboard`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalLicenses: data.active_licenses || 0,
          activeLicenses: data.active_licenses || 0,
          totalUsers: data.total_users || 0,
          revenueToday: data.revenue?.daily || 0,
          revenueMonth: data.revenue?.monthly || 0
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard');
    }
  };

  const loadLicenses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/licenses?search=${licenseSearch}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setLicenses(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load licenses');
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users?search=${userSearch}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load users');
    }
    setLoading(false);
  };

  const loadSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.pricing) setSettings(prev => ({ ...prev, pricing: data.pricing }));
        if (data.downloads) setSettings(prev => ({ ...prev, downloads: data.downloads }));
        if (data.license) setSettings(prev => ({ ...prev, license: data.license }));
      }
    } catch (err) {
      console.error('Failed to load settings');
    }
  };

  // Actions
  const createLicense = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/licenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newLicense)
      });
      if (res.ok) {
        setSuccess('License created successfully!');
        setShowCreateLicense(false);
        setNewLicense({ email: '', tier: 'month', days: 30 });
        loadLicenses();
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to create license');
      }
    } catch (err) {
      setError('Connection failed');
    }
    setLoading(false);
  };

  const revokeLicense = async (licenseId) => {
    if (!confirm('Are you sure you want to revoke this license?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/licenses/${licenseId}/revoke`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        setSuccess('License revoked');
        loadLicenses();
      }
    } catch (err) {
      setError('Failed to revoke license');
    }
  };

  const extendLicense = async (licenseId, days) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/licenses/${licenseId}/extend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ days })
      });
      if (res.ok) {
        setSuccess(`License extended by ${days} days`);
        loadLicenses();
      }
    } catch (err) {
      setError('Failed to extend license');
    }
  };

  const saveSettings = async (section) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/settings/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings[section])
      });
      if (res.ok) {
        setSuccess('Settings saved!');
      } else {
        setError('Failed to save settings');
      }
    } catch (err) {
      setError('Connection failed');
    }
    setLoading(false);
  };

  const resetPassword = async (userId) => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ new_password: newPassword })
      });
      if (res.ok) {
        setSuccess('Password reset successfully!');
        setShowResetPassword(false);
        setNewPassword('');
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to reset password');
      }
    } catch (err) {
      setError('Connection failed');
    }
    setLoading(false);
  };

  // Tab change handler
  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'dashboard') loadDashboard();
    if (activeTab === 'licenses') loadLicenses();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'settings' || activeTab === 'downloads') loadSettings();
  }, [activeTab, isAuthenticated]);

  // Clear messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <h1>Admin Portal</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main admin panel with TOP navigation
  return (
    <div className="admin-container">
      {/* Top Header */}
      <header className="admin-header">
        <div className="header-top">
          <div className="header-brand">
            <h1>Admin Portal</h1>
          </div>
          <div className="header-user">
            <span>{admin?.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <nav className="tab-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </button>
          <button className={activeTab === 'licenses' ? 'active' : ''} onClick={() => setActiveTab('licenses')}>
            Licenses
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            Users
          </button>
          <button className={activeTab === 'downloads' ? 'active' : ''} onClick={() => setActiveTab('downloads')}>
            Downloads
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            Settings
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="admin-main">
        {success && <div className="success-banner">{success}</div>}
        {error && <div className="error-banner">{error}</div>}

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Active Licenses</h3>
                <div className="stat-value">{stats.activeLicenses}</div>
              </div>
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-value">{stats.totalUsers}</div>
              </div>
              <div className="stat-card">
                <h3>Today's Revenue</h3>
                <div className="stat-value">${stats.revenueToday.toFixed(2)}</div>
              </div>
              <div className="stat-card">
                <h3>Monthly Revenue</h3>
                <div className="stat-value">${stats.revenueMonth.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Licenses */}
        {activeTab === 'licenses' && (
          <div className="licenses-page">
            <div className="page-header">
              <h1>Licenses</h1>
              <button className="btn-primary" onClick={() => setShowCreateLicense(true)}>
                + Create License
              </button>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by license key or email..."
                value={licenseSearch}
                onChange={(e) => setLicenseSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadLicenses()}
              />
              <button onClick={loadLicenses}>Search</button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>License Key</th>
                  <th>User</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Devices</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map(license => (
                  <tr key={license.id}>
                    <td className="license-key">{license.license_key}</td>
                    <td>{license.user?.email || 'N/A'}</td>
                    <td><span className={`tier-badge ${license.tier}`}>{license.tier}</span></td>
                    <td><span className={`status-badge ${license.status}`}>{license.status}</span></td>
                    <td>{license.expires_at ? new Date(license.expires_at).toLocaleDateString() : 'Never'}</td>
                    <td>{license.activated_devices}/{license.max_devices}</td>
                    <td className="actions">
                      <button onClick={() => extendLicense(license.id, 1)}>+1d</button>
                      <button onClick={() => extendLicense(license.id, 7)}>+7d</button>
                      <button onClick={() => extendLicense(license.id, 30)}>+30d</button>
                      <button className="btn-danger" onClick={() => revokeLicense(license.id)}>Revoke</button>
                    </td>
                  </tr>
                ))}
                {licenses.length === 0 && (
                  <tr><td colSpan="7" className="no-data">No licenses found. Click "Create License" to add one.</td></tr>
                )}
              </tbody>
            </table>

            {/* Create License Modal */}
            {showCreateLicense && (
              <div className="modal-overlay" onClick={() => setShowCreateLicense(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <h2>Create New License</h2>
                  <div className="form-group">
                    <label>User Email</label>
                    <input
                      type="email"
                      value={newLicense.email}
                      onChange={(e) => setNewLicense({ ...newLicense, email: e.target.value })}
                      placeholder="customer@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>License Tier</label>
                    <select
                      value={newLicense.tier}
                      onChange={(e) => {
                        const tier = e.target.value;
                        const daysMap = { day: 1, week: 7, month: 30, year: 365 };
                        setNewLicense({ ...newLicense, tier, days: daysMap[tier] || 30 });
                      }}
                    >
                      <option value="day">Day Pass (1 day)</option>
                      <option value="week">Week Pass (7 days)</option>
                      <option value="month">Monthly (30 days)</option>
                      <option value="year">Yearly (365 days)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Duration (days)</label>
                    <input
                      type="number"
                      value={newLicense.days}
                      onChange={(e) => setNewLicense({ ...newLicense, days: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password (for new users)</label>
                    <input
                      type="password"
                      value={newLicense.password}
                      onChange={(e) => setNewLicense({ ...newLicense, password: e.target.value })}
                      placeholder="Leave empty for existing users"
                    />
                    <small style={{ color: '#888', display: 'block', marginTop: '0.25rem' }}>
                      If user doesn't exist, this password will be set for their account
                    </small>
                  </div>
                  <div className="modal-actions">
                    <button onClick={() => setShowCreateLicense(false)}>Cancel</button>
                    <button className="btn-primary" onClick={createLicense} disabled={loading}>
                      {loading ? 'Creating...' : 'Create License'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="users-page">
            <h1>Users</h1>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
              />
              <button onClick={loadUsers}>Search</button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Licenses</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.name || '-'}</td>
                    <td>{user.licenses?.length || 0}</td>
                    <td>
                      <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <button onClick={() => setSelectedUser(user)}>View</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="6" className="no-data">No users found</td></tr>
                )}
              </tbody>
            </table>

            {/* User Detail Modal */}
            {selectedUser && (
              <div className="modal-overlay" onClick={() => { setSelectedUser(null); setShowResetPassword(false); setNewPassword(''); }}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <h2>User Details</h2>
                  <div className="user-detail">
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Name:</strong> {selectedUser.name || 'Not set'}</p>
                    <p><strong>Status:</strong> {selectedUser.is_active ? 'Active' : 'Inactive'}</p>
                    <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>

                    {/* Password Reset Section */}
                    <h3>Password</h3>
                    {!showResetPassword ? (
                      <button className="btn-warning" onClick={() => setShowResetPassword(true)}>
                        Reset Password
                      </button>
                    ) : (
                      <div className="form-group" style={{ marginTop: '0.5rem' }}>
                        <input
                          type="password"
                          placeholder="New password (min 6 chars)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          style={{ marginBottom: '0.5rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-primary" onClick={() => resetPassword(selectedUser.id)} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Password'}
                          </button>
                          <button onClick={() => { setShowResetPassword(false); setNewPassword(''); }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <h3>Licenses</h3>
                    {selectedUser.licenses?.length > 0 ? (
                      <ul>
                        {selectedUser.licenses.map(l => (
                          <li key={l.id}>
                            {l.license_key} - {l.tier} ({l.status})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No licenses</p>
                    )}
                  </div>
                  <div className="modal-actions">
                    <button onClick={() => { setSelectedUser(null); setShowResetPassword(false); setNewPassword(''); }}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Downloads */}
        {activeTab === 'downloads' && (
          <div className="downloads-page">
            <h1>Software Downloads</h1>
            <p className="page-desc">Set the download URLs for your software. Paid users will see these links.</p>

            <div className="settings-card">
              <div className="form-group">
                <label>Current Version</label>
                <input
                  type="text"
                  value={settings.downloads.version}
                  onChange={(e) => setSettings({
                    ...settings,
                    downloads: { ...settings.downloads, version: e.target.value }
                  })}
                  placeholder="1.0.0"
                />
              </div>
              <div className="form-group">
                <label>Windows Download URL</label>
                <input
                  type="url"
                  value={settings.downloads.windows_url}
                  onChange={(e) => setSettings({
                    ...settings,
                    downloads: { ...settings.downloads, windows_url: e.target.value }
                  })}
                  placeholder="https://example.com/download/app-setup.exe"
                />
              </div>
              <div className="form-group">
                <label>Mac Download URL</label>
                <input
                  type="url"
                  value={settings.downloads.mac_url}
                  onChange={(e) => setSettings({
                    ...settings,
                    downloads: { ...settings.downloads, mac_url: e.target.value }
                  })}
                  placeholder="https://example.com/download/app.dmg"
                />
              </div>
              <div className="form-group">
                <label>Release Notes</label>
                <textarea
                  value={settings.downloads.release_notes}
                  onChange={(e) => setSettings({
                    ...settings,
                    downloads: { ...settings.downloads, release_notes: e.target.value }
                  })}
                  placeholder="What's new in this version..."
                  rows={4}
                />
              </div>
              <button className="btn-primary" onClick={() => saveSettings('downloads')}>
                Save Download Settings
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="settings-page">
            <h1>Settings</h1>

            <div className="settings-card">
              <h2>Pricing</h2>
              <div className="pricing-grid">
                <div className="form-group">
                  <label>Day Pass ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={(settings.pricing.day_price / 100).toFixed(2)}
                    onChange={(e) => setSettings({
                      ...settings,
                      pricing: { ...settings.pricing, day_price: Math.round(parseFloat(e.target.value) * 100) }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Week Pass ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={(settings.pricing.week_price / 100).toFixed(2)}
                    onChange={(e) => setSettings({
                      ...settings,
                      pricing: { ...settings.pricing, week_price: Math.round(parseFloat(e.target.value) * 100) }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Monthly ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={(settings.pricing.month_price / 100).toFixed(2)}
                    onChange={(e) => setSettings({
                      ...settings,
                      pricing: { ...settings.pricing, month_price: Math.round(parseFloat(e.target.value) * 100) }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Yearly ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={(settings.pricing.year_price / 100).toFixed(2)}
                    onChange={(e) => setSettings({
                      ...settings,
                      pricing: { ...settings.pricing, year_price: Math.round(parseFloat(e.target.value) * 100) }
                    })}
                  />
                </div>
              </div>
              <button className="btn-primary" onClick={() => saveSettings('pricing')}>
                Save Pricing
              </button>
            </div>

            <div className="settings-card">
              <h2>License Settings</h2>
              <div className="form-group">
                <label>Max Devices per License</label>
                <input
                  type="number"
                  value={settings.license.max_devices}
                  onChange={(e) => setSettings({
                    ...settings,
                    license: { ...settings.license, max_devices: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.license.allow_device_reset}
                    onChange={(e) => setSettings({
                      ...settings,
                      license: { ...settings.license, allow_device_reset: e.target.checked }
                    })}
                  />
                  Allow users to reset their devices
                </label>
              </div>
              <button className="btn-primary" onClick={() => saveSettings('license')}>
                Save License Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
