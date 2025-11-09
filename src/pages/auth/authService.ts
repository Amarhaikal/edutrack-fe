import { API_CONFIG, getBaseHeaders, getAuthHeaders, handleApiResponse } from '../../config/api'

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/login`, {
    method: 'POST',
    headers: getBaseHeaders(),
    body: JSON.stringify({ email, password })
  })
  
  return await handleApiResponse(response)
}

export const logout = async (token?: string) => {
  let mytoken: string;
  if (!token) {
    mytoken = localStorage.getItem('token') || '';
  } else {
    mytoken = token;
  }
  const response = await fetch(`${API_CONFIG.BASE_URL}/logout`, {
    method: 'POST',
    headers: getAuthHeaders(mytoken)
  })
  
  return await handleApiResponse(response)
}
