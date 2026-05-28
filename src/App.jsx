import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:3001/profile";

async function fetchProfile() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
}

async function updateProfile(data) {
  if (data.email === "conflict@example.com") {
    throw {
      field: "email",
      message: "This email is already used by another account.",
    };
  }

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update profile");
  return response.json();
}

function App() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      notifications: false,
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      reset(updatedData);
    },
    onError: (error) => {
      if (error.field === "email") {
        setError("email", { message: error.message });
      }
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="loading">Loading profile...</div>;
  if (isError) return <div>Error loading profile.</div>;

  return (
    <main className="container">
      <h1>User Profile Form</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label>
          Username
          <input
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <p className="error">{errors.username.message}</p>}
        </label>

        <label>
          Email
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </label>

        <label>
          Bio
          <textarea {...register("bio")} rows="4" />
        </label>

        <label className="checkbox">
          <input type="checkbox" {...register("notifications")} />
          Receive notifications
        </label>

        <button type="submit" disabled={!isDirty || mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Profile"}
        </button>

        {mutation.isSuccess && <p className="success">Profile saved!</p>}
      </form>
    </main>
  );
}

export default App;