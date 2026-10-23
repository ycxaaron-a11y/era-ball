export async function request(config, path, body, token, fetcher = fetch) {
  const response = await fetcher(config.url + path, {
    method: 'POST', headers: { apikey: config.key, 'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body), signal: AbortSignal.timeout(15000)
  });
  const text = await response.text();
  let value = null;
  try { value = text ? JSON.parse(text) : null; }
  catch { throw Error('服务返回了无法识别的响应，请稍后重试。'); }
  if (!response.ok) {
    const error = Error(value?.message || value?.msg || value?.error_description || `连接失败 (${response.status})`);
    error.status = response.status; error.code = value?.code; error.details = value?.details; throw error;
  }
  return value;
}
export function validatePublicConfig(config) {
  const url = config.url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key = config.key.trim();
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || !key) throw Error('请填写有效的项目地址和公开 key。');
  let role = '';
  try { role = JSON.parse(atob(key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role; } catch { /* Publishable keys are not JWTs. */ }
  if (key.startsWith('sb_secret_') || role === 'service_role') throw Error('这里只能使用 publishable 或 anon public key。');
  return { url, key };
}
