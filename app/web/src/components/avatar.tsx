import { useMemo } from "react";
import { createAvatar as createDicebearAvatar } from "@dicebear/core";
import { AvatarSchema } from "@gatherzap/schemas/avatar-schema";
import { bigEars } from "@dicebear/collection";
import { schema } from "@dicebear/core";
import { JSONSchema7 } from "json-schema";

const optionsSchema = {
  ...schema.properties,
  ...bigEars.schema.properties,
};

export default function Avatar({
  options,
  ...props
}: {
  options: AvatarSchema;
}) {
  const dicebearAvatar = useMemo(() => {
    return createDicebearAvatar(bigEars, {
      ...avatarToDicebearOptions(options),
    });
  }, [options]);

  return <img {...props} src={dicebearAvatar.toDataUri()} />;
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
      }),
    ),
    // NOTE: Required to make cheeks work for some reason
    cheekProbability: 100,
  };
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
