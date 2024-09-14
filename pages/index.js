import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";

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
    <a href={href} className="text-500 hover:underline">
      {content}
    </a>
  </div>
);

const HomePage = () => {
  const images = [
    { source: "/dangleDuo.jpeg", alt: "Team Building 8" },
    { source: "/tightRope.jpg", alt: "Team Building 1" },
    { source: "/rockClimbing.jpg", alt: "Team Building 4" },
    { source: "/support.jpg", alt: "Team Building 6" },
    { source: "/rappel.jpg", alt: "Team Building 2" },
    { source: "/people.jpg", alt: "Team Building 3" },
    { source: "/silhouette.jpg", alt: "Team Building 5" },
    { source: "/whaleWatch.jpg", alt: "Team Building 7" },
  ];

  const carouselItemTemplate = (item) => {
    return (
      <div>
        <img
          src={item.source}
          alt={item.alt}
          style={{
            aspectRatio: "16/9",
            borderRadius: "12px",
          }}
        />
      </div>
    );
  };

  return (
    <>
      <div className="block">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Cornell Team and Leadership Center
        </h1>
        <div className="mb-5 flex justify-content-center">
          <div style={{ width: "66%" }}>
            <Carousel
              value={images}
              numVisible={1}
              numScroll={1}
              circular
              autoplayInterval={3000}
              itemTemplate={carouselItemTemplate}
            />
          </div>
        </div>

        <div className="container mx-auto p-4 flex-grow">
          <Card className="mb-5">
            <div className="flex flex-column md:flex-row justify-content-between align-items-center">
              <div className="flex-grow-1 mb-3 md:mb-0 md:mr-4">
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
    </>
  );
};

export default HomePage;
