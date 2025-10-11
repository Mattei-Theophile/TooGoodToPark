import { ref } from 'vue'

export function useApi() {
  const loading = ref(false);
  const error = ref(null);

  const request = async (url, options) => {
    loading.value = true;
    error.value = null;
    try{
      const response = await fetch(url, {
        headers:{
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  const get = (url) => request(url, { method: 'GET', headers:{ authorization: `Bearer ${localStorage.getItem('auth_token')}`} });
  const post = (url, data) => request(url, { method: 'POST', headers:{ authorization:`Bearer ${localStorage.getItem('auth_token')}`}, body: JSON.stringify(data) });
  const put = (url, data) => request(url, { method: 'PUT', headers:{ authorization:` Bearer ${localStorage.getItem('auth_token')}`}, body: JSON.stringify(data) });
  const del = (url) => request(url, { method: 'DELETE', headers:{ authorization:`Bearer ${localStorage.getItem('auth_token')}`} });

  return {
    loading,
    error,
    get,
    post,
    put,
    delete : del
  }
}
