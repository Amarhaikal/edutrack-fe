import { API_CONFIG, authenticatedFetch } from "../../../config/api";

export const getFaculties = async () => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/faculty`, {
        method: 'GET'
    });
}

export const findFaculty = async (id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/faculty/${id}`, {
        method: 'GET'
    })
}

export const createFaculty = async (data: { code: string, description: string }) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/faculty`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export const updateFaculty = async (data: { description: string }, id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/faculty/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export const deleteFaculty = async (id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/faculty/${id}`, {
        method: 'DELETE'
    });
}
