export const dataIdFromObject = obj => `${obj.__typename}:${(obj as any)._id}`;

export const AUTH_TOKEN = 'auth-token';
