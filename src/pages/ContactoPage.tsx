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
              <p>+57 305 302-2867</p>
            </div>
            <div>
              <strong>Correo</strong>
              <p>drogueriamedicmax@gmail.com</p>
            </div>
            <div>
              <strong>Horario</strong>
              <p>Lunes a sábado: 7:00am - 9:00pm</p>
              <p>Domingo y festivos: 8:00am - 8:00pm</p>
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
              src="https://www.google.com/maps/place/Droguer%C3%ADa+MedicMax/@4.710989,-74.0720923,15z/data=!4m5!3m4!1s0x0:0x8f3c1e2f3e6f4e0!8m2!3d4.710989!4d-74.0720923"
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
