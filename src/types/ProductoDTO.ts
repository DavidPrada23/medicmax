export interface ProductoDTO {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    marca: string;
    stock: number;
    categoria: {
        id: number;
        nombre: string;
        slug: string;
    };
    imagen?: string;
}