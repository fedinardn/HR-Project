import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";


  
const handleSubmitRequestClick = ({ user }) => {

  if (!user) {
    window.location.href = "/login";
  } else {
    window.location.href = "/app/program-requests/submitRequest";
  }
};

const ImageOverlay = ({ imageSrc, title, description, buttonText, buttonLink }) => (
  <div className={styles['image-overlay']}>
    <img src={imageSrc} alt="" className={styles['background-image']} />
    <div className={styles['content']}>
      <h2 className={styles['title']}>{title}</h2>
      <p className={styles['description']}>{description}</p>
      {/* <Link href={buttonLink}> */} 
      <a onClick={handleSubmitRequestClick}> 
        <div className={styles['button-container']}>
          <div className={styles['button']}>{buttonText}</div>
        </div>
      </a>
      {/* </Link> */}
    </div>
  </div>
);

const Home = () => {
  const overlayData = [
    {
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/4036af34853395d1ff2796da0580f5da0cabd35f8b18a845cf1d3473dabe4238?apiKey=6dceda0d543f454b955d90f7c576a010&',
      title: 'Submit a request',
      description:
        'Use this form to submit a new program request for the HR team to review.',
      buttonText: 'Submit a request',
      buttonLink: "/app/program-requests/submitRequest"
    },
    {
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/b6d4e598e5745132e8c8049428252688ef3972f0740b56df903e88f2b520febc?apiKey=6dceda0d543f454b955d90f7c576a010&',
      title: 'View program requests',
      description:
        'Use this table to view all program requests that have been submitted and their status.',
      buttonText: 'View program requests',
      buttonLink: "/app/program-requests/viewRequests"
    },
  ];

  return (
    <>



      <main className={styles.container}>
        <div>
          <h1 className={styles.mainTitle}>
            Welcome to CTLC!
          </h1>
        </div>
        <div>
          <p className={styles.titleParagraph}>
            Your trusted partner for team building programs
          </p>
        </div>
        {overlayData.map((overlay, index) => (
          <ImageOverlay key={index} {...overlay} />
        ))}
      </main>
    </>
  );
};

export default Home;