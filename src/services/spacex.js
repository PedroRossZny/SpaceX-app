import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Launch Library 2 (The Space Devs). Free and keyless, but anonymous access is
// limited to 15 requests per hour, so the launch list is cached on the device.
const api = axios.create({
  baseURL: 'https://ll.thespacedevs.com/2.3.0',
  timeout: 15000,
});

const CACHE_KEY = 'launchesCache';
const CACHE_TTL_MS = 30 * 60 * 1000;

// Launch Library names launches as "Rocket | Mission"; the mission part reads better in a list.
function missionName(name = '') {
  return name.split('|').pop().trim();
}

// Maps a Launch Library 2 launch to the fields the screens use.
function toLaunch(item) {
  const image =
    item.image?.thumbnail_url ||
    item.image?.image_url ||
    (typeof item.image === 'string' ? item.image : null);

  return {
    id: item.id,
    name: missionName(item.name),
    date: item.net || null,
    image,
    rocket: item.rocket?.configuration?.full_name || item.rocket?.configuration?.name || null,
    launchpad: [item.pad?.name, item.pad?.location?.name].filter(Boolean).join(', ') || null,
    details: item.mission?.description || null,
  };
}

// Favorites saved before the move to Launch Library 2 used the r/SpaceX API shape.
export function fromStorage(item) {
  if (!item || !('date_utc' in item)) return item;
  return {
    id: item.id,
    name: item.name,
    date: item.date_utc || null,
    image: item.links?.patch?.small || null,
    rocket: null,
    launchpad: null,
    details: item.details || null,
  };
}

async function readCache() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Most recent SpaceX launches first. Falls back to the last cached list when the
// request fails (offline or rate limited), and only throws if there is nothing cached.
export async function getLaunches() {
  const cached = await readCache();
  if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) return cached.launches;

  try {
    const res = await api.get('/launches/previous/', {
      params: { lsp__name: 'SpaceX', ordering: '-net', limit: 50, mode: 'normal' },
    });
    const launches = res.data.results.map(toLaunch);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), launches }));
    return launches;
  } catch (e) {
    if (cached) return cached.launches;
    throw e;
  }
}
