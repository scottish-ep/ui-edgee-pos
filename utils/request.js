export function request(url, options = {}) {
  let csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  let { headers = {} } = options;
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      "X-CSRF-TOKEN": csrfToken,
    },
  })
    .then((res) => res.json())
    .then(function (res) {
      if (res.message === "success") {
        return res.result;
      }
      throw res.error;
    });
}

export function requestFull(url, options = {}) {
  let csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  let { headers = {} } = options;
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      "X-CSRF-TOKEN": csrfToken,
    },
  })
    .then((res) => res.json())
    .then(function (res) {
      if (res.message === "success") {
        return res;
      }
      throw res;
    });
}
