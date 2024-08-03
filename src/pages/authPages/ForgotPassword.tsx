import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useForgotPasswordMutation } from "../../graphql/generated";
import { useSnackbar } from "notistack";

// Form schema
const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordForm = z.infer<typeof schema>;

// Default theme

export default function ForgotPassword() {
  const [forgotPasswordMutation, { loading, error }] =
    useForgotPasswordMutation();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  // Submitting the form
  const submitForgotPasswordForm: SubmitHandler<ForgotPasswordForm> = async (
    formData
  ) => {
    try {
      const response = await forgotPasswordMutation({ variables: formData });
      // Handle success (e.g., show a success message or redirect)
      if (response.data?.forgotPassword) {
        enqueueSnackbar("Password reset instructions sent to your email.", {
          variant: "success",
        });
      } else {
        throw new Error();
      }
    } catch (e) {
      console.error("Error sending password reset instructions", e);
      enqueueSnackbar("Error sending password reset instructions", {
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
          Forgot Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitForgotPasswordForm)}
          noValidate
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
              />
            </Grid>
          </Grid>
          {error && <Typography color="error">{error.message}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting || loading}
          >
            Send Reset Instructions
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/auth/login" variant="body2">
                Remember your password? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
