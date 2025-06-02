import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  MY_USER_INFO: `${BASE_URL}/users/me`,

  GET_ALL_STORIES: `${BASE_URL}/stories`,
  GET_STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  ADD_NEW_STORY: `${BASE_URL}/stories`,
  SUBSCRIBE_PUSH: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE_PUSH: `${BASE_URL}/notifications/subscribe`,
};

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getMyUserInfo() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.MY_USER_INFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllStories() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.GET_ALL_STORIES, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getStoryById(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.GET_STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storeNewStory({ description, photo, lat, lon }) {
  const accessToken = getAccessToken();

  const formData = new FormData();
  formData.set('description', description);

  if (photo) {
    formData.append('photo', photo);
  } else {
    throw new Error('Foto tidak ditemukan');
  }

  if (lat && lon) {
    formData.set('lat', lat);
    formData.set('lon', lon);
  }

  const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function subscribePushNotification({ endpoint, keys }) {
  const accessToken = getAccessToken();

  if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
    throw new Error('Invalid push subscription data');
  }

  const data = JSON.stringify({
    endpoint,
    keys: {
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  });

  try {
    const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE_PUSH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: data,
    });

    if (!fetchResponse.ok) {
      const errorData = await fetchResponse.json();
      throw new Error(errorData.message || 'Failed to subscribe');
    }

    return await fetchResponse.json();
  } catch (error) {
    console.error('Subscribe push error:', error);
    throw error;
  }
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();

  if (!endpoint) {
    throw new Error('Endpoint is required for unsubscribe');
  }

  const data = JSON.stringify({ endpoint });

  try {
    const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE_PUSH, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: data,
    });

    if (!fetchResponse.ok) {
      const errorData = await fetchResponse.json();
      throw new Error(errorData.message || 'Failed to unsubscribe');
    }

    return await fetchResponse.json();
  } catch (error) {
    console.error('Unsubscribe push error:', error);
    throw error;
  }
}
