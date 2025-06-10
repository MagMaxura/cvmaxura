import '@/styles/globals.css'; // Asumimos que tendrás un archivo de estilos global

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;