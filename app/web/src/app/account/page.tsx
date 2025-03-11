"use client";

import AvatarEditor from "@/components/avatar-editor";
import { useAccount } from "@/contexts/account-context";
import { useAuth } from "@/contexts/auth-context";
import useFormData from "@/hooks/use-form-data";
import accountSchema, {
  AccountSchema,
} from "@gatherzap/schemas/account-schema";

import { format, isValid as isValidDate } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { updateAccount: completeAccountSetup } = useAccount();
  const { user, refetch: refetchUser } = useAuth();
  const router = useRouter();

  const {
    data: accountData,
    setValue,
    getErrorMessages,
    isInvalid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormData({
    initialData: {},
    schema: accountSchema,
    onSubmit: async () => {
      // TODO: Ensure using accountSchema does NOT work (wrong schemam, must use updateAccountSchema instead)
      await completeAccountSetup(accountSchema.parse(accountData), {
        onSuccess: () => {
          refetchUser();
          router.push("/");
        },
      });
    },
  });

  // NOTE: useEffect waits until first client-side render, granting access to local storage,
  useEffect(() => {
    const { success, data: localStorageData } = accountSchema
      .partial()
      .safeParse(
        JSON.parse(window.localStorage.getItem("account-data") || "{}"),
      );

    if (success) {
      // NOTE: Declaring key separately before the loop makes the TypeScript compiler happy.
      let key: keyof AccountSchema;

      for (key in localStorageData) {
        setValue(key, localStorageData[key]);
      }
    }
  }, []);

  return accountData ? (
    <form
      onSubmit={handleSubmit}
      className="container relative m-auto flex flex-col items-center justify-center gap-x-10 gap-y-4"
    >
      <header className="w-full text-center text-4xl">
        {user ? <>Account</> : <>Complete Account Setup</>}
      </header>

      <div className="relative m-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        <AvatarEditor
          initialAvatar={accountData.avatar}
          onChange={(value) => {
            setValue("avatar", value);
          }}
        />

        <div className="flex flex-col">
          <label className="pb-4">
            Full Name
            <input
              name="fullName"
              type="text"
              value={accountData?.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${isInvalid("fullName") ? "border-red bg-rose-50" : ""} mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900`}
            />
            <Errors messages={getErrorMessages("fullName")} />
          </label>

          <label className="pb-4">
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
              className={`${isInvalid("birthDate") ? "border-red bg-rose-50" : ""} mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900`}
            />
            <Errors messages={getErrorMessages("birthDate")} />
          </label>

          <label className="pb-4">
            Phone Number
            <input
              name="phoneNumber"
              type="text"
              value={accountData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${isInvalid("phoneNumber") ? "border-red bg-rose-50" : ""} mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900`}
            />
            <Errors messages={getErrorMessages("phoneNumber")} />
          </label>
        </div>
      </div>

      <button className="bg-primary-600 focus:ring-primary-300 mb-2 me-2 w-full max-w-64 rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4">
        Save
      </button>
    </form>
  ) : (
    <></>
  );
}

function Errors({ messages }: { messages: string[] }) {
  return (
    <div className="text-red absolute text-xs">
      {messages.map((x, i) => (
        <div key={`error-${i}`}>{x}</div>
      ))}
    </div>
  );
}
