import { Grid, Step, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ManageProject from "../components/ManageProject";
import ManageSongs from "../components/ManageSongs";
import ReviewProject from "../components/ReviewProject";
import UploadAudio from "../components/UploadAudio";

const steps = [
  "Upload Content",
  "Edit Content",
  "Add Details",
  "Review & Launch",
];

function Setup() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Request user confirmation before leaving the page
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  const scrollToTop = () => window.scrollTo(0, 0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    scrollToTop();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    scrollToTop();
  };

  return (
    <Layout title="Setup Your NFT Project">
      <section>
        <Stepper activeStep={activeStep} sx={{ mt: "2rem" }}>
          {steps.map((label) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </section>
      <section>
        <Grid marginTop={"4rem"}>
          {activeStep === 0 && <UploadAudio onSuccess={handleNext} />}
          {activeStep === 1 && (
            <ManageSongs onSuccess={handleNext} handleBack={handleBack} />
          )}
          {activeStep === 2 && (
            <ManageProject onSuccess={handleNext} handleBack={handleBack} />
          )}
          {activeStep === 3 && <ReviewProject handleBack={handleBack} />}
        </Grid>
      </section>
    </Layout>
  );
}

export default Setup;
