import { API_CONFIG, authenticatedFetch } from '../../config/api'

export const getMenu = async () => {
    return await authenticatedFetch(`${API_CONFIG.BASE_URL}/menu`, {
        method: 'GET'
    })
}