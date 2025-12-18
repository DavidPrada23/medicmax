import styles from "../styles/Home.module.css";

interface Categoria {
  id: number;
  nombre: string;
  imagen: string;
  slug: string;
}

interface Props {
  categoria: Categoria;
  onClick?: () => void;
}

export default function CategoryCard({ categoria, onClick }: Props) {
  return (
    <div className={styles.categoryCard} onClick={onClick}>
      <img src={categoria.imagen} alt={categoria.nombre} />
      <div className={styles.overlay}>
        <h3>{categoria.nombre}</h3>
      </div>
    </div>
  );
}
