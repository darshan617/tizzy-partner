import { storeWrapper } from "@/redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { ToastProvider } from "@/custom-hooks/toast/ToastProvider";

export default function App({ Component, pageProps, ...rest }) {
  const { store } = storeWrapper.useWrappedStore(rest);
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <Provider store={store}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </Provider>
  );
}
