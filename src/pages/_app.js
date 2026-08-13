import { storeWrapper } from "@/redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { ToastProvider } from "@/custom-hooks/toast/ToastProvider";
import Script from "next/script";
{
  /* <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="lazyOnload"
/>; */
}
export default function App({ Component, pageProps, ...rest }) {
  const { store } = storeWrapper.useWrappedStore(rest);
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // useEffect(() => {
  //   const handleContextMenu = (e) => e.preventDefault();

  //   document.addEventListener("contextmenu", handleContextMenu);

  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // }, []);

  // useEffect(() => {
  //   const preventContextMenu = (e) => {
  //     e.preventDefault();
  //   };

  //   const preventCopyPaste = (e) => {
  //     e.preventDefault();
  //   };

  //   const preventKeyboard = (e) => {
  //     console.log(e.key, "e");
  //     const key = e.key?.toLowerCase();

  //     // Ctrl/Cmd + C, V, X, A, P, S
  //     if (
  //       (e.ctrlKey || e.metaKey) &&
  //       ["c", "v", "x", "a", "p", "s"].includes(key)
  //     ) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }

  //     // Print Screen
  //     if (e.key === "PrintScreen") {
  //       e.preventDefault();
  //       e.stopPropagation();

  //       // Try to clear anything copied by PrintScreen
  //       if (navigator.clipboard) {
  //         navigator.clipboard.writeText("").catch(() => {});
  //       }

  //       return false;
  //     }

  //     // Windows screenshot shortcut: Win + Shift + S
  //     if (e.shiftKey && e.key?.toLowerCase() === "s" && e.metaKey) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }

  //     // F12 / DevTools shortcuts
  //     if (e.key === "F12") {
  //       e.preventDefault();
  //       return false;
  //     }

  //     // Ctrl + Shift + I / J
  //     if (
  //       (e.ctrlKey || e.metaKey) &&
  //       e.shiftKey &&
  //       ["i", "j", "c"].includes(key)
  //     ) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     }
  //   };
  //   document.addEventListener("contextmenu", preventContextMenu);
  //   document.addEventListener("copy", preventCopyPaste);
  //   document.addEventListener("cut", preventCopyPaste);
  //   document.addEventListener("paste", preventCopyPaste);
  //   document.addEventListener("keydown", preventKeyboard);

  //   return () => {
  //     document.removeEventListener("contextmenu", preventContextMenu);
  //     document.removeEventListener("copy", preventCopyPaste);
  //     document.removeEventListener("cut", preventCopyPaste);
  //     document.removeEventListener("paste", preventCopyPaste);
  //     document.removeEventListener("keydown", preventKeyboard);
  //   };
  // }, []);
  return (
    <Provider store={store}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </Provider>
  );
}
