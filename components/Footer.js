import * as React from "react";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  function AddressBlock() {
    return (
      <div className={styles["address-block"]}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb318bd0a6364438b60aa5543596f062f4abcfd0fa22878b63909a6d96f78b8c?apiKey=6dceda0d543f454b955d90f7c576a010&"
          alt=""
          className={styles["icon"]}
        />
        <p className={styles["address-text"]}>
          B01 Bartels Hall, 554 Campus Road • Ithaca, NY 14853
        </p>
      </div>
    );
  }

  function PhoneBlock({ src, number }) {
    return (
      <div className={styles["phone-block"]}>
        <img loading="lazy" src={src} alt="" className={styles["icon"]} />
        <p className={styles["phone-number"]}>{number}</p>
      </div>
    );
  }

  function SocialMediaIcons() {
    const socialMediaSrc = [
      "https://cdn.builder.io/api/v1/image/assets/TEMP/dc1d7cf56a513482754bd8bf043192a0b66db6ae64e33a0b6973fef9ac0f56c4?apiKey=6dceda0d543f454b955d90f7c576a010&",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/09e521c340365e9da2e500eeaaae04d0e619c9256481d9b5855a55dddda575f8?apiKey=6dceda0d543f454b955d90f7c576a010&",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/2025939db743730254b699b4b09b2242b7c8ddefb3a3f6526ee9edba0860aa1d?apiKey=6dceda0d543f454b955d90f7c576a010&",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5bb70d9d5861e12d950a26b59becd770506e33d669e6c048609ea0366c43607a?apiKey=6dceda0d543f454b955d90f7c576a010&",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/2bddae20179dccf819d6aa06cc0eb77f721fb05757bece07d847d0ccee286e69?apiKey=6dceda0d543f454b955d90f7c576a010&",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e079d0002072c2db4b8dbbdb5b36dcfa042fe51978a7f1aacbd33e38f05ef289?apiKey=6dceda0d543f454b955d90f7c576a010&",
    ];

    return (
      <div className="social-media-icons">
        {socialMediaSrc.map((src, index) => (
          <img
            key={index}
            loading="lazy"
            src={src}
            alt=""
            className={styles["social-media-icon"]}
          />
        ))}
      </div>
    );
  }

  function FooterLinks() {
    const links = [
      "About us",
      "Contact us",
      "Help",
      "Privacy Policy",
      "Disclaimer",
    ];

    return (
      <nav className={styles["footer-links"]}>
        {links.map((link, index) => (
          <a key={index} href="#" className={styles["footer-link"]}>
            {link}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <>
      <div className={styles["container"]}>
        <section className={styles["cta-section"]}>
          <div className={styles["cta-content"]}>
            <div className={styles["line"]} />
            <div className={styles["info-section"]}>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8683de68b243e6a31a9bfe9f0f2cc308fafc2e22cc7b13f45667dfa4bb74c407?apiKey=6dceda0d543f454b955d90f7c576a010&"
                alt="Logo"
                className={styles["logo"]}
              />
              <div className={styles["info-content"]}>
                <AddressBlock />
                <div className={styles["phone-section"]}>
                  <PhoneBlock
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/77f45c37de75f746c60e9b863dd39335c012cc9803fbaaa3b98c139b63cf6154?apiKey=6dceda0d543f454b955d90f7c576a010&"
                    number="607-254-4897 "
                  />
                  <PhoneBlock
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/507d6426fea584f0f113b09d57e9bff0bc54fe1996dd8bd151b7ec822e045359?apiKey=6dceda0d543f454b955d90f7c576a010&"
                    number="607-255-9881"
                  />
                </div>
                <div className={styles["social-media-section"]}>
                  {/* <p className={styles["social-media-text"]}>Social Media</p> */}
                  <SocialMediaIcons />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
