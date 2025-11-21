import styles from "../styles/Home.module.css";

interface Categoria {
  id: number;
  nombre: string;
  imagen: string;
}

export default function CategoryCard({ categoria }: { categoria: Categoria }) {
  return (
    <div className={styles.categoryCard}>
      <img src={categoria.imagen} alt={categoria.nombre} />
      <div className={styles.overlay}>
        <h3>{categoria.nombre}</h3>
      </div>
    </div>
  );
}
