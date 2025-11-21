import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import styles from "../styles/Home.module.css";

export default function Home() {
  const productos = [
    {
      id: 1,
      nombre: "Paracetamol 500mg",
      descripcion: "Alivio eficaz del dolor y la fiebre",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCpngwsq4p-fE_ABvIfcglGahHaydFP5xlwIKxzv3_WcgFGa743_8wgDj-mFzyE5xDxZ-sHK3_uCrtvTQ7UbsDIfSShJSpKxq10CZR7tzwmU5LuzulvfjrihtTYtdf6NHYoHMwBsLN0RhafAbtrlbH_3qSNaFuRSwik9z9vuMuSSmP7H26eZuwFPFTvSNa8z9htfSYxoIbWdsr2dqTqyCeJmRUFSPmqKGSZHvitoQV4TiGBHrwswZ2pow1ysw_HSiwgSwGLyF-rjg",
      precio: "8.000",
    },
    {
      id: 2,
      nombre: "Multivitamínico Diario",
      descripcion: "Refuerza tu energía y bienestar",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDk7vt5N2KtaWSzE_MDGxKviFG4OlRXTHzIxlJMYXKkYFw5oQgv9TL9MoVqAcv_8Ee1Ohwp7xNLmPAW3tDlVEneOMficAaw3D5oWVeZ0ph27HAupMTc0EQnA1V7FGVhE4fZqYWwwqojEFfXzX4WFtcaY_zmYuagxEsznEnvbTlKrvBfuS4yA9Eb3A8Hea_0i_NbvXrsEIM805CU0URtChl722HQTmQ3nPfnQ9Va4nHDRfnvqaJwXEqcQchMSKfI2ScH6BW3p5nNpA",
      precio: "12.500",
    },
    {
      id: 3,
      nombre: "Jarabe Antialérgico",
      descripcion: "Rápido alivio para alergias",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDb1_yBLqTDLFD1PWFIBJ9JYwJCm_9JyGStwdpEyB2h7yZnUSeuIG4kmGskyspd6blUZ3-K2rcPWMW0Fnin3mZoz939Om2HvTcYt4VJEblk69fM_N0DxuYPmDb4eSz5J4JVyU-15MF6LB9IBzU5uoxneMwQTkMEDdQkhG-nHlzQJ2iYmmPDheB5lRldAtOHPUzHr4ieDMRzeFmcVqdJvAsUt3fX_aq0OxnO-zU0_i4I72onslxHaHLVFpKuWr7xC1GK30FvtuGb9A",
      precio: "15.900",
    },
  ];

  const categorias = [
    {
      id: 1,
      nombre: "Medicamentos",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC4iuiWkUzddLOzJ50-9-brW9Vet3L0iOJBXA-Ox1weEkBN7ALHeqBm7TSCbORdoSZFfS6r1A4ksSEsmzH67GHGkeUABKt_9y-G5klBMA93UsWxsukmchgm55FzQmFcPNre9m4SIyK0PE-FjWrfVVW-NIV8zhB6Nn_uQpsi7iHoTio6KO639zxU7PvX30N1VbmFG0deNj8mRJ31bCFdYJ093uRJjDwrM5SI6jQFDvapD5XNvX0gpsl-DTHYw6P9o35HIV3w5U_R1A",
    },
    {
      id: 2,
      nombre: "Cuidado Personal",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB_OkRTMhZlUMkno9Nm42WqYeJQcrj1pksZ0bJLnXl4xJ8yCtndXdW5EOk3L9-GXWzpZZM6cH03T4oCtGztWn156UJa1fbHMfYfe8QMVh6o3nrylJ-yzLj-SjNcidslHivhSx6LUufpCVR8Eb6bezOmn3p-pKahMLPM3w9kQuUU9x51m8uVx7jpDdOHvUK6BNgtkE1xiu2IKDiL2VoFfJA_Zzwzrb__DsHrY0Q1ndYwmvriIimcsX27cMrwoz8Z0EMCRAN2IWU60w",
    },
    {
      id: 3,
      nombre: "Vitaminas y Suplementos",
      imagen:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9oircZC7uJpg9D2T1IW7EYerpoIhSN2RVEnJFnY1fu4CwKuGKjPYhxKQWc8kAPO41eFPIuKbZVaXwFVGtp6cvX7i_k9yRiYJvM6mCBd6k0etxA-jbSRTXAGQkJ0ZjvMbJ0V9dQek84c--OfZvlRCrAfZkA66lKXM1ERaiuR1iR2ME2zM6jP_m8jJRTMVXJ9WMYR5FJNsDEaI6MQLUNqAA8v4Gj_EYs1K1CUoS1i6TfNY93QRtzZNKB2dWiPODTFCVkDy7e0C2w",
    },
  ];

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Productos Destacados</h2>
          <div className={styles.grid}>
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Categorías</h2>
          <div className={styles.gridCategorias}>
            {categorias.map((c) => (
              <CategoryCard key={c.id} categoria={c} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
