const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : '';

export const updateBackendStats = async (email, name, statsUpdates) => {
  try {
    const response = await fetch(`${API_BASE}/api/users/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        stats: statsUpdates
      })
    });
    
    if (!response.ok) {
      console.error('Failed to update backend stats');
    }
  } catch (error) {
    console.error('Error updating backend stats:', error);
  }
};
