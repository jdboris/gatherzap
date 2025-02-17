import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

/**
 * Responds with `400` if validation fails.
 *
 * @param schema - The Zod schema to parse/validate request body with.
 * @example
 * app.put("/account", validateSchema(accountSchema), (req, res) => { ... });
 */
export const validateRequestBody = <ReqBody>(
  schema: ZodSchema<ReqBody> | null
) => {
  const middleware = (
    req: Request<{}, {}, ReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    if (!schema && req.body) {
      throw new Error(
        "`null` specified for request body schema, but a body was received."
      );
    }

    if (!schema || !req.body) {
      next();
      return;
    }

    if (!(schema instanceof ZodSchema)) {
      throw new Error("`schema` must be a valid Zod schema.");
    }

    const { success, data, error } = schema.safeParse(req.body);

    if (!success) {
      console.error(error);
      res.status(400).send();
      return;
    }

    req.body = data;
    next();
  };

  Object.setPrototypeOf(middleware, ValidateRequestBodyMiddleware.prototype);

  if (!(middleware instanceof ValidateRequestBodyMiddleware)) {
    throw new Error("Something went wrong.");
  }

  return middleware;
};

export class ValidateRequestBodyMiddleware {
  // Suppress the warning since this is intentional
  // @ts-ignore
  readonly __brand: "ValidateRequestMiddleware";
}

/**
 * Throws an error if following handler(s) send a response body that doesn't match the given `schema`.
 *
 * @param schema - The Zod schema to parse/validate response body with.
 * @example
 * app.get("/product/:id", validvalidateResponseBodyateResponse(productSchema), (req, res) => { ... });
 */
export const validateResponseBody = <ResBody>(
  schema: ZodSchema<ResBody> | null
) => {
  const middleware = (
    _: Request<{}, ResBody | null>,
    res: Response<ResBody | null>,
    next: NextFunction
  ) => {
    if (schema && !(schema instanceof ZodSchema)) {
      throw new Error("`schema` must be a valid Zod schema.");
    }

    const methodNames = ["send", "json"] as const;

    const extendedMethods = methodNames.map((method) => {
      const original = res[method];

      return function (body: ResBody | null | undefined) {
        // NOTE: Express forwards `send` calls to `json`, which then forwards the JSON string
        //       back to `send`. Validation is only necessary in the `json` call.
        if (method == "json") {
          if (
            !schema &&
            body &&
            res.statusCode >= 200 &&
            res.statusCode <= 300
          ) {
            throw new Error(
              "`null` specified for response body schema, but a body was provided."
            );
          }

          if (schema) {
            const { success, error } = schema.safeParse(body);

            if (!success) {
              throw error;
            }
          }
        }

        return original.call(res, body);
      };
    });

    methodNames.forEach((method, i) => {
      res[method] = extendedMethods[i];
    });

    next();
  };

  Object.setPrototypeOf(middleware, ValidateResponseBodyMiddleware.prototype);

  if (!(middleware instanceof ValidateResponseBodyMiddleware)) {
    throw new Error("Something went wrong.");
  }

  return middleware;
};

export class ValidateResponseBodyMiddleware {
  // Suppress the warning since this is intentional
  // @ts-ignore
  readonly __brand: "ValidateResponseMiddleware";
}
