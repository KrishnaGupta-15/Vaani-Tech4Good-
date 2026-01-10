// export const authFetch = async (url, options = {}) => {
//     const token = localStorage.getItem('token');

//     return fetch(url, {
//         ...options,
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//             ...options.headers || {},
//         },
//     });
// }

import { getAuth } from "firebase/auth";

export const authFetch = async (url, options = {}) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }
  if(!response.ok){
    throw new Error(`Server error: ${response.status}`);
  }
  const token = await user.getIdToken(true); // force refresh

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
};
