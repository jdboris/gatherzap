"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import signupSchema, {
  SignupSchema,
  PartialSignupSchema,
} from "@gatherzap/schemas/signup";
import { format, parse } from "date-fns";
import { isValid as isValidDate } from "date-fns/fp";
import {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ZodIssue } from "zod";

export default function SignUpPage() {
  const [signupData, setSignupData] = useState<PartialSignupSchema>({});
  const [errors, setErrors] = useState<ZodIssue[]>([]);

  useEffect(() => {
    // Save for the onboarding stage that comes later
    localStorage.setItem("signup-data", JSON.stringify(signupData));
  }, [signupData]);

  function parseValue(value: string, type: string) {
    return type === "number"
      ? Number(value)
      : type === "date"
      ? parse(value, "yyyy-MM-dd", new Date())
      : value;
  }

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return;

    const { type, name, value } = e.target;

    setSignupData((old) => ({
      ...old,
      [name]: parseValue(value, type),
    }));
  }, []);

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      handleChange(e);

      const { error } = signupSchema.partial().safeParse({
        ...signupData,
        [e.target.name]: parseValue(e.target.value, e.target.type),
      });

      setErrors(error?.issues || []);
    },
    [signupData]
  );

  return (
    <>
      <SignUp.Root>
        <SignUp.Step name="start">
          <h1>Create an account</h1>

          <Clerk.Field name="fullName">
            <Clerk.Label>Full Name</Clerk.Label>
            <Clerk.Input
              value={signupData?.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Clerk.FieldError></Clerk.FieldError>
            <Errors from={errors} property="fullName" />
          </Clerk.Field>

          <Clerk.Field name="phoneNumber">
            <Clerk.Label>Phone Number</Clerk.Label>
            <Clerk.Input
              value={signupData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Clerk.FieldError />
            <Errors from={errors} property="phoneNumber" />
          </Clerk.Field>

          <Clerk.Field name="birthDate">
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
            />
            <Clerk.FieldError />
            <Errors from={errors} property="birthDate" />
          </Clerk.Field>

          <Clerk.Field name="password">
            <Clerk.Label>Password</Clerk.Label>
            <Clerk.Input onChange={handleChange} onBlur={handleBlur} />
            <Clerk.FieldError />
            <Errors from={errors} property="password" />
          </Clerk.Field>

          <SignUp.Action submit>Sign up</SignUp.Action>
        </SignUp.Step>

        <SignUp.Step name="verifications">
          <SignUp.Strategy name="phone_code">
            <h1>Check your phone for an SMS</h1>

            <Clerk.Field name="code">
              <Clerk.Label>Phone Code</Clerk.Label>
              <Clerk.Input />
              <Clerk.FieldError />
            </Clerk.Field>
            <SignUp.Action
              resend
              fallback={({ resendableAfter }) => (
                <p>Resend code in {resendableAfter} second(s)</p>
              )}
            >
              Resend code
            </SignUp.Action>
            <SignUp.Action submit>Verify</SignUp.Action>
          </SignUp.Strategy>
        </SignUp.Step>
      </SignUp.Root>
      <div id="clerk-captcha"></div>
    </>
  );
}

function Errors({
  property,
  from,
}: {
  property: keyof SignupSchema;
  from: ZodIssue[];
}) {
  const getErrorMessagesByKey = useCallback(
    (key: string) => {
      return from.filter((x) => x.path[0] == key).map((x) => x.message);
    },
    [from]
  );

  return (
    <>
      {getErrorMessagesByKey(property).map((x, i) => (
        <div key={`${property}-error-${i}`}>{x}</div>
      ))}
    </>
  );
}
