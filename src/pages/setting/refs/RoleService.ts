import { API_CONFIG, authenticatedFetch } from "../../../config/api";

export const getRoles = async () => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/roles`, {
        method: 'GET'
    });
}

export const findRole = async (id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/role/${id}`, {
        method: 'GET'
    })
}

export const createRole = async (data: { code: string, description: string }) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/role`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export const updateRole = async (data: { description: string }, id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/role/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export const deleteRole = async (id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/role/${id}`, {
        method: 'DELETE'
    });
}
