export const updateBackendStats = async (email, name, statsUpdates) => {
  try {
    const response = await fetch('http://localhost:5000/api/users/update', {
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
