// import React, { useState, useEffect } from "react";
// import { Button } from "primereact/button";
// import { useRouter } from "next/router";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import styles from "../styles/Home.module.css";
// import Image from "next/image";

// const ImageOverlay = ({
//   imageSrc,
//   title,
//   description,
//   buttonText,
//   buttonLink,
//   onButtonClick,
// }) => (
//   <div className={styles["image-overlay"]}>
//     <Image
//       src={imageSrc}
//       alt={title}
//       layout="fill"
//       objectFit="cover"
//       className={styles["background-image"]}
//     />
//     <div className={styles["content"]}>
//       <h2 className={styles["title"]}>{title}</h2>
//       <p className={styles["description"]}>{description}</p>
//       <Button
//         label={buttonText}
//         onClick={() => onButtonClick(buttonLink)}
//         className="p-button-raised p-button-rounded"
//       />
//     </div>
//   </div>
// );

// const Home = () => {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleButtonClick = (path) => {
//     if (!user) {
//       router.push("/login");
//     } else {
//       router.push(path);
//     }
//   };

//   const overlayData = [
//     {
//       imageSrc: "/tightRope.jpg",
//       // title: "Submit a request",
//       // description:
//       //   "Use this form to submit a new program request for the HR team to review.",
//       buttonText: "Submit a request",
//       buttonLink: "/app/program-requests/submitRequest",
//     },
//     {
//       imageSrc: "/tightRope.jpg",
//       // title: "View program requests",
//       // description:
//       //   "Use this table to view all program requests that have been submitted and their status.",
//       buttonText: "View program requests",
//       buttonLink: "/app/program-requests/viewRequests",
//     },
//   ];

//   return (
//     <div className={styles.container}>
//       <div className={styles.welcomeCard}>
//         <h1 className={styles.mainTitle}>Welcome to CTLC!</h1>
//         <p className={styles.titleParagraph}>
//           Your trusted partner for team building programs
//         </p>
//       </div>
//       {overlayData.map((overlay, index) => (
//         <ImageOverlay
//           key={index}
//           {...overlay}
//           onButtonClick={handleButtonClick}
//         />
//       ))}
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const ProgramCard = ({ icon, name, description, buttonText, buttonLink }) => (
  <Card className="flex flex-column h-full">
    <div className="flex-grow-1">
      <div className="flex align-items-center gap-3 mb-3">
        <i className={`pi ${icon} text-4xl`}></i>
        <h3 className="text-xl font-bold">{name}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3 text-left">{description}</p>
    </div>
    {buttonText && (
      <div className="mt-5 pt-3">
        <Button
          label={buttonText}
          className="p-button-rounded "
          onClick={() => window.open(buttonLink, "_blank")}
        />
      </div>
    )}
  </Card>
);

const ContactInfo = ({ icon, content, href }) => (
  <div className="flex align-items-center gap-2 mb-2">
    <i className={`pi ${icon}`}></i>
    <a href={href} className="text-blue-500 hover:underline">
      {content}
    </a>
  </div>
);

const CustomGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full h-64 overflow-hidden sticky">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.source}
          alt={image.alt}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full mx-1 focus:outline-none ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const images = [
    { source: "/tightRope.jpg", alt: "Team Building 1" },
    { source: "/rappel.jpg", alt: "Team Building 2" },
    { source: "/people.jpg", alt: "Team Building 3" },
    { source: "/rockClimbing.jpg", alt: "Team Building 4" },
    { source: "/silhouette.jpg", alt: "Team Building 5" },
    { source: "/support.jpg", alt: "Team Building 6" },
    { source: "/whaleWatch.jpg", alt: "Team Building 7" },
    { source: "/dangleDuo.jpeg", alt: "Team Building 8" },
  ];

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto p-4 flex-grow">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Cornell Team and Leadership Center
          </h1>

          <Card className="mb-5">
            <div className="flex flex-column md:flex-row justify-content-between align-items-center">
              <div className="flex-grow-1 mb-4 md:mb-0 md:mr-4">
                <div className="flex align-items-center gap-3">
                  <i className="pi pi-info-circle text-4xl"></i>
                  <p className="text-2xl font-bold mb-4">Who we are</p>
                </div>
                <p className="mb-4">
                  A nationally recognized leader in the field of
                  experience-based learning, Cornell's Team and Leadership
                  Center has provided programs for students and professionals
                  since our beginning in 1997. Our custom programs range from
                  short energizer sessions to multi-day trainings that combine
                  dynamic, experiential learning with models that make sense for
                  you and your team.
                </p>
                <Button
                  label="Explore Programs"
                  className="p-button-rounded p-button-outlined"
                  onClick={() =>
                    window.open(
                      "https://scl.cornell.edu/sub/coe/ctlc/programs",
                      "_blank"
                    )
                  }
                />
              </div>
            </div>
          </Card>

          <div className="grid">
            <div className="col-12 md:col-6 lg:col-3 mb-3">
              <ProgramCard
                icon="pi-users"
                name="Our Experience"
                description="Since the early 1980s, we've served over twenty thousand individuals. Our unique approach engages participants in transformative experiences, shifting perspectives and inspiring new ways of operating. Join us to explore the power of experiential learning."
                buttonText="Learn More"
                buttonLink="https://scl.cornell.edu/sub/coe/ctlc/who-we-serve"
              />
            </div>
            <div className="col-12 md:col-6 lg:col-3 mb-3">
              <ProgramCard
                icon="pi-calendar"
                name="Request a Program"
                description="Ready to elevate your team's performance? Our tailored programs cater to your specific needs, combining innovative techniques with proven methodologies. From short sessions to multi-day trainings, we craft experiences that drive lasting change and growth."
                buttonText="Submit a Request"
                buttonLink="/app/program-requests/submitRequest"
              />
            </div>
            <div className="col-12 md:col-6 lg:col-3 mb-3">
              <ProgramCard
                icon="pi-compass"
                name="Our Facilities"
                description="Experience exceptional programming at our high-quality facilities on Cornell University's campus in Ithaca, New York. Our year-round venue offers diverse environments for team building, from indoor spaces to outdoor challenge courses, supporting dynamic learning experiences."
                buttonText="Explore"
                buttonLink="https://scl.cornell.edu/sub/coe/ctlc/facilities"
              />
            </div>
            <div className="col-12 md:col-6 lg:col-3 mb-3">
              <Card className="h-full">
                <div className="flex align-items-center gap-3 mb-3">
                  <i className="pi pi-send text-4xl"></i>
                  <h3 className="text-xl font-bold">Contact Us</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 text-left">
                  Have questions or need more information? Our team is here to
                  help. Reach out to us for any inquiries about our programs,
                  facilities, or how we can tailor our services to meet your
                  team's unique needs.
                </p>
                <ContactInfo
                  icon="pi-phone"
                  content="607-254-4897"
                  href="tel:+16072544897"
                />
                <ContactInfo
                  icon="pi-envelope"
                  content="teambuilding@cornell.edu"
                  href="mailto:teambuilding@cornell.edu"
                />
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="w-full mt-8">
        <CustomGallery images={images} />
      </div> */}
    </>
  );
};

export default HomePage;
