"use client";

import { createAvatar as createDicebearAvatar } from "@dicebear/core";
import { bigEars } from "@dicebear/collection";
import { useEffect, useMemo, useState } from "react";
import { schema } from "@dicebear/core";
import avatarSchema, { AvatarSchema } from "@gatherzap/schemas/avatar-schema";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
} from "json-schema";

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
        }).toJson().extra
    )
  );

  const dicebearAvatar = useMemo(() => {
    if (!avatar) {
      return;
    }

    return createDicebearAvatar(bigEars, {
      ...avatarToDicebearOptions(avatar),
    });
  }, [avatar]);

  useEffect(() => {
    if (!avatar || !onChange) {
      return;
    }

    onChange(avatarSchema.parse(avatar));
  }, [avatar]);

  return (
    <div>
      {avatar && dicebearAvatar && (
        <>
          <img className="max-w-36" src={dicebearAvatar.toDataUri()} />
          {Object.keys(avatar).map((key: string) => {
            return (
              <div key={`avatar-editor-option-${key}`}>
                <InputField
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
              </div>
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
    <>
      {isNullable && (
        <input
          type="checkbox"
          checked={value !== null}
          onChange={(e) =>
            onChange(e.target.checked ? lastValueBeforeNull : null)
          }
        />
      )}
      <label className="capitalize">
        {name}
        {type == "enum" ? (
          <>
            {choices && (
              <span
                className="cursor-pointer select-none p-2"
                onClick={() => {
                  // Wrap around if necessary
                  const previousChoice = choices.at(
                    choices.indexOf(value as string) - 1
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
            >
              {choices?.sort().map((x: JSONSchema7Type, i: number) => (
                <option
                  key={`avatar-editor-option-${name}-choice-${i}`}
                  value={String(x)}
                >
                  {String(x)}
                </option>
              ))}
            </select>

            {choices && (
              <span
                className="cursor-pointer select-none p-2"
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
          </>
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
          />
        ) : (
          <input
            name={name}
            value={String(value)}
            type="text"
            onChange={(e) => onChange(e.target.value as T)}
          />
        )}
      </label>
    </>
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

/**
 * Convert from `AvatarSchema` to Dicebear's expected schema
 * by wrapping values in arrays, removing the `"#"` on colors,
 * and adding the `cheekProbability: 100`.
 */
function avatarToDicebearOptions(avatar: AvatarSchema) {
  return {
    ...Object.fromEntries(
      Object.entries(avatar).map(([key, value]) => {
        const optionSchema = optionsSchema[key];

        // NOTE: `JSONSchema7Definition` can be a boolean. Just leave this one alone.
        if (typeof optionSchema == "boolean") {
          return [key, value];
        }

        if (value === null) {
          return [key, []];
        }

        const normalizedValue = isColor(optionSchema)
          ? value.replace("#", "")
          : value;

        // NOTE: Dicebar requires values to be wrapped in an array.
        return [
          key,
          isArray(optionSchema) ? [normalizedValue] : normalizedValue,
        ];
      })
    ),
    // NOTE: Required to make cheeks work for some reason
    cheekProbability: 100,
  };
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
