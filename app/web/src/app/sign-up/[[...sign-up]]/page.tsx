"use client";

import Carousel from "@/components/carousel";
import useFormData from "@/hooks/use-form-data";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import accountSchema from "@gatherzap/schemas/account-schema";
import signupSchema from "@gatherzap/schemas/signup-schema";
import { format, isValid as isValidDate } from "date-fns";
import { useEffect } from "react";

export default function SignUpPage() {
  const {
    data: signupData,
    getErrorMessages,
    isInvalid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormData({
    initialData: {},
    schema: signupSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    if (Object.keys(signupData).length == 0) {
      return;
    }

    const { data: accountData } = accountSchema.partial().safeParse(signupData);

    if (!accountData) {
      return;
    }

    // Save for the onboarding stage that comes later
    window.localStorage.setItem("account-data", JSON.stringify(accountData));
  }, [signupData]);

  return (
    <div className="container relative m-auto flex flex-wrap content-center justify-center gap-x-10 gap-y-4">
      <div className="w-full text-center text-5xl">Welcome to Gatherzap</div>
      <div className="w-full text-center text-3xl">
        Create an account to get started
      </div>
      <div>
        <Carousel
          images={[
            "/img/game-day.svg",
            "/img/amusement-park.svg",
            "/img/having-fun.svg",
            "/img/nature-fun.svg",
          ]}
          slideDuration={7000}
        />
      </div>
      <SignUp.Root>
        <SignUp.Step
          name="start"
          // NOTE: Clerk Elements API doesn't allow handling submit with onSubmit normally.
          onSubmitCapture={(e) => {
            if (!handleSubmit(e)) {
              e.stopPropagation();
            }
          }}
          className="max-w-96 self-center"
        >
          <Clerk.GlobalError />
          <Clerk.Field name="fullName" className="pb-5">
            <Clerk.Label>Full Name</Clerk.Label>
            <Clerk.Input
              value={signupData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Smith"
              className={`${isInvalid("fullName") ? "border-red bg-rose-50" : ""} mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900`}
            />
            <Errors messages={getErrorMessages("fullName")} />
          </Clerk.Field>

          <Clerk.Field name="phoneNumber" className="pb-5">
            <Clerk.Label>Phone Number</Clerk.Label>
            <Clerk.Input
              value={signupData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="123-456-7890"
              className={`${isInvalid("phoneNumber") ? "border-red bg-rose-50" : ""} mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900`}
            />
            <Errors messages={getErrorMessages("phoneNumber")} />
          </Clerk.Field>

          <Clerk.Field name="birthDate" className="pb-5">
            <Clerk.Label>Date of Birth</Clerk.Label>
            <Clerk.Input
              type="date"
              value={
                signupData.birthDate && isValidDate(signupData.birthDate)
                  ? format(signupData.birthDate, "yyyy-MM-dd")
                  : ""
              }
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${isInvalid("birthDate") ? "border-red bg-rose-50" : ""} mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900`}
            />
            <Errors messages={getErrorMessages("birthDate")} />
          </Clerk.Field>

          <Clerk.Field name="password" className="pb-5">
            <Clerk.Label>Password</Clerk.Label>
            <Clerk.Input
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="•••••••••"
              type="password"
              className={`${isInvalid("password") ? "border-red bg-rose-50" : ""} mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900`}
            />
            <Errors messages={getErrorMessages("password")} />
          </Clerk.Field>

          <SignUp.Action
            submit
            className="bg-primary-600 focus:ring-primary-300 mb-2 me-2 w-full rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4"
          >
            Sign up
          </SignUp.Action>
        </SignUp.Step>

        <SignUp.Step
          name="verifications"
          className="max-w-96 self-center text-center"
        >
          <SignUp.Strategy name="phone_code">
            <div className="text-2xl">Phone Number Verification</div>
            <small>
              Enter the verification code that was sent to your phone.
            </small>
            <Clerk.GlobalError className="text-red" />

            <Clerk.Field name="code">
              <Clerk.Input className="invalid:border-red mb-2 me-2 mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-2xl text-gray-900 invalid:bg-rose-50" />
              <Clerk.FieldError />
            </Clerk.Field>

            <SignUp.Action
              submit
              className="bg-primary-600 focus:ring-primary-300 mb-2 me-2 w-full rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              Verify
            </SignUp.Action>

            <SignUp.Action
              resend
              fallback={({ resendableAfter }) => (
                <small>Resend code in {resendableAfter} second(s)</small>
              )}
              className="focus:ring-primary-300 mb-2 me-2 w-full rounded-lg bg-gray-400 px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              Resend code
            </SignUp.Action>
          </SignUp.Strategy>
        </SignUp.Step>
      </SignUp.Root>
      <div id="clerk-captcha" className="absolute"></div>
    </div>
  );
}

function Errors({ messages }: { messages: string[] }) {
  return (
    <div className="text-red absolute text-xs">
      {messages.map((x, i) => (
        <div key={`error-${i}`}>{x}</div>
      ))}
      <Clerk.FieldError></Clerk.FieldError>
    </div>
  );
}
