import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../styles/admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dashboard state
  const [dashboardStats, setDashboardStats] = useState(null);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userNotes, setUserNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // Affiliates state
  const [affiliates, setAffiliates] = useState([]);
  const [affiliatesTotal, setAffiliatesTotal] = useState(0);
  const [commissions, setCommissions] = useState([]);
  const [commissionsTotal, setCommissionsTotal] = useState(0);
  const [payouts, setPayouts] = useState([]);

  // Settings state
  const [settings, setSettings] = useState(null);

  // Audit state
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditTotal, setAuditTotal] = useState(0);

  // Check auth on mount
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

  // Data loading functions
  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/analytics/dashboard`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardStats(data);
      }
    } catch (err) {
      console.error('Failed to load dashboard');
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users?page=${usersPage}&search=${userSearch}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.items);
        setUsersTotal(data.total);
      }
    } catch (err) {
      console.error('Failed to load users');
    }
    setLoading(false);
  };

  const loadUserDetail = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedUser(data);
        loadUserNotes(userId);
      }
    } catch (err) {
      console.error('Failed to load user');
    }
  };

  const loadUserNotes = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/notes`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUserNotes(data.items);
      }
    } catch (err) {
      console.error('Failed to load notes');
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || !selectedUser) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${selectedUser.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newNote })
      });
      if (res.ok) {
        setNewNote('');
        loadUserNotes(selectedUser.id);
      }
    } catch (err) {
      alert('Failed to add note');
    }
  };

  const resetUserDevices = async (userId) => {
    if (!confirm('Reset all devices for this user?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/devices/reset-all`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        alert('Devices reset');
        loadUserDetail(userId);
      }
    } catch (err) {
      alert('Failed to reset devices');
    }
  };

  const loadAffiliates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/affiliates`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setAffiliates(data.items);
        setAffiliatesTotal(data.total);
      }
    } catch (err) {
      console.error('Failed to load affiliates');
    }
    setLoading(false);
  };

  const loadCommissions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/affiliates/commissions/all?status=pending`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setCommissions(data.items);
        setCommissionsTotal(data.total);
      }
    } catch (err) {
      console.error('Failed to load commissions');
    }
  };

  const handleCommissionAction = async (commissionId, action) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/affiliates/commissions/${commissionId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        loadCommissions();
      }
    } catch (err) {
      alert('Action failed');
    }
  };

  const loadPayouts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/affiliates/payouts/all`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setPayouts(data.items);
      }
    } catch (err) {
      console.error('Failed to load payouts');
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings');
    }
  };

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/audit?per_page=50`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.items);
        setAuditTotal(data.total);
      }
    } catch (err) {
      console.error('Failed to load audit logs');
    }
    setLoading(false);
  };

  // Tab change handler
  useEffect(() => {
    if (!isAuthenticated) return;

    switch (activeTab) {
      case 'dashboard':
        loadDashboard();
        break;
      case 'users':
        loadUsers();
        break;
      case 'affiliates':
        loadAffiliates();
        loadCommissions();
        break;
      case 'payouts':
        loadPayouts();
        break;
      case 'settings':
        loadSettings();
        break;
      case 'audit':
        loadAuditLogs();
        break;
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'users') {
      loadUsers();
    }
  }, [usersPage, userSearch]);

  // Format helpers
  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="login-header">
            <span className="login-icon">🛡️</span>
            <h2>Admin Panel</h2>
            <p>Enter your credentials to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Pie chart colors
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span>🦈</span>
          <span>Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            👥 Users
          </button>
          <button className={activeTab === 'affiliates' ? 'active' : ''} onClick={() => setActiveTab('affiliates')}>
            🤝 Affiliates
          </button>
          <button className={activeTab === 'payouts' ? 'active' : ''} onClick={() => setActiveTab('payouts')}>
            💰 Payouts
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            ⚙️ Settings
          </button>
          <button className={activeTab === 'audit' ? 'active' : ''} onClick={() => setActiveTab('audit')}>
            📋 Audit Logs
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-info">
            <span>{admin?.email}</span>
            <span className="role-badge">{admin?.role}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <h1>Dashboard</h1>
            {loading ? <div className="loading">Loading...</div> : dashboardStats && (
              <>
                <div className="stats-row">
                  <div className="stat-card">
                    <span className="stat-value">{formatCurrency(dashboardStats.revenue.daily)}</span>
                    <span className="stat-label">Today</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{formatCurrency(dashboardStats.revenue.weekly)}</span>
                    <span className="stat-label">This Week</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{formatCurrency(dashboardStats.revenue.monthly)}</span>
                    <span className="stat-label">This Month</span>
                  </div>
                  <div className="stat-card highlight">
                    <span className="stat-value">{formatCurrency(dashboardStats.revenue.all_time)}</span>
                    <span className="stat-label">All Time</span>
                  </div>
                </div>

                <div className="cards-row">
                  <div className="card">
                    <h3>MRR</h3>
                    <div className="mrr-value">{formatCurrency(dashboardStats.mrr.mrr)}</div>
                    <div className={`mrr-change ${dashboardStats.mrr.change_percentage >= 0 ? 'positive' : 'negative'}`}>
                      {dashboardStats.mrr.change_percentage >= 0 ? '↑' : '↓'} {Math.abs(dashboardStats.mrr.change_percentage)}%
                    </div>
                  </div>
                  <div className="card">
                    <h3>Subscriptions</h3>
                    <div className="sub-stats">
                      <div><span className="num">{dashboardStats.subscriptions.total_active}</span> Active</div>
                      <div><span className="num green">{dashboardStats.subscriptions.new_this_month}</span> New</div>
                      <div><span className="num red">{dashboardStats.subscriptions.churned_this_month}</span> Churned</div>
                    </div>
                  </div>
                  <div className="card">
                    <h3>Overview</h3>
                    <div className="overview-stats">
                      <div><span className="num">{dashboardStats.total_users}</span> Users</div>
                      <div><span className="num">{dashboardStats.active_licenses}</span> Licenses</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <h1>Users</h1>

            {!selectedUser ? (
              <>
                <div className="filters-row">
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="search-input"
                  />
                </div>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Affiliate</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.name || '-'}</td>
                        <td><span className={`badge ${user.is_active ? 'green' : 'red'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td>{user.is_affiliate ? '✓' : '-'}</td>
                        <td>{formatDate(user.created_at)}</td>
                        <td>
                          <button className="btn-sm" onClick={() => loadUserDetail(user.id)}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="user-detail">
                <button className="btn-back" onClick={() => setSelectedUser(null)}>← Back to Users</button>

                <div className="detail-header">
                  <h2>{selectedUser.email}</h2>
                  <span className={`badge ${selectedUser.is_active ? 'green' : 'red'}`}>
                    {selectedUser.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="detail-grid">
                  <div className="detail-card">
                    <h4>Info</h4>
                    <p><strong>Name:</strong> {selectedUser.name || '-'}</p>
                    <p><strong>Paddle ID:</strong> {selectedUser.paddle_customer_id || '-'}</p>
                    <p><strong>Created:</strong> {formatDate(selectedUser.created_at)}</p>
                  </div>

                  <div className="detail-card">
                    <h4>Licenses ({selectedUser.licenses?.length || 0})</h4>
                    {selectedUser.licenses?.map(lic => (
                      <div key={lic.id} className="license-item">
                        <code>{lic.license_key}</code>
                        <span className={`badge ${lic.status === 'active' ? 'green' : 'yellow'}`}>{lic.status}</span>
                        <span>{lic.tier}</span>
                      </div>
                    ))}
                  </div>

                  <div className="detail-card">
                    <h4>Tags</h4>
                    <div className="tags-list">
                      {selectedUser.tags?.map(tag => (
                        <span key={tag.id} className="tag" style={{ background: tag.color }}>{tag.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="detail-card">
                    <h4>Actions</h4>
                    <button className="btn-danger" onClick={() => resetUserDevices(selectedUser.id)}>
                      Reset All Devices
                    </button>
                  </div>
                </div>

                <div className="notes-section">
                  <h4>Notes</h4>
                  <div className="add-note">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                    />
                    <button onClick={addNote}>Add Note</button>
                  </div>
                  <div className="notes-list">
                    {userNotes.map(note => (
                      <div key={note.id} className="note-item">
                        <p>{note.content}</p>
                        <span className="note-meta">{note.admin_email} - {formatDate(note.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Affiliates Tab */}
        {activeTab === 'affiliates' && (
          <div className="tab-content">
            <h1>Affiliates</h1>

            <div className="section">
              <h3>Pending Commissions ({commissionsTotal})</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Affiliate</th>
                    <th>Amount</th>
                    <th>Rate</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map(comm => (
                    <tr key={comm.id}>
                      <td>{comm.affiliate_email}</td>
                      <td>{formatCurrency(comm.amount)}</td>
                      <td>{comm.commission_rate}%</td>
                      <td>{formatDate(comm.created_at)}</td>
                      <td>
                        <button className="btn-sm green" onClick={() => handleCommissionAction(comm.id, 'approve')}>Approve</button>
                        <button className="btn-sm red" onClick={() => handleCommissionAction(comm.id, 'reject')}>Reject</button>
                      </td>
                    </tr>
                  ))}
                  {commissions.length === 0 && (
                    <tr><td colSpan="5" className="no-data">No pending commissions</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="section">
              <h3>All Affiliates ({affiliatesTotal})</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Code</th>
                    <th>Status</th>
                    <th>Referrals</th>
                    <th>Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map(aff => (
                    <tr key={aff.id}>
                      <td>{aff.email}</td>
                      <td><code>{aff.affiliate_code}</code></td>
                      <td><span className={`badge ${aff.affiliate_status === 'active' ? 'green' : 'yellow'}`}>{aff.affiliate_status}</span></td>
                      <td>{aff.total_referrals} ({aff.converted_referrals} converted)</td>
                      <td>{formatCurrency(aff.total_earnings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div className="tab-content">
            <h1>Payouts</h1>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Affiliate</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Requested</th>
                  <th>Processed</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map(payout => (
                  <tr key={payout.id}>
                    <td>{payout.affiliate_email}</td>
                    <td>{formatCurrency(payout.amount)}</td>
                    <td><span className={`badge ${payout.status === 'completed' ? 'green' : 'yellow'}`}>{payout.status}</span></td>
                    <td>{formatDate(payout.requested_at)}</td>
                    <td>{payout.processed_at ? formatDate(payout.processed_at) : '-'}</td>
                  </tr>
                ))}
                {payouts.length === 0 && (
                  <tr><td colSpan="5" className="no-data">No payouts</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <h1>Settings</h1>
            {settings && (
              <div className="settings-grid">
                <div className="settings-card">
                  <h3>Pricing</h3>
                  <div className="setting-row">
                    <span>Monthly</span>
                    <span>{formatCurrency(settings.pricing.monthly_price / 100)}</span>
                  </div>
                  <div className="setting-row">
                    <span>Yearly</span>
                    <span>{formatCurrency(settings.pricing.yearly_price / 100)}</span>
                  </div>
                  <div className="setting-row">
                    <span>Lifetime</span>
                    <span>{formatCurrency(settings.pricing.lifetime_price / 100)}</span>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>Commission</h3>
                  <div className="setting-row">
                    <span>Default Rate</span>
                    <span>{settings.commission.default_rate}%</span>
                  </div>
                  <div className="setting-row">
                    <span>Min Payout</span>
                    <span>{formatCurrency(settings.commission.minimum_payout / 100)}</span>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>Features</h3>
                  <div className="setting-row">
                    <span>Affiliate Program</span>
                    <span>{settings.features.affiliate_program_enabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="setting-row">
                    <span>Trial Days</span>
                    <span>{settings.features.free_trial_days}</span>
                  </div>
                  <div className="setting-row">
                    <span>Max Devices</span>
                    <span>{settings.features.max_devices_per_license}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="tab-content">
            <div className="section-header">
              <h1>Audit Logs</h1>
              <a href={`${API_URL}/api/admin/audit/export`} className="btn-export" target="_blank">
                Export CSV
              </a>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Actor</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td>{formatDate(log.created_at)}</td>
                    <td><code>{log.action}</code></td>
                    <td>{log.entity_type}:{log.entity_id.substring(0, 8)}...</td>
                    <td>{log.actor_email || log.actor_id || '-'}</td>
                    <td>{log.ip_address || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
