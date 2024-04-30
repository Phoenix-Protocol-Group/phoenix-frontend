import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Stack,
  Grid,
  Fade,
  Container,
  Link,
  useMediaQuery,
} from "@mui/material";
import moment from "moment-timezone";

const socialIconStyle = {
  borderRadius: "16px",
  width: "52px",
  height: "52px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  marginRight: "16px",
  transition:
    "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  "&:hover": {
    backgroundColor: "rgba(144, 202, 249, 0.08)",
  },
};
interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const StepHeaderStyle = {
  color: "#FFF",
  fontFamily: "Ubuntu",
  fontSize: "24px",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "normal",
  margin: "16px 0",
};

const StepTextStyle = {
  color: "#FFF",
  fontFamily: "Ubuntu",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "140%",
  opacity: 0.6000000238418579,
};

const Countdown: React.FC = () => {
  const targetDate = moment
    .tz("2024-05-07 20:00:00", "Europe/Berlin")
    .valueOf();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment().valueOf();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      } else {
        setTimeLeft({
          days: days.toString().padStart(2, "0"),
          hours: hours.toString().padStart(2, "0"),
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0"),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("md")
  );

  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="img"
        sx={{
          mixBlendMode: "lighten",
          position: "absolute",
          height: "100vh",
          right: 0,
          opacity: 0.6,
        }}
        src={"/hero.png"}
      />
      <Box>
        <Box component="img" src="/logo.png" sx={{ width: 300 }} />
      </Box>
      <Box
        sx={{
          maxWidth: 900,
          padding: { xs: 1, md: 4 },
          margin: "auto",
          mt: 2,
          borderRadius: "16px",
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
          backdropFilter: "blur(42px)",
        }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          Launching Phase 1 in:
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Box>
            <Typography variant="body2" color="orange">
              Days
            </Typography>
            <Typography variant={isSmallScreen ? "h2" : "h1"}>
              {timeLeft.days}:
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="orange">
              Hours
            </Typography>
            <Typography variant={isSmallScreen ? "h2" : "h1"}>
              {timeLeft.hours}:
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="orange">
              Minutes
            </Typography>
            <Typography variant={isSmallScreen ? "h2" : "h1"}>
              {timeLeft.minutes}:
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="orange">
              Seconds
            </Typography>
            <Typography variant={isSmallScreen ? "h2" : "h1"}>
              {timeLeft.seconds}
            </Typography>
          </Box>
        </Stack>

        <Container
          sx={{
            maxWidth: 900,
            padding: 4,
            margin: "auto",
            mt: 2,
            borderRadius: "16px",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)",
            backdropFilter: "blur(42px)",
          }}
        >
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Ubuntu",
              fontSize: "56px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "100%",
            }}
          >
            Prepare for the
          </Typography>
          <Typography
            sx={{
              background:
                "-webkit-linear-gradient(137deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Ubuntu",
              fontSize: "56px",
              fontStyle: "normal",
              fontWeight: 700,
            }}
          >
            Phoenix Ecosystem!
          </Typography>
          <Grid container spacing={10}>
            <Grid item md={4}>
              <Typography sx={StepHeaderStyle}>Step 1</Typography>
              <Typography sx={StepTextStyle}>
                Install a wallet to your browser, such as{" "}
                <Link target="_blank" href="https://www.freighter.app/">
                  Freighter
                </Link>{" "}
                or{" "}
                <Link target="_blank" href="https://xbull.app/">
                  xBull
                </Link>{" "}
                wallet
              </Typography>
            </Grid>
            <Grid item md={4}>
              <Typography sx={StepHeaderStyle}>Step 2</Typography>
              <Typography sx={StepTextStyle}>
                Send XLM to your wallet address, such as from a centralized
                exchange or onramp with services like{" "}
                <Link target="_blank" href="https://www.kado.money/">
                  Kado
                </Link>
              </Typography>
            </Grid>
            <Grid item md={4}>
              <Typography sx={StepHeaderStyle}>Step 3</Typography>
              <Typography sx={StepTextStyle}>
                Provide liquidity to the Phoenix Protocol after the launch to
                make yourself eligible for the airdrop!
              </Typography>
            </Grid>
          </Grid>
          <Box
            id="socials"
            sx={{
              position: "relative",
              mt: 8,
              "&:after": {
                position: "absolute",
                pointerEvents: "none",
                content: "' '",
                borderRadius: "1103px",
                opacity: 0.5,
                background:
                  "var(--primary-p-1, linear-gradient(135deg, #E2491A 0%, #E21B1B 17.08%, #E2491A 42.71%, #E2AA1B 100%))",
                filter: "blur(182px)",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "1000px",
                height: "230px",
              },
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                  alignItems: "center",
                  rowGap: {
                    xs: "18px",
                    md: 0,
                  },
                  marginBottom: "40px",
                }}
              >
                <Typography>
                  {"Don't forget to follow us on social media!"}
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1,
                    justifyContent: "flex-end",
                    display: "flex",
                  }}
                >
                  <Link
                    href="https://twitter.com/PhoenixDefiHub"
                    target="_blank"
                    sx={socialIconStyle}
                  >
                    <Box component="img" src="/X.svg" />
                  </Link>
                  <Link
                    href="https://discord.gg/yWqJwJ4yza"
                    target="_blank"
                    sx={socialIconStyle}
                  >
                    <Box component="img" src="/Discord.svg" />
                  </Link>
                  <Link
                    href="https://github.com/Phoenix-Protocol-Group"
                    target="_blank"
                    sx={socialIconStyle}
                  >
                    <Box component="img" src="/Github.svg" />
                  </Link>
                </Box>
              </Box>
              <Box
                sx={{
                  height: "1px",
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.15)",
                  marginBottom: "40px",
                }}
              ></Box>
              <Typography
                sx={{
                  marginBottom: "80px",
                  textAlign: "center",
                  fontFamily: "Ubuntu",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "140%",
                  opacity: 0.6000000238418579,
                }}
              >
                © Phoenix {new Date().getFullYear()}
              </Typography>
            </Container>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Countdown;
