import styles from "../../../styles/programRequestForm.module.css"
import { getAuth } from 'firebase/auth';

export default function SubmitProgramRequestPage() {
  const programLengths = ["1-3 hours", "3-6 hours", "Full day"];
  const programTypes = ["Conference", "Club Event", "Lecture",];


  const onProgramRequestSubmitted = async (event) => {
    event.preventDefault()
    const auth = getAuth(); // Get the Auth instance (assuming you need user authentication)

    const user = auth.currentUser;

    const contactPerson = event.target.contactPersonInput.value;
    const companyName = event.target.companyNameInput.value;
    const programTypes = event.target.programTypesInput.value;
    const desiredDate = event.target.desiredDateInput.value;
    const desiredLength = event.target.desiredLengthInput.value;
    const email = event.target.emailInput.value;
    const phone = event.target.phoneInput.value;
    const role = event.target.roleInput.value;
    const website = event.target.websiteInput.value;
    const size = event.target.sizeInput.value;
    const additionalDetails = event.target.additionalDetailsInput.value

    const response = await fetch("/api/program-requests/program-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ contactPerson: contactPerson, companyName: companyName, userid: user.uid, programTypes: programTypes, desiredDate: desiredDate, desiredLength: desiredLength, email: email, phone: phone, role: role, website: website, size: size, additionalDetails: additionalDetails })
    })
    if (response.ok) {
      console.log("request submitted")

    }
    event.target.reset();
  }

  return (
    <>
      <div className={styles.container}>
        {/* <header className={styles.header}>
          <div className={styles["step-indicator"]}>Step 1 of 3</div>
          <div className={styles["progress-bar"]}>
            <div className={styles.progress} />
          </div>
          <h2 className={styles.subtitle}>Request details</h2>
        </header> */}
        <main className={styles["form-container"]}>
          <h1 className={styles.title}>Request a program</h1>
          <form onSubmit={(event) => onProgramRequestSubmitted(event)}>
            <label htmlFor="contactPerson" className={styles.formlabel}>
              Contact person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPersonInput"
              className={styles["form-input"]}
              placeholder="Enter contact person name"
              aria-label="Enter contact person name"
              required
            />
            <label htmlFor="email" className={styles["form-label"]}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="emailInput"
              className={styles["form-input"]}
              placeholder="Enter your email"
              aria-label="Enter your email"
              required
            />
            <label htmlFor="phone" className={styles["form-label"]}>
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phoneInput"
              className={styles["form-input"]}
              placeholder="Enter your phone number"
              aria-label="Enter your phone number"
              required

            />

            <label htmlFor="role" className={styles["form-label"]}>
              Role
            </label>
            <input
              type="text"
              id="role"
              name="roleInput"
              className={styles["form-input"]}
              placeholder="Enter your role"
              aria-label="Enter your role"
            />

            <label htmlFor="companyName" className={styles["form-label"]}>
              Company name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyNameInput"
              className={styles["form-input"]}
              placeholder="Enter company name"
              aria-label="Enter company name"
              required
            />

            <label htmlFor="website" className={styles["form-label"]}>
              Website(If applicaple)
            </label>
            <input
              type="url"
              id="website"
              name="websiteInput"
              className={styles["form-input"]}
              placeholder="Enter your company website"
              aria-label="Enter your company website"
            />
            <label htmlFor="size" className={styles["form-label"]}>
              Group Size
            </label>
            <input
              type="number"
              id="size"
              name="sizeInput"
              className={styles["form-input"]}
              placeholder="Enter your group size"
              aria-label="Enter your group size"
              required
            />

            <label htmlFor="programType" className={styles["form-label"]}>
              Program type
            </label>
            <div className={styles["select-wrapper"]}>
              <select id="programTypes" name="programTypesInput" className={styles["select-input"]} aria-label="Select a program type" required>
                <option value="">Select a program type</option>
                {programTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/360139a58546f1a44c344016c3909c2a17ee16b8faf1c265cbd33b688552dab8?apiKey=6dceda0d543f454b955d90f7c576a010&" alt="" className={styles["select-arrow"]} />
            </div>
            <label htmlFor="desiredDate" className={styles["form-label"]}>
              Desired date
            </label>
            <input
              type="date"
              id="desiredDate"
              name="desiredDateInput"
              className={styles["form-input"]}
              placeholder="Enter your desired date"
              aria-label="Enter your desired date"
              required
            />
            <label htmlFor="programLength" className={styles["form-label"]}>
              Desired program length
            </label>
            <div className={styles["select-wrapper"]}>
              <select
                id="programLength"
                name="desiredLengthInput"
                className={styles["select-input"]}
                aria-label="Select a length"
                required
              >
                <option value="">Select a length</option>
                {programLengths.map((length, index) => (
                  <option key={index} value={length}>
                    {length}
                  </option>
                ))}
              </select>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1448298fe2ea85cfff1176242a243ec0ab6e9126f0ace451c066f9edbf4c9336?apiKey=6dceda0d543f454b955d90f7c576a010&" alt="" className={styles["select-arrow"]} />
            </div>

            <label htmlFor="additionalDetails" className={styles["form-label"]}>
              Additional Details
            </label>
            <textarea
              type="text"
              id="additionalDetails"
              name="additionalDetailsInput"
              className={styles["form-input-big"]}
              placeholder="Any additional details you would like us to know?"
              aria-label="Any additional details you would like us to know?"
            />


            <div className={styles["button-group"]}>
              <button type="button" className={styles["cancel-button"]}>
                Cancel
              </button>
              <button type="submit" className={styles["submit-button"]}>
                Submit
              </button>
            </div>
          </form>
        </main>
      </div>

    </>
  );
}

