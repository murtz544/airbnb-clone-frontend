import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}) {
  options.headers = options.headers || {};
  options.method = options.method || "GET";
  
  options.credentials = "include";

  if (options.method && options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] = options.headers['Content-Type'] || "application/json";
    options.headers["XSRF-Token"] = Cookies.get("XSRF-TOKEN");
    console.log('  ---  cokies ---', Cookies.get("XSRF-TOKEN"))
  }

  console.log("url", url, "options", options);
  const response = await window.fetch(url, options);

  if (response.status >= 400) throw response;

  return response;
}

// This function fetches the CSRF token on page load
export function restoreCSRF() {
  return csrfFetch("https://airbnb-clone-be-d5zd.onrender.com/api/csrf/restore")
    .then(response => response.json())
    .then(data => {
      // If your backend returns the token in the response body
      if (data.csrfToken) {
        // Manually set it if the cookie isn't working
        Cookies.set("XSRF-TOKEN", data.csrfToken);
        console.log('CSRF token set:', data.csrfToken); // Log the token here
      }
      return data;
    });
}