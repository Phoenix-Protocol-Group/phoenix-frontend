import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button, Box, Stack } from "@mui/material";
import { Toast, ToastProps } from "./Toast";
import { ToastContainer } from "./ToastContainer";
import { ToastProvider, useToast } from "./useToast";

export default {
  title: "Common/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
} as Meta<typeof Toast>;

// Individual Toast Story
const SingleToastTemplate: StoryFn<ToastProps> = (args) => (
  <Box sx={{ width: "320px", padding: "20px", backgroundColor: "#171717" }}>
    <Toast {...args} />
  </Box>
);

export const Success = SingleToastTemplate.bind({});
Success.args = {
  id: "1",
  type: "success",
  title: "Success",
  message: "Operation completed successfully!",
  onClose: () => console.log("Toast closed"),
};

export const Error = SingleToastTemplate.bind({});
Error.args = {
  id: "2",
  type: "error",
  title: "Error",
  message: "Something went wrong. Please try again.",
  onClose: () => console.log("Toast closed"),
  // Use a plain object instead of Error constructor for storybook compatibility
  error: {
    message: "Detailed error message",
    stack:
      "Error: Detailed error message\n  at Function.execute (http://localhost:6006/main.iframe.bundle.js:1234:15)\n  at onClick (http://localhost:6006/main.iframe.bundle.js:5678:10)",
  },
};

export const Warning = SingleToastTemplate.bind({});
Warning.args = {
  id: "3",
  type: "warning",
  title: "Warning",
  message: "This action may have side effects.",
  onClose: () => console.log("Toast closed"),
};

export const Info = SingleToastTemplate.bind({});
Info.args = {
  id: "4",
  type: "info",
  title: "Information",
  message: "Your transaction is being processed.",
  onClose: () => console.log("Toast closed"),
};

export const Loading = SingleToastTemplate.bind({});
Loading.args = {
  id: "5",
  type: "loading",
  title: "Processing",
  message: "Please wait while we process your request...",
  onClose: () => console.log("Toast closed"),
};

export const SuccessWithTransaction = SingleToastTemplate.bind({});
SuccessWithTransaction.args = {
  id: "6",
  type: "success",
  title: "Transaction Complete",
  message: "Your transaction has been processed successfully.",
  onClose: () => console.log("Toast closed"),
  transactionId:
    "3389e9febc1f45efdae5866971360fedb2c53880453d83e8941b7dec5ac8981e",
};

// Toast Container with multiple toasts
const ToastContainerExample = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([
    {
      id: "1",
      type: "success",
      title: "Transaction Complete",
      message: "Your transaction has been processed successfully.",
      onClose: (id) =>
        setToasts((prev) => prev.filter((toast) => toast.id !== id)),
    },
    {
      id: "2",
      type: "error",
      title: "Connection Error",
      message: "Failed to connect to the server. Please check your network.",
      onClose: (id) =>
        setToasts((prev) => prev.filter((toast) => toast.id !== id)),
    },
  ]);

  const onClose = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "400px",
        position: "relative",
        backgroundColor: "#171717",
      }}
    >
      <ToastContainer toasts={toasts} onClose={onClose} />
    </Box>
  );
};

export const ToastContainerStory = () => <ToastContainerExample />;
ToastContainerStory.storyName = "Toast Container";

// Toast Provider with interactive demo
const ToastDemo = () => {
  const { success, error, warning, info, loading, removeAll, addAsyncToast } =
    useToast();

  const simulateAsyncOperation = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId:
            "3389e9febc1f45efdae5866971360fedb2c53880453d83e8941b7dec5ac8981e",
        });
      }, 3000);
    });
  };

  const simulateAsyncError = () => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        // Create an error-like object instead of using the Error constructor
        reject({
          message: "Failed to complete the operation",
          stack:
            "Error: Failed to complete the operation\n    at simulateAsyncError\n    at onClick\n    at handleClick",
        });
      }, 3000);
    });
  };

  return (
    <Box sx={{ width: "100%", padding: "24px", backgroundColor: "#171717" }}>
      <Stack spacing={2} direction="column">
        <Button
          variant="contained"
          color="success"
          onClick={() =>
            success("Operation completed successfully!", { title: "Success" })
          }
        >
          Show Success Toast
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() =>
            error("Something went wrong. Please try again.", { title: "Error" })
          }
        >
          Show Error Toast
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() =>
            warning("This action may have side effects.", { title: "Warning" })
          }
        >
          Show Warning Toast
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() =>
            info("Your transaction is being processed.", { title: "Info" })
          }
        >
          Show Info Toast
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#9c27b0",
            "&:hover": { backgroundColor: "#7b1fa2" },
          }}
          onClick={() =>
            loading("Please wait while we process your request...", {
              title: "Processing",
            })
          }
        >
          Show Loading Toast
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            addAsyncToast(
              simulateAsyncOperation(),
              "Processing your request...",
              { title: "Async Operation" }
            )
          }
        >
          Start Async Success Operation
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            addAsyncToast(simulateAsyncError(), "Processing your request...", {
              title: "Async Operation",
            }).catch(() => {})
          }
        >
          Start Async Failed Operation
        </Button>
        <Button variant="outlined" onClick={() => removeAll()}>
          Clear All Toasts
        </Button>
      </Stack>
    </Box>
  );
};

export const ToastSystem = () => (
  <ToastProvider>
    <ToastDemo />
  </ToastProvider>
);
ToastSystem.storyName = "Toast System";
