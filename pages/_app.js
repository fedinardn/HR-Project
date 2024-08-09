// import "../styles/global.css";
// import NavBar from "../components/NavBar";
// import Footer from "../components/Footer";
// import Head from "next/head";
// import { useState, useEffect } from "react";
// import { onAuthStateChanged, getAuth } from "firebase/auth";
// import firebaseApp from "../firebase";
// import { SpeedInsights } from "@vercel/speed-insights/next";
// import { Analytics } from "@vercel/analytics/react";
// import { PrimeReactProvider } from "primereact/api";

// function MyApp({ Component, pageProps }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // We track the auth state to reset firebaseUi if the user signs out.
//     return onAuthStateChanged(getAuth(firebaseApp), (user) => {
//       // console.log("Auth state changed, user:", user);
//       setUser(user);
//     });
//   }, []);
//   return (
//     <div>
//       <Head>
//         <title>HR Dashboard</title>
//         <meta name="description" content="HR Dashboard" />
//       </Head>
//       <NavBar />
//       <PrimeReactProvider user={user}>
//         <Component {...pageProps} user={user} />
//       </PrimeReactProvider>
//       <Footer />
//       <Analytics />
//       <SpeedInsights />
//     </div>
//   );
// }

// export default MyApp;
import "../styles/global.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { PrimeReactProvider } from "primereact/api";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>HR Dashboard</title>
        <meta name="description" content="HR Dashboard" />
      </Head>
      <NavBar />
      <PrimeReactProvider>
        <Component {...pageProps} />
      </PrimeReactProvider>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </SessionProvider>
  );
}

export default MyApp;
