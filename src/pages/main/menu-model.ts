export interface MenuModel {
    id: number, 
    name: string,
    url: string,
    icon: string,
    parent_id: number | null,
    created_at?: string | null,
    updated_at?: string | null,
    children?: MenuModel[]
}