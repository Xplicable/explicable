// src/utils/normalizeBody.js

export function normalizeBody(body) {
  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString());
    } catch {
      return {};
    }
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body || {};
}

