"use client";

import Carousel from "@/components/carousel";
import LoadingSpinner from "@/components/loading-spinner";
import { buttonClassName } from "@/components/ui/button";
import { inputClassName } from "@/components/ui/input";
import useFormData from "@/hooks/use-form-data";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import accountSchema from "@gatherzap/schemas/account-schema";
import signupSchema from "@gatherzap/schemas/signup-schema";
import { format, isValid as isValidDate } from "date-fns";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";

export default function SignUpPage() {
  const {
    data: signupData,
    getErrorMessages,
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
    <div className="relative m-auto flex flex-wrap content-center justify-center gap-x-10 gap-y-4">
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
          className="flex max-w-96 flex-col self-center"
        >
          <Clerk.GlobalError />
          <Clerk.Field name="fullName" className="mb-6">
            <Clerk.Label>Full Name</Clerk.Label>
            <Clerk.Input
              autoFocus
              value={signupData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Smith"
              className={inputClassName({ type: "text" })}
            />

            <Errors messages={getErrorMessages("fullName")} />
          </Clerk.Field>

          <Clerk.Field name="phoneNumber" className="mb-6">
            <Clerk.Label>Phone Number</Clerk.Label>
            <Clerk.Input
              value={signupData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="123-456-7890"
              className={inputClassName({ type: "text" })}
            />
            <Errors messages={getErrorMessages("phoneNumber")} />
          </Clerk.Field>

          <Clerk.Field name="birthDate" className="mb-6">
            <Clerk.Label>Date of Birth</Clerk.Label>
            <Clerk.Input
              value={
                signupData.birthDate && isValidDate(signupData.birthDate)
                  ? format(signupData.birthDate, "yyyy-MM-dd")
                  : ""
              }
              type="date"
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClassName({ type: "text" })}
            />
            <Errors messages={getErrorMessages("birthDate")} />
          </Clerk.Field>

          <Clerk.Field name="password" className="mb-6">
            <Clerk.Label>Password</Clerk.Label>
            <Clerk.Input
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="•••••••••"
              type="password"
              className={inputClassName({ type: "text" })}
            />
            <Errors messages={getErrorMessages("password")} />
          </Clerk.Field>

          <Clerk.Loading>
            {(isLoading) => (
              <SignUp.Action
                submit
                disabled={isLoading}
                className={"group ml-auto " + buttonClassName({})}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Loading...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRightIcon
                      className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                      size={16}
                      aria-hidden="true"
                    />
                  </>
                )}
              </SignUp.Action>
            )}
          </Clerk.Loading>
        </SignUp.Step>

        <SignUp.Step
          name="verifications"
          className="flex max-w-96 flex-col items-center self-center"
        >
          <SignUp.Strategy name="phone_code">
            <div className="text-2xl">Phone Number Verification</div>
            <small>
              Enter the verification code that was sent to your phone.
            </small>

            <Clerk.Field name="code" className="mb-6 w-full">
              <Clerk.Input
                autoFocus
                className={"text-center " + inputClassName({ type: "text" })}
              />
              <Errors messages={[]}>
                <Clerk.GlobalError />
              </Errors>
            </Clerk.Field>

            <Clerk.Loading>
              {(isLoading) => (
                <SignUp.Action
                  submit
                  disabled={isLoading}
                  className={"mb-2 w-full " + buttonClassName({ size: "lg" })}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Loading...
                    </>
                  ) : (
                    "Verify"
                  )}
                </SignUp.Action>
              )}
            </Clerk.Loading>
            <SignUp.Action
              resend
              fallback={({ resendableAfter }) => (
                <small className={"mb-2"}>
                  Resend code in {resendableAfter} second(s)
                </small>
              )}
              className={
                "mb-2 w-full " +
                buttonClassName({ size: "lg", variant: "ghost" })
              }
            >
              Resend code
            </SignUp.Action>
            <SignUp.Action
              navigate="previous"
              className={
                "self-start " + buttonClassName({ variant: "secondary" })
              }
            >
              <ArrowLeftIcon
                className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
                size={16}
                aria-hidden="true"
              />{" "}
              Back
            </SignUp.Action>
          </SignUp.Strategy>
        </SignUp.Step>
      </SignUp.Root>
      <div id="clerk-captcha" className="absolute"></div>
    </div>
  );
}

function Errors({
  messages,
  children,
}: {
  messages: string[];
  children: React.ReactNode;
}) {
  return (
    <div
      className="text-destructive absolute mt-1 text-xs"
      role="alert"
      aria-live="polite"
    >
      {children}
      {messages.map((x, i) => (
        <div key={`error-${i}`}>{x}</div>
      ))}
      <Clerk.FieldError></Clerk.FieldError>
    </div>
  );
}
