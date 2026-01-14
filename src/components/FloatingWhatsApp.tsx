import styles from "../styles/FloatingWhatsApp.module.css";

export const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=573053022867&text&type=phone_number&app_absent=0";

export default function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      className={styles.button}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatea con nosotros por WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M16 3c-7.18 0-13 5.56-13 12.42a12 12 0 0 0 2.25 7.06L4 29l6.61-2.13A13.54 13.54 0 0 0 16 27.84c7.18 0 13-5.56 13-12.42S23.18 3 16 3zm0 22.86a11 11 0 0 1-5.74-1.64l-.41-.25-3.92 1.27 1.29-3.66-.27-.38A9.53 9.53 0 0 1 6.5 15.42c0-5.31 4.27-9.64 9.5-9.64s9.5 4.33 9.5 9.64S21.23 25.86 16 25.86zm5.28-7.15c-.29-.14-1.71-.84-1.98-.94s-.46-.14-.66.14-.76.94-.93 1.13-.34.21-.63.07a7.71 7.71 0 0 1-2.27-1.87 8.47 8.47 0 0 1-1.58-2.05c-.17-.29 0-.45.13-.59s.29-.34.43-.52a1.87 1.87 0 0 0 .28-.49.54.54 0 0 0 0-.52c0-.14-.66-1.6-.9-2.2s-.48-.52-.66-.53-.38 0-.58 0a1.11 1.11 0 0 0-.8.38A3.35 3.35 0 0 0 9 12.05a5.86 5.86 0 0 0 1.26 3.1c.15.2 2 3.19 4.87 4.39a16.57 16.57 0 0 0 1.62.6 4 4 0 0 0 1.83.11 3 3 0 0 0 2-1.43 2.42 2.42 0 0 0 .17-1.43c-.15-.14-.26-.21-.45-.3z" />
      </svg>
    </a>
  );
}
