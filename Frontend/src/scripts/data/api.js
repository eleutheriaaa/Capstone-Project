import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  REGISTER: `${BASE_URL}/registration`,
  LOGIN: `${BASE_URL}/login`,
  MY_USER_INFO: `${BASE_URL}/users/me`,
  UPLOAD_IMAGE: `${BASE_URL}/uploads`,
};

export async function getRegistered({ username, email, password }) {
  const data = JSON.stringify({ username, email, password });

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
      formData.append('file', imageBlob);

      const response = await fetch('https://capstone-backend-ml.onrender.com/predict', {
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
        predictedClass: data.predicted_class,
        confidence: data.confidence
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message
      };
    }
  }

export async function getUploadDetail(id) {
  const accessToken = getAccessToken();

  const response = await fetch(`${BASE_URL}/upload-detail/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await response.json();

  return {
    ...json,
    ok: response.ok,
  };
}

export async function uploadImage(imageBlob) {
  try {
    const formData = new FormData();
    formData.append('image', imageBlob);

    const response = await fetch(ENDPOINTS.UPLOAD_IMAGE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      return {
        ok: false,
        message: err.message || 'Gagal upload gambar',
      };
    }

    const result = await response.json();
    return {
      ok: true,
      data: result.data,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
}