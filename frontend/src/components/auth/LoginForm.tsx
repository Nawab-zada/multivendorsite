"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import FormInput from "@/components/common/FormInput";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/features/authSlice";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error: serverError } = useAppSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      const role = result.payload.user?.role;
      const destination =
        role === "admin"
          ? "/admin"
          : role === "vendor"
            ? "/vendor/dashboard"
            : "/products";

      router.push(destination);
    }
  };

  return (
    <Card className="w-full max-w-md rounded-2xl border shadow-xl">
      <CardContent className="space-y-8 p-8">

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Login to continue shopping
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          {serverError && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
              {serverError}
            </div>
          )}

          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="example@email.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••••"
            {...register("password")}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="cursor-pointer">
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-base"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

        </form>

          <div className="text-center text-sm">
          Don&apos;t have an account?
          <Link
            href="/register"
            className="ml-2 font-semibold text-primary hover:underline"
          >
            Register
          </Link>
        </div>

      </CardContent>
    </Card>
  );
}
