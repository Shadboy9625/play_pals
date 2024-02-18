import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode.react";
import { ReclaimClient } from "@reclaimprotocol/js-sdk";

const OnBoarding = () => {
  const getVerificationReq = async () => {
    const APP_ID = "0xf8C8bDE8BF1100C6AF9d0f34b24becA88CeC5399";
    const APP_SECRET =
      "0xdea76dc6d6a8c1ee80aeba950f6f5f309aa51da4bbcf35d93dac2360f0e1b6f0"; // do not store on frontend in production

    const reclaimClient = new ReclaimClient(APP_ID);

    const providers = [
      "1bba104c-f7e3-4b58-8b42-f8c0346cdeab", // Steam ID
    ];

    const providerV2 = await reclaimClient.buildHttpProviderV2ByID(providers);
    const requestProofs = reclaimClient.buildRequestedProofs(
      providerV2,
      reclaimClient.getAppCallbackUrl()
    );

    reclaimClient.setSignature(
      await reclaimClient.getSignature(requestProofs, APP_SECRET)
    );

    const reclaimReq = await reclaimClient.createVerificationRequest(providers);
    console.log("req", reclaimReq.template);
    const url = await reclaimReq.start();
    console.log(url);
    setUrl(url);
    console.log(url);

    reclaimReq.on("success", (data) => {
      if (data) {
        const proofs = data;
        console.log(proofs);
      }
    });

    reclaimReq.on("error", (data) => {
      if (data) {
        const proofs = data;
        // TODO: update business logic based on proof generation failure
      }
    });
  };

  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [url, setUrl] = useState("");
  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    gender_interest: "woman",
    url: "",
    about: "",
    matches: [],
  });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("submitted");
    e.preventDefault();
    try {
      const response = await axios.patch("http://localhost:8000/user", {
        formData,
      });
      console.log(response);
      const success = response.status === 200;
      if (success) navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    console.log("e", e);
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
    getVerificationReq();
  }, []);
  return (
    <div className="onboarding">
      <div className="onboarding">
        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              placeholder="First Name"
              required={true}
              value={formData.first_name}
              onChange={handleChange}
            />
            <label>Birthday</label>
            <div className="multiple-input-container">
              <input
                id="dob_day"
                type="number"
                name="dob_day"
                placeholder="DD"
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
              />

              <input
                id="dob_month"
                type="number"
                name="dob_month"
                placeholder="MM"
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
              />

              <input
                id="dob_year"
                type="number"
                name="dob_year"
                placeholder="YYYY"
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>
            <label>Gender</label>
            <div className="multiple-input-container">
              <input
                id="man-gender-identity"
                type="radio"
                name="gender_identity"
                value="man"
                onChange={handleChange}
                checked={formData.gender_identity === "man"}
              />
              <label htmlFor="man-gender-identity">Man</label>
              <input
                id="woman-gender-identity"
                type="radio"
                name="gender_identity"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_identity === "woman"}
              />
              <label htmlFor="woman-gender-identity">Woman</label>
              <input
                id="more-gender-identity"
                type="radio"
                name="gender_identity"
                value="more"
                onChange={handleChange}
                checked={formData.gender_identity === "more"}
              />
              <label htmlFor="more-gender-identity">More</label>
            </div>
            <div>
              <label htmlFor="show-gender">Show Gender on my Profile</label>
              <input
                id="show-gender"
                type="checkbox"
                name="show_gender"
                onChange={handleChange}
                checked={formData.show_gender}
              />
            </div>
            {/* <label>Show Me</label>

            <div className="multiple-input-container">
              <input
                id="man-gender-interest"
                type="radio"
                name="gender_interest"
                value="man"
                onChange={handleChange}
                checked={formData.gender_interest === "man"}
              />
              <label htmlFor="man-gender-interest">Man</label>
              <input
                id="woman-gender-interest"
                type="radio"
                name="gender_interest"
                value="woman"
                onChange={handleChange}
                checked={formData.gender_interest === "woman"}
              />
              <label htmlFor="woman-gender-interest">Woman</label>
              <input
                id="everyone-gender-interest"
                type="radio"
                name="gender_interest"
                value="everyone"
                onChange={handleChange}
                checked={formData.gender_interest === "everyone"}
              />
              <label htmlFor="everyone-gender-interest">Everyone</label>
            </div> */}
            <label htmlFor="about">QR Code</label>
            <QRCode value={url} />{" "}
            <div>
              <label>Your Favorite Games</label>
              <div>
                <input
                  id="games"
                  type="text"
                  name="games"
                  required={true}
                  placeholder="Minecraft, PalWorld etc..."
                />
              </div>
            </div>
            <input type="submit" />
          </section>

          <section>
            <label htmlFor="url">Profile Photo</label>
            <input
              type="url"
              name="url"
              id="url"
              onChange={handleChange}
              required={true}
            />
            <div className="photo-container">
              {formData.url && (
                <img src={formData.url} alt="profile pic preview" />
              )}
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};
export default OnBoarding;
