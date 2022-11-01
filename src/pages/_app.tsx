import { AppProps } from "next/app";
import { Header } from "../components/Header";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

//paypal client id AUpX7acJmH08U2R4cbXsU6TQZawmyhsL81Q3By0J6AyicWozYp2Ip-OnFAmLv-IPxXk-ZqjrCFArBwOq
//<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

import "../styles/global.scss";

import { SessionProvider } from "next-auth/react";

const initialOptions = {
  // "client-id": "AUpX7acJmH08U2R4cbXsU6TQZawmyhsL81Q3By0J6AyicWozYp2Ip-OnFAmLv-IPxXk-ZqjrCFArBwOq", //test
  "client-id": "ASnAWW6lv1dUmsaerv_7dSRKYvAYkRQq0SFtiFXLRqLKxIk7JPBHmTg4irpo9DQQx8MaDu1MFSQAaWJ4", //production
  currency: "BRL",
  intent: "capture",
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <PayPalScriptProvider options={initialOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </SessionProvider>
  );
}

export default MyApp;
