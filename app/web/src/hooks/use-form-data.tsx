import { parse as parseDate } from "date-fns";
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { z, ZodIssue, ZodObject, ZodRawShape } from "zod";

export default function useFormData<D extends object, S extends ZodRawShape>({
  initialData,
  schema,
  onSubmit,
}: {
  initialData: D;
  schema: ZodObject<S>;
  /** A callback to be called AFTER the form data state has been updated. */
  onSubmit: () => any;
}) {
  const [data, setData] =
    useState<Partial<z.infer<typeof schema>>>(initialData);
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [submitEvent, setSubmitEvent] =
    useState<FormEvent<HTMLFormElement> | null>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target) return;

      const { type, name, value } = e.target;

      setData((old) => ({
        ...old,
        [name]: parseValue(value, type),
      }));

      const { success } = schema.partial().safeParse({
        [e.target.name]: parseValue(e.target.value, e.target.type),
      });

      if (success) {
        setErrors((old) => old.filter((x) => String(x.path) != e.target.name));
      }
    },
    [schema],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      // NOTE: Prevents the blur event from canceling the submit event if they happen at the same time.
      setTimeout(() => {
        const { type, name, value } = e.target;

        setData((old) => ({
          ...old,
          [name]: parseValue(value, type),
        }));

        const { success, error } = schema.partial().safeParse({
          [e.target.name]: parseValue(e.target.value, e.target.type),
        });

        setErrors((old) => [
          ...old.filter((x) => String(x.path) != e.target.name),
          ...(!success ? error.issues : []),
        ]);
      }, 100);
    },
    [data],
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget;
      const {
        error,
        success,
        data: parsedData,
      } = schema.safeParse(parseForm(form));

      setErrors(error?.issues || []);

      if (!success) {
        return false;
      }

      setData(parsedData);
      // Trigger the onSubmit callback to be called next render, AFTER the data is updated.
      setSubmitEvent(e);

      return true;
    },
    [schema],
  );

  useEffect(() => {
    if (submitEvent) {
      onSubmit();
    }
  }, [submitEvent]);

  const isInvalid = useCallback(
    (key: string) =>
      errors.filter((x) => x.path[0] == key).map((x) => x.message).length > 0,
    [errors],
  );

  const getErrorMessages = useCallback(
    (key: string) =>
      errors.filter((x) => x.path[0] == key).map((x) => x.message),
    [errors],
  );

  return {
    /** The data parsed from the form, updated by `handleChange`, `handleBlur`, and `handleSubmit`. */
    data,
    /** The validity erros in the form data, updated by `handleChange`, `handleBlur`, and `handleSubmit`. */
    errors,
    /** @returns All messages from `errors` for the given `key`. */
    getErrorMessages,
    /** @returns `true` if `errors` currently has an error for the given `key`. */
    isInvalid,
    /** Updates `data` and removes existing errors from `errors` for this field if its' value is valid. */
    handleChange,
    /** Updates `data` and `errors`. */
    handleBlur,
    /**
     * Prevents default form submission, parses and validates current form data, then calls the given `onSubmit` callback.
     * @returns `true` if the data was valid and `onSubmit` will be called, otherwise `false`.
     **/
    handleSubmit,
  };
}

function parseValue(value: string | File, type: string) {
  if (value instanceof File) {
    return value;
  }

  return type === "number"
    ? Number(value)
    : type === "date"
      ? parseDate(value, "yyyy-MM-dd", new Date())
      : value;
}

function parseForm(form: HTMLFormElement) {
  return Object.fromEntries(
    new FormData(form).entries().map(([key, value]) => {
      const field = form.elements.namedItem(key);

      if (!field || !(field instanceof HTMLInputElement)) {
        return [key, value];
      }

      return [key, parseValue(value, field.type)];
    }),
  );
}
