"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validations/register";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormInput from "@/components/common/FormInput";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register as registerThunk } from "@/store/features/authSlice";

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error: serverError } = useAppSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "customer",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(registerThunk(data));
    if (registerThunk.fulfilled.match(result)) {
      router.push("/login");
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-xl border-0 rounded-2xl">

      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">
          Create Account
        </CardTitle>
        <CardDescription>
          Create your marketplace account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {serverError && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
              {serverError}
            </div>
          )}

          <FormInput
            id="name"
            label="Full Name"
            placeholder="John Doe"
            register={register}
            error={errors.name}
          />

          <FormInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            register={register}
            error={errors.email}
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="********"
            register={register}
            error={errors.password}
          />



          <div className="space-y-3">
            <label className="text-sm font-medium">
              Account Type
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="customer"
                  {...register("role")}
                />
                Customer
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="vendor"
                  {...register("role")}
                />
                Vendor
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-base"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?
            <Link
              href="/login"
              className="ml-2 font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </p>

        </form>
      </CardContent>

    </Card>
  );
}
