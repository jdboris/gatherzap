"use client";

import AvatarEditor from "@/components/avatar-editor";
import { useAccount } from "@/contexts/account-context";
import { useAuth } from "@/contexts/auth-context";
import accountSchema, {
  AccountSchema,
} from "@gatherzap/schemas/account-schema";

import { format, isValid as isValidDate, parse } from "date-fns";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ZodIssue } from "zod";

export default function AccountPage() {
  const [accountData, setAccountData] = useState<Partial<AccountSchema>>();
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const { updateAccount: completeAccountSetup } = useAccount();
  const { user, refetch: refetchUser } = useAuth();
  const schema = accountSchema;
  const router = useRouter();

  useEffect(() => {
    // NOTE: useEffect waits until first client-side render
    setAccountData(
      schema
        .partial()
        .catch(() => ({}))
        .parse(JSON.parse(window.localStorage.getItem("account-data") || "{}"))
    );
  }, [schema]);

  function parseFieldValue(value: string, type: string) {
    return type === "number"
      ? Number(value)
      : type === "date"
      ? parse(value, "yyyy-MM-dd", new Date())
      : value;
  }

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return;

    const { type, name, value } = e.target;

    setAccountData((old) => ({
      ...old,
      [name]: parseFieldValue(value, type),
    }));
  }, []);

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      handleChange(e);

      validateData({
        ...accountData,
        [e.target.name]: parseFieldValue(e.target.value, e.target.type),
      });
    },
    [accountData, schema]
  );

  const validateData = (data: Partial<AccountSchema>) => {
    const { error } = schema.partial().safeParse(data);
    setErrors(error?.issues || []);

    return !Boolean(error);
  };

  return accountData ? (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        if (!validateData(accountData)) {
          return;
        }

        await completeAccountSetup(schema.parse(accountData), {
          onSuccess: () => {
            refetchUser();
            router.push("/");
          },
        });
      }}
    >
      <h1>{user ? <>Account</> : <>Complete Account Setup</>}</h1>

      <label>Avatar</label>

      <AvatarEditor
        initialAvatar={accountData.avatar}
        onChange={(value) => {
          setAccountData((oldAccountData) => ({
            ...oldAccountData,
            avatar: value,
          }));
        }}
      />

      <label>
        Full Name
        <input
          name="fullName"
          type="text"
          value={accountData?.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Errors allErrors={errors} fieldName="fullName" />
      </label>

      <label>
        Date of Birth
        <input
          name="birthDate"
          type="date"
          value={
            accountData.birthDate && isValidDate(accountData.birthDate)
              ? format(accountData.birthDate, "yyyy-MM-dd")
              : ""
          }
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Errors allErrors={errors} fieldName="birthDate" />
      </label>

      <label>
        Phone Number
        <input
          // disabled
          name="phoneNumber"
          type="text"
          value={accountData.phoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Errors allErrors={errors} fieldName="phoneNumber" />
      </label>

      <button>Save</button>
    </form>
  ) : (
    <></>
  );
}

function Errors({
  fieldName,
  allErrors,
}: {
  fieldName: keyof AccountSchema;
  allErrors: ZodIssue[];
}) {
  /** Get error messages by key/name */
  const errorMessages = useMemo(
    () => allErrors.filter((x) => x.path[0] == fieldName).map((x) => x.message),
    [allErrors, fieldName]
  );

  return (
    <>
      {errorMessages.map((x, i) => (
        <div key={`${fieldName}-error-${i}`}>{x}</div>
      ))}
    </>
  );
}
