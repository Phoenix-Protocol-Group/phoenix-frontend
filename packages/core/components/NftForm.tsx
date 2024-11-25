"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Button } from "@phoenix-protocol/ui";
import TelegramIcon from "@mui/icons-material/Telegram";
import ChatIcon from "@mui/icons-material/Chat"; // Assuming this for Discord
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

interface FormData {
  collectionName: string;
  isListedElsewhere: string;
  additionalInfo?: string;
  telegram?: string;
  discord?: string;
  twitter?: string;
  teamInfo: string;
  interestReason: string;
  exampleLink: string;
  additionalNotes?: string;
}

const initialData: FormData = {
  collectionName: "",
  isListedElsewhere: "",
  teamInfo: "",
  interestReason: "",
  exampleLink: "",
};

function MultistepForm() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [step, setStep] = useState(1);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!executeRecaptcha) {
      alert("Recaptcha not ready");
      return;
    }

    // const recaptchaToken = await executeRecaptcha("submit");

    try {
      await axios.post("https://api.web3forms.com/submit", {
        ...formData,
        access_key: "ab1330c1-1bc2-4ea2-a6ae-451c0515b84d",
        // "g-recaptcha-response": recaptchaToken,
        ccemail: "PhoenixNFTS@proton.me",
      });
      alert("Submission successful!");
    } catch (error) {
      alert("Submission failed.");
    }
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const FormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <TextField
              label="What is the name of your NFT Collection?"
              name="collectionName"
              value={formData.collectionName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">
                Is your project listed in other ecosystems?
              </FormLabel>
              <RadioGroup
                row
                name="isListedElsewhere"
                value={formData.isListedElsewhere}
                onChange={handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              {formData.isListedElsewhere === "yes" && (
                <TextField
                  label="Additional Info"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              )}
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <TextField
              label="Telegram"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TelegramIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Discord"
              name="discord"
              value={formData.discord}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ChatIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TwitterIcon />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      case 3:
        return (
          <>
            <TextField
              label="Tell us more about the team"
              name="teamInfo"
              value={formData.teamInfo}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <TextField
              label="Why are you interested in being among the first?"
              name="interestReason"
              value={formData.interestReason}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <TextField
              label="Link an example of your collection"
              name="exampleLink"
              value={formData.exampleLink}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 4:
        return (
          <TextField
            label="Anything else you want us to know?"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            sx={{ width: "100%" }}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
        backdropFilter: "blur(42px)",
        padding: "16px",
        borderRadius: "8px",
        width: { md: "600px", xs: "100%" },
        height: "600px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 6,
      }}
    >
      <form onSubmit={handleSubmit} id="submit-form" style={{ width: "100%" }}>
        <input type="hidden" name="ccemail" value="PhoenixNFTS@proton.me" />
        <Typography variant="h6" gutterBottom>{`Step ${step} of 4`}</Typography>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {FormStep()}
        </motion.div>
        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button
            type="secondary"
            fullWidth={false}
            onClick={previousStep}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 4 ? (
            <Button type="secondary" onClick={nextStep}>
              Next
            </Button>
          ) : (
            // @ts-ignore
            <Button type="secondary" onClick={(e) => handleSubmit(e)}>
              Submit
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
}

export default function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LeazAUqAAAAAHY4YYykLcjOge77DNF9V8WygidO">
      <MultistepForm />
    </GoogleReCaptchaProvider>
  );
}
