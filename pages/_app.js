import '../styles/globals.css';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const t = localStorage.getItem('mdwa-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  }, []);
  return <Component {...pageProps} />;
}
