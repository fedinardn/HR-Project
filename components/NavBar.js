import * as React from "react";
import styles from "../styles/NavBar.module.css"
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useState, useEffect } from "react";

const NavBar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmitRequestClick = () => {

    if (!user) {
      window.location.href = "/login";
    } else {
      window.location.href = "/app/program-requests/submitRequest";
    }
  };

  const handleLogout = () => {
    setUser(null);
    signOut(getAuth());
    window.location.href = "/login";
  }

  const renderUserMessage = () => {
    if (user) {
      return (
        <div className={styles.welcome}>
          Welcome, you are logged in as {user.email}
        </div>
      );
    }
  }

  function IconButton({ icon, alt }) {
    return (
      <div className="icon-button">
        <img src={icon} alt={alt} className="icon" />
      </div>
    );
  }


  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>
            <Link href={"/"}>
              CTLC
            </Link>
          </h1>
        </div>
        <nav className={styles.navigation}>
          <ul className={styles.menu}>

            <li>
              <a onClick={handleSubmitRequestClick}>Submit Request</a>
            </li>
            <li>
              <Link href={"/app/program-requests/viewRequests"}>
                Program Requests
              </Link>
            </li>
            <li>
              <Link href={"/"}>
                Home
              </Link>
            </li>
            <li>
              <Link href={"/dashboard"}>
                Dashboard
              </Link>
            </li>

            {user ? <li>

              <a onClick={handleLogout}>Logout</a>
              <a className={styles.welcome}> Welcome, {user.email}</a>

              

            </li> :
              <li>
                <Link href={"/login"}>Sign In</Link>

              </li>
              }

            

          </ul>
          {/* <div className={styles.actions}>
            <IconButton icon="https://cdn.builder.io/api/v1/image/assets/TEMP/446b18838c641d7530d07c21a2b7d42752cd2096fc66893db8734ce07de5a899?apiKey=6dceda0d543f454b955d90f7c576a010&" alt="Notification icon" />
            <IconButton icon="https://cdn.builder.io/api/v1/image/assets/TEMP/613b4d983053ce805793b287e33c94a63f28e96601710afa74731e72da9e31a0?apiKey=6dceda0d543f454b955d90f7c576a010&" alt="Settings icon" />
          </div>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/a362dd09f68740213ea73a5c47bb4131907844f04f385d2fbc14b5c91b75da47?apiKey=6dceda0d543f454b955d90f7c576a010&" alt="User avatar" className={styles.avatar} /> */}
        </nav>
      </header >
    </>
  );
}

export default NavBar;
