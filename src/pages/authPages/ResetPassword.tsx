// ResetPassword.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { passwordValidation } from "../../utils/formValidation";

import { useResetPasswordMutation } from "../../graphql/generated";

const schema = z.object({
  newPassword: z.string().regex(passwordValidation, {
    message:
      "Password must contain at least 8 character(s), one uppercase letter, one lowercase letter, one number and one special character",
  }),
});

type ResetPasswordForm = z.infer<typeof schema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { token } = params;
  const [resetPasswordMutation, { loading, error }] =
    useResetPasswordMutation();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      newPassword: "",
    },
    resolver: zodResolver(schema),
  });

  if (!token) {
    console.error("No token provided");
    return <Typography color="error">No token provided</Typography>;
  }

  const submitResetPasswordForm: SubmitHandler<ResetPasswordForm> = async (
    formData
  ) => {
    try {
      const response = await resetPasswordMutation({
        variables: { token, newPassword: formData.newPassword },
      });
      if (response.data) {
        enqueueSnackbar("Password reset successful", {
          variant: "success",
        });
        navigate("/auth/login");
      }
    } catch (e) {
      console.error("Password reset error", e);
      enqueueSnackbar("Error resetting password", {
        variant: "error",
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitResetPasswordForm)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            id="newPassword"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            {...register("newPassword")}
          />
          {error && <Typography color="error">{error.message}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting || loading}
          >
            Reset Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;
