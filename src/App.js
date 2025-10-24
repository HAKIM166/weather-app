import "./App.css";

import { createTheme, ThemeProvider } from "@mui/material";

// REACT
import { useEffect, useState } from "react";

// MATERIAL UI COMPONENTS
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

// EXTERNAL LIBRARIES
import axios from "axios";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
  // palette: {
  //   primary: {
  //     main: "#dd2c00",
  //   },
  // },
});

let cancelAxios = null;
function App() {
  const { t, i18n } = useTranslation();

  // ======== STATES ======== //
  const [temp, setTemp] = useState({
    date: null,
    name: "",
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  const [locale, setLocale] = useState("ar");

  const direction = locale === "ar" ? "rtl" : "ltr";

  // ======== EVENT HANDLERS ======== //
  function handleLanguageClick() {
    if (locale === "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
    }
  }
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);
  useEffect(() => {
    const lang = i18n.language === "ar" ? "ar" : "en";

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=27.182471&lon=31.185342&appid=05b9eb985632e9ff18f5ceb59fd7b694&units=metric&lang=${lang}`,
        {
          cancelToken: new axios.CancelToken((c) => (cancelAxios = c)),
        }
      )
      .then((response) => {
        const name = response.data.name;
        const description = response.data.weather[0].description;
        const timestamp = response.data.dt;
        const tempNow = Math.round(response.data.main.temp);
        const min = Math.round(response.data.main.temp_min);
        const max = Math.round(response.data.main.temp_max);
        const icon = response.data.weather[0].icon;

        moment.locale(lang);
        const formattedDate = moment
          .unix(timestamp)
          .format("dddd, D MMMM YYYY");

        setTemp({
          name,
          description,
          date: formattedDate,
          number: tempNow,
          min,
          max,
          icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
        });
      })
      .catch(console.error);

    return () => cancelAxios && cancelAxios();
  }, [i18n.language]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* CONTENT CONTAINER */}
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/* CARD */}
            <div
              dir={direction}
              style={{
                width: "100%",
                background: "rgb(28 52 91/ 36%)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
              }}
            >
              {/* CONTENT */}
              <div>
                {/* CITY & TIME */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                  }}
                  dir={direction}
                >
                  <Typography
                    variant="h2"
                    style={{ marginRight: "20px", fontWeight: "600" }}
                  >
                    {t(`${temp.name}`)}
                  </Typography>
                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {temp.date}
                  </Typography>
                </div>
                {/*== CITY & TIME ==*/}
                <hr />
                {/* CONTAINER OF DEGREE + CLOUD ICON */}
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  {/* DEGREE & DESCRIPTION */}
                  <div>
                    {/* TEMP */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="h1" style={{ textAlign: "right" }}>
                        {temp.number}
                      </Typography>
                      <img src={temp.icon} />
                    </div>
                    {/*== TEMP ==*/}
                    <Typography variant="h6">
                      {t(`${temp.description}`)}
                    </Typography>
                    {/* MIN & MAX */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5>
                        {t("الصغرى")}: {temp.min}
                      </h5>
                      <h5 style={{ margin: "0px 5px" }}>|</h5>
                      <h5>
                        {t("الكبرى")}: {temp.max}
                      </h5>
                    </div>
                  </div>
                  {/*== DEGREE & DESCRIPTION ==*/}

                  <CloudIcon
                    sx={{
                      fontSize: "clamp(70px, 15vw, 120px)",
                      color: "white",
                    }}
                  />
                </div>
                {/*== CONTAINER OF DEGREE + CLOUD ICON ==*/}
              </div>
              {/*== CONTENT ==*/}
            </div>
            {/*== CARD ==*/}
            {/* TRANSLATION CONTAINER */}
            <div
              dir={direction}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                marginTop: "20px",
              }}
            >
              <Button
                style={{ color: "white" }}
                variant="text"
                onClick={handleLanguageClick}
              >
                {locale === "en" ? "Arabic" : "إنجليزي"}
              </Button>
            </div>
            {/*== TRANSLATION CONTAINER ==*/}
          </div>
          {/*== CONTENT CONTAINER ==*/}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
