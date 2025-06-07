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

export async function analyzeImage(imageBlob) {
    try {
      const formData = new FormData();
      formData.append('image', imageBlob);

      const response = await fetch('https://your-api-endpoint.com/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        return {
          ok: false,
          message: 'Failed to analyze image'
        };
      }

      const data = await response.json();
      return {
        ok: true,
        diagnosis: data.diagnosis,
        confidence: data.confidence,
        description: data.description,
        treatment: data.treatment
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message
      };
    }
  }



