import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.spacexdata.com/v4',
  timeout: 15000,
});

export async function getLaunches() {
  const res = await api.get('/launches');
  // The API returns launches oldest first; reverse to show the newest at the top.
  return res.data.reverse();
}

export async function getRocket(id) {
  const res = await api.get(`/rockets/${id}`);
  return res.data;
}

export async function getLaunchpad(id) {
  const res = await api.get(`/launchpads/${id}`);
  return res.data;
}
