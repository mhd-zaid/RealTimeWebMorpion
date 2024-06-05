const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;

export const apiService = {

  getUserInfo(instance, id){
    const headers = new Headers({ "Content-Type": "application/json" });
    return fetch(`${API_URL_BASE}/${instance}${id}`, { method: "GET", headers, credentials: 'include'  })
      .then((response) => response.json());
  },

  getUserStatus: function() {
    const headers = new Headers({ "Content-Type": "application/json" });
    return fetch(`${API_URL_BASE}/me`, { method: "GET", headers, credentials: 'include'})
      .then((response) => response.json());
  },

  getAll(instance, params){
    const headers = new Headers({ "Content-Type": "application/json" });
    let url = `${API_URL_BASE}/${instance}`;
    if (params) {
      url += params.includes("/") ? params : `?${params}`;
    }
    return fetch(url, { method: "GET", headers, credentials: 'include' })
      .then((response) => response.json());
  },

  create(instance, data){
    const headers = new Headers({ "Content-Type": "application/json" });
    // if (token) {
    //   headers.append("Authorization", `Bearer ${token}`);
    // }
    return fetch(`${API_URL_BASE}/${instance}`, { method: "POST", headers, body: JSON.stringify(data), credentials: 'include' })
      .then((response) => response.json());
  },

  update(instance, id, data){
    const headers = new Headers({ "Content-Type": "application/json" });
    return fetch(`${API_URL_BASE}/${instance}/${id}`, { method: "PUT", headers, body: JSON.stringify(data), credentials: 'include' })
      .then((response) => response.json());
  },

  patch(instance, id, data){
    const headers = new Headers({ "Content-Type": "application/json" });
    return fetch(`${API_URL_BASE}/${instance}/${id}`, { method: "PATCH", headers, body: JSON.stringify(data), credentials: 'include' })
      .then((response) => response.json());
  },


  deleteById(instance, id){
    const headers = new Headers({ "Content-Type": "application/json" });
    return fetch(`${API_URL_BASE}/${instance}/${id}`, { method: "DELETE", headers, credentials: 'include' })
      .then((response) => {
        if (response.status === 204 || response.status === 200) {
          return { success: true };
        } else {
          return response.json();
        }
      });
  }
}