import { API_CONFIG, authenticatedFetch } from "../../config/api";

export const getUser = async ({page, limit, name, role}: {page: number, limit: number, name: string, role: number | string}) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/users?page=${page}&limit=${limit}&name=${name}&role=${role}`, {
        method: 'GET'
    });
}

export const findUser = async (id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/user/${id}`, {
        method: 'GET'
    })
}

export const registerUser = async (data: {name: string, email: string, password: string, idno: string, role_code: number | string, programme_code?: string, faculty_code?: string}) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export const updateUser = async (data: {name: string, email: string, idno: string, programme_code?: string, faculty_code?: string}, id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/user/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export const deleteUser = async (id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/user/${id}`, {
        method: 'DELETE'
    });
}