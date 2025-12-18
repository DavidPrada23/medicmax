import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Contacto.module.css";

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", telefono: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeroWhatsApp = "573053022867";
    const texto = `Hola, soy ${form.nombre} (${form.telefono}). ${form.mensaje}`;
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
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
            <h2>Envíanos un mensaje al WhatsApp</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nombre
                <input name="nombre" value={form.nombre} onChange={handleChange} required />
              </label>
              <label>
                Teléfono
                <input type="telefono" name="telefono" value={form.telefono} onChange={handleChange} required />
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
            <h2>Nuestras sedes</h2>
            <div className={styles.mapGrid}>
              <div className={styles.mapCard}>
                <h3>Sabaneta</h3>
                <iframe
                  title="Sede Sabaneta"
                  src="https://www.google.com/maps/place/DROGUERIA+MEDICMAX/@6.1519784,-75.6117814,17z/data=!3m1!4b1!4m6!3m5!1s0x8e468350c92f869f:0xbfd1e3d7f59df79d!8m2!3d6.1519784!4d-75.6117814!16s%2Fg%2F11r9ms6yxf?hl=es-419"
                  loading="lazy"
                ></iframe>
              </div>
              <div className={styles.mapCard}>
                <h3>Itagüí</h3>
                <iframe
                  title="Sede Itagüí"
                  src="https://www.google.com/maps/place/DROGUERIA+MEDICMAX+2/@6.169626,-75.60938,17z/data=!3m1!4b1!4m6!3m5!1s0x8e46831210644f67:0x64928cf430c71f8a!8m2!3d6.169626!4d-75.60938!16s%2Fg%2F11yk9t7gl1?hl=es-419"
                  loading="lazy"
                ></iframe>
              </div>
              
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
