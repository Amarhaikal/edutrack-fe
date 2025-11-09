import { API_CONFIG, authenticatedFetch } from "../../../config/api";

export const getProgrammes = async () => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/programme`, {
        method: 'GET'
    });
}

export const findProgramme = async (id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/programme/${id}`, {
        method: 'GET'
    })
}

export const createProgramme = async (data: { code: string, description: string }) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/programme`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export const updateProgramme = async (data: { description: string }, id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/programme/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

export const deleteProgramme = async (id: number) => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/programme/${id}`, {
        method: 'DELETE'
    });
}
