import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

const BUCKET_ID = 'ieltshub_fayzullayev_db_6e33';
const KV_URL = 'https://kvdb.io/' + BUCKET_ID + '/users';

async function readData() {
  try {
    const res = await fetch(KV_URL);
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim()) {
        return JSON.parse(text);
      }
    }
  } catch (err) {
    console.error("Failed to read from KVDB, falling back to local file:", err.message);
  }

  // Fallback to local data.json
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const initialData = { users: [] };
      try {
        await fs.writeFile(dataPath, JSON.stringify(initialData, null, 2));
      } catch (writeErr) {}
      return initialData;
    }
    throw error;
  }
}

async function writeData(data) {
  try {
    const res = await fetch(KV_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      console.log("Successfully saved data to KVDB!");
    }
  } catch (err) {
    console.error("Failed to write to KVDB:", err.message);
  }

  // Local backup write (ignores errors on Vercel read-only filesystem)
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
  } catch (err) {
    // Silent ignore on serverless read-only filesystem
  }
}

// Format time utility
const formatTime = (minutes) => {
  if (minutes === 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// Today's date string
const todayStr = () => new Date().toISOString().slice(0, 10);

app.get('/api/leaderboard', async (req, res) => {
  try {
    const data = await readData();
    let users = data.users || [];

    const colorMap = { 1: 'gold', 2: 'silver', 3: 'bronze' };
    const typeMap  = { 1: 'first', 2: 'second', 3: 'third' };

    const getTopData = (sortKey) => {
      const sorted = [...users].sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));

      const formatScore = (u) => {
        let score = u[sortKey] || 0;
        if (sortKey === 'time') return formatTime(score);
        if (sortKey === 'streak') return `${score} days`;
        return score;
      };

      // Top 3 for podium
      const topPlayers = sorted
        .slice(0, 3)
        .map((u, index) => {
          const rank = index + 1;
          return {
            rank,
            name: u.name,
            email: u.email,
            avatar: u.avatar || null,
            score: formatScore(u),
            color: colorMap[rank],
            type: typeMap[rank],
            hasCrown: rank === 1
          };
        });

      // All users (rank 1-15) for the scrollable list below podium
      const listPlayers = sorted.slice(0, 15).map((u, index) => ({
        rank: index + 1,
        name: u.name,
        email: u.email,
        avatar: u.avatar || null,
        score: formatScore(u)
      }));

      return { topPlayers, listPlayers };
    };

    const tabData = {
      Stars:  getTopData('stars'),
      Time:   getTopData('time'),
      Streak: getTopData('streak'),
      Coins:  getTopData('coins')
    };

    res.json(tabData);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to update user stats
app.post('/api/users/update', async (req, res) => {
  try {
    const { email, name, stats } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const data = await readData();
    const today = todayStr();
    let userIndex = data.users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      // New user — initialize
      data.users.push({
        email,
        name: name || 'User',
        stars: stats?.stars || 0,
        time: stats?.time || 0,
        streak: stats?.stars ? 1 : 0,
        coins: stats?.coins || 0,
        practices: stats?.practices || 0,
        lastPracticeDate: today
      });
    } else {
      const u = data.users[userIndex];
      if (name) u.name = name;
      if (stats?.avatar) u.avatar = stats.avatar;
      if (stats?.stars) u.stars = (u.stars || 0) + stats.stars;
      if (stats?.time) u.time = (u.time || 0) + stats.time;
      if (stats?.coins) u.coins = (u.coins || 0) + stats.coins;
      if (stats?.practices) u.practices = (u.practices || 0) + stats.practices;

      // Streak: only increment once per day
      if (stats?.practices && stats.practices > 0) {
        if (u.lastPracticeDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().slice(0, 10);

          if (u.lastPracticeDate === yStr) {
            // Consecutive day — increment streak
            u.streak = (u.streak || 0) + 1;
          } else {
            // Streak broken — reset
            u.streak = 1;
          }
          u.lastPracticeDate = today;
        }
        // If same day, no streak change
      }
    }

    await writeData(data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to register user (idempotent – only creates if not exists)
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, name, stars, time, coins, streak, practices } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const data = await readData();
    const exists = data.users.find(u => u.email === email);

    if (!exists) {
      const today = todayStr();
      data.users.push({
        email,
        name: name || 'User',
        avatar: req.body.avatar || null,
        stars: stars || 0,
        time: time || 0,
        streak: streak || 0,
        coins: coins || 0,
        practices: practices || 0,
        lastPracticeDate: today
      });
      await writeData(data);
    } else {
      // Update name and avatar if changed
      let changed = false;
      if (name && exists.name !== name) { exists.name = name; changed = true; }
      if (req.body.avatar && exists.avatar !== req.body.avatar) { exists.avatar = req.body.avatar; changed = true; }
      if (changed) {
        await writeData(data);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;

