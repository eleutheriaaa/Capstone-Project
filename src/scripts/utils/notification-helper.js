import { convertBase64ToUint8Array } from './index';
import { VAPID_PUBLIC_KEY } from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    console.error('Notification permission denied');
    return false;
  }

  if (status === 'default') {
    console.warn('Notification permission dismissed');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers not supported');
  }

  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  const subscription = await getPushSubscription();
  return !!subscription;
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  try {
    if (!(await requestNotificationPermission())) {
      throw new Error('Notification permission not granted');
    }

    if (await isCurrentPushSubscriptionAvailable()) {
      console.log('Already subscribed to push notifications');
      return true;
    }

    console.log('Subscribing to push notifications...');
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const { endpoint, keys } = subscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });

    if (!response || response.error) {
      await subscription.unsubscribe();
      throw new Error(response?.message || 'Failed to save subscription');
    }

    console.log('Successfully subscribed to push notifications');
    return true;
  } catch (error) {
    console.error('Push subscription failed:', error);
    throw error;
  }
}

export async function unsubscribe() {
  try {
    const subscription = await getPushSubscription();
    if (!subscription) {
      console.log('No active push subscription found');
      return true;
    }

    const { endpoint } = subscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });

    if (!response || response.error) {
      throw new Error(response?.message || 'Failed to remove subscription');
    }

    const unsubscribed = await subscription.unsubscribe();
    if (!unsubscribed) {
      throw new Error('Failed to unsubscribe from push service');
    }

    console.log('Successfully unsubscribed from push notifications');
    return true;
  } catch (error) {
    console.error('Push unsubscription failed:', error);
    throw error;
  }
}
