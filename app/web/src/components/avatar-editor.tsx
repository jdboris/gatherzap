"use client";

import { bigEars } from "@dicebear/collection";
import { createAvatar as createDicebearAvatar, schema } from "@dicebear/core";
import avatarSchema, { AvatarSchema } from "@gatherzap/schemas/avatar-schema";
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
} from "json-schema";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Avatar from "./avatar";

const optionsSchema = {
  ...schema.properties,
  ...bigEars.schema.properties,
};

export default function AvatarEditor({
  initialAvatar,
  onChange,
}: {
  initialAvatar: AvatarSchema | undefined;
  onChange: (avatar: AvatarSchema) => void;
}) {
  const [avatar, setAvatar] = useState<AvatarSchema>(
    avatarSchema.parse(
      initialAvatar ||
        createDicebearAvatar(bigEars, {
          // NOTE: Required to make cheeks work for some reason
          cheekProbability: 100,
        }).toJson().extra,
    ),
  );

  useEffect(() => {
    if (!avatar || !onChange) {
      return;
    }

    onChange(avatarSchema.parse(avatar));
  }, [avatar]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6">
      {avatar && (
        <>
          <div className="flex w-full flex-col items-center text-center">
            <div className="w-full text-2xl">Avatar</div>
            <Avatar options={avatar} />
          </div>
          {Object.keys(avatar).map((key: string) => {
            return (
              <InputField
                key={`avatar-editor-option-${key}`}
                name={key}
                type={getFieldTypeFromSchema(optionsSchema[key])}
                isNullable={avatarSchema.shape[
                  key as keyof AvatarSchema
                ].isNullable()}
                value={avatar[key as keyof AvatarSchema] || null}
                choices={parseEnumValues(optionsSchema[key])}
                onChange={(value) => {
                  setAvatar((oldOptions) => {
                    return {
                      ...(oldOptions ||
                        initialAvatar ||
                        avatarSchema.parse({})),
                      [key]: value,
                    };
                  });
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

function InputField<T extends string | number | boolean>({
  name,
  type,
  value,
  choices,
  onChange,
  isNullable,
}: {
  name: string;
  type: "text" | "enum" | "color" | "number" | "boolean";
  value: T | null;
  choices: JSONSchema7Type[] | undefined;
  onChange: (value: T | null) => void;
  isNullable: boolean;
}) {
  const [lastValueBeforeNull, setLastValueBeforeNull] = useState(value);

  useEffect(() => {
    if (value !== null) {
      setLastValueBeforeNull(value);
    }
  }, [value]);

  return (
    <div className="w-full">
      <label className="capitalize">
        {name.replace(/([A-Z])/g, " $1").trim()}

        {type == "enum" ? (
          <div className="mt-1 flex w-full rounded-lg border border-gray-300 bg-gray-50 text-center text-gray-900">
            {choices && (
              <span
                className="cursor-pointer select-none border-r border-gray-300 p-2"
                onClick={() => {
                  // Wrap around if necessary
                  const previousChoice = choices.at(
                    choices.indexOf(value as string) - 1,
                  ) as T;
                  onChange(previousChoice);
                }}
              >
                <FaChevronLeft className="inline" />
              </span>
            )}

            <select
              name={name}
              value={
                value === null ? String(lastValueBeforeNull) : String(value)
              }
              onChange={(e) => onChange(e.target.value as T)}
              className="w-full cursor-pointer bg-transparent p-2.5 text-center capitalize"
            >
              {choices?.sort().map((x: JSONSchema7Type, i: number) => (
                <option
                  key={`avatar-editor-option-${name}-choice-${i}`}
                  value={String(x)}
                >
                  #{i + 1}
                </option>
              ))}
            </select>

            {choices && (
              <span
                className="cursor-pointer select-none border-l border-gray-300 p-2"
                onClick={() => {
                  const nextChoice = choices[
                    // Wrap around if necessary
                    (choices.indexOf(value as string) + 1) % choices.length
                  ] as T;
                  onChange(nextChoice);
                }}
              >
                <FaChevronRight className="inline" />
              </span>
            )}
          </div>
        ) : type == "boolean" ? (
          <input
            name={name}
            checked={Boolean(value)}
            type="checkbox"
            onChange={(e) => onChange(e.target.checked as T)}
          />
        ) : type == "color" ? (
          <input
            name={name}
            value={String(value)}
            type="color"
            onChange={(e) => onChange(e.target.value as T)}
            className="mt-1 flex min-h-[1.8lh] w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2 text-center text-gray-900"
          />
        ) : (
          <input
            name={name}
            value={String(value)}
            type="text"
            onChange={(e) => onChange(e.target.value as T)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
          />
        )}
      </label>

      {isNullable && (
        <label className="mt-1 flex items-center gap-2">
          <input
            type="checkbox"
            checked={value !== null}
            onChange={(e) =>
              onChange(e.target.checked ? lastValueBeforeNull : null)
            }
            className="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <small>
            <em>Enabled</em>
          </small>
        </label>
      )}
    </div>
  );
}

function getFieldTypeFromSchema(schema: JSONSchema7Definition) {
  // NOTE: JSONSchema7Definition can technically be a boolean,
  //       but dicebar doesn't use that.
  if (typeof schema == "boolean") {
    return "text";
  }

  if (isNumber(schema)) {
    return "number";
  }

  if (isBoolean(schema)) {
    return "boolean";
  }

  if (isEnum(schema)) {
    return "enum";
  }

  if (isColor(schema)) {
    return "color";
  }

  if (isArray(schema)) {
    // NOTE: In JSONSchema7, `items` could technically be a boolean or an array,
    //       but dicebear doesn't use those.

    // NOTE: Just "flatten" the array and use the type of the items as the type of this schema,
    //       because dicebar needlessly wraps the value in an array.
    return getFieldTypeFromSchema(schema.items as JSONSchema7);
  }

  return "text";
}

function parseEnumValues(schema: JSONSchema7Definition) {
  if (typeof schema == "boolean") {
    return;
  }

  if (schema.enum) {
    return schema.enum;
  }

  if (schema.items && !Array.isArray(schema?.items)) {
    return parseEnumValues(schema.items);
  }
}

function isNumber(schema: JSONSchema7) {
  // NOTE: Flatten Dicebear's pointless array
  if (isArray(schema)) {
    return isNumber(schema.items as JSONSchema7);
  }

  return schema.type == "integer" || schema.type == "number";
}

function isEnum(schema: JSONSchema7) {
  // NOTE: Flatten Dicebear's pointless array
  if (isArray(schema)) {
    return isEnum(schema.items as JSONSchema7);
  }

  return schema.enum;
}

function isBoolean(schema: JSONSchema7) {
  // NOTE: Flatten Dicebear's pointless array
  if (isArray(schema)) {
    return isBoolean(schema.items as JSONSchema7);
  }

  return schema.type == "boolean";
}

function isColor(schema: JSONSchema7) {
  // NOTE: Flatten Dicebear's pointless array
  if (isArray(schema)) {
    return isColor(schema.items as JSONSchema7);
  }

  return schema?.pattern == "^(transparent|[a-fA-F0-9]{6})$";
}

function isArray(schema: JSONSchema7) {
  return schema.type == "array";
}
