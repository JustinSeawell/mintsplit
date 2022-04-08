import { Container, Grid, Step, StepLabel, Stepper } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ManageProject from "../components/ManageProject";
import ManageRevenueSplits from "../components/ManageRevenueSplits";
import ManageSongs from "../components/ManageSongs";
import ReviewProject from "../components/ReviewProject";
import UploadAudio from "../components/UploadAudio";

const steps = [
  "Upload Content",
  "Edit Content",
  "Add Details",
  // "Split Revenue",
  "Review & Launch",
];

function Setup() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    /**
     * Display confirmation before leaving the page.
     */
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Head>
        <title>MintSplit | Setup Project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container maxWidth="lg">
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
            <Grid marginTop={"4rem"}>
              {activeStep === 0 && <UploadAudio onSuccess={handleNext} />}
              {activeStep === 1 && (
                <ManageSongs onSuccess={handleNext} handleBack={handleBack} />
              )}
              {activeStep === 2 && (
                <ManageProject onSuccess={handleNext} handleBack={handleBack} />
              )}
              {activeStep === 3 && <ReviewProject />}
            </Grid>
          </section>
        </Container>
      </Layout>
    </>
  );
}

export default Setup;
