import React, { createContext, useContext } from "react";
import axios from "axios";

export default function AppServiceProvider({ children }) {
  const AppServiceContext = createContext();

  function useAppService() {
    return useContext(AppServiceContext);
  }

  const appService = {
    checkProfile() {
      return axios.get("/api/profile", {
        headers: {
          "Cache-Control": "max-age=86400",
        },
      });
    },

    adminProfile() {
      return axios.get("/api/admin");
    },

    logout() {
      window.location.href = "/api/auth/signout";
    },

    forOhOne() {
      return axios.get("/api/401");
    },

    forOhThree() {
      return axios.get("/api/403");
    },

    forOhFour() {
      return axios.get("/api/404");
    },

    forOhFive() {
      return axios.get("/api/500");
    },
  };

  return (
    <div>
      <p>"app service"</p>
    </div>
  );
}
