import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Contacto.module.css";

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p>¿Necesitas ayuda?</p>
            <h1>Estamos listos para atenderte</h1>
            <span>Comunícate con nuestro equipo de atención al cliente.</span>
          </div>
          <div className={styles.infoGrid}>
            <div>
              <strong>WhatsApp</strong>
              <p>+57 321 555-2323</p>
            </div>
            <div>
              <strong>Correo</strong>
              <p>contacto@medicmax.com</p>
            </div>
            <div>
              <strong>Horario</strong>
              <p>Lunes a sábado: 8:00am - 8:00pm</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.formContainer}>
            <h2>Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nombre
                <input name="nombre" value={form.nombre} onChange={handleChange} required />
              </label>
              <label>
                Correo
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Mensaje
                <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required rows={4} />
              </label>
              <button type="submit">Enviar mensaje</button>
              {enviado && <p className={styles.success}>Gracias por contactarnos. Te responderemos pronto.</p>}
            </form>
          </div>

          <div className={styles.mapa}>
            <iframe
              title="Ubicación MedicMax"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.997239223007!2d-74.08175!3d4.60971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99e35d4bb0d1%3A0x33b4bda8edac2ffb!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1ses!2sco!4v1716576000000!5m2!1ses!2sco"
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
