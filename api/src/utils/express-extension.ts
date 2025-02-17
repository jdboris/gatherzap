import { RequestHandler } from "express";
import { IRouter, PathParams } from "express-serve-static-core";
import { RequireRoleMiddleware } from "../middleware/auth";
import {
  ValidateRequestBodyMiddleware,
  ValidateResponseBodyMiddleware,
} from "../middleware/validatation";

const methodNames = ["post", "put", "patch", "get", "delete"] as const;

type Method = (typeof methodNames)[number];

/** Recursively extracts parameters from a route path string. */
type ExtractParams<T extends string> =
  T extends `${string}/:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : T extends `${string}/:${infer Param}`
    ? Param
    : never;

/** An object with properties for extracted route parameters. */
type RouteParams<T extends string> = {
  [K in ExtractParams<T>]: string;
};

export type Extended<A extends IRouter> = Omit<A, Method> & {
  [M in Method]: ReturnType<typeof createExtendedMethod>;
} & {
  use: <B extends IRouter>(router: Extended<B>) => Extended<A>;
};

/**
 * Extends a given Express `Application` or `Router` to require using the middleware
 * `requireRole`, `validateRequestBody`, and `validateResponseBody`. Also adds inferred
 * types to handlers.
 */
export function extend<A extends IRouter>(routerOrApp: A) {
  methodNames.forEach((methodName) => {
    (routerOrApp as Extended<A>)[methodName] = createExtendedMethod(
      routerOrApp,
      methodName
    );
  });

  return routerOrApp as Extended<A>;
}

function createExtendedMethod<A extends IRouter>(
  target: A,
  methodName: Method
) {
  const original = target[methodName];

  /**
   * Extended to require using `requireRole`, `validateRequestBody`, and `validateResponseBody`.
   * @example
   * app.put(
   *   "/product/:id",
   *   requireRole("ADMIN"),
   *   validateRequestBody(updateProductSchema),
   *   validateResponseBody(fullProductSchema),
   *   (req, res) => { ... }
   * );
   **/
  return function <ResBody, ReqBody, T extends PathParams>(
    path: T,
    requireRoleMiddleware: RequireRoleMiddleware & RequestHandler,
    validateRequestBodyMiddelware: ValidateRequestBodyMiddleware &
      RequestHandler<{}, {}, ReqBody>,
    validateResponseBodyMiddleware: ValidateResponseBodyMiddleware &
      RequestHandler<{}, ResBody>,
    handler: RequestHandler<
      T extends string ? RouteParams<T> : {},
      ResBody,
      ReqBody
    >
  ) {
    // NOTE: For the app settings version of `.get`...
    if (arguments.length == 1) {
      return original.bind(target)(path);
    }

    if (!(requireRoleMiddleware instanceof RequireRoleMiddleware)) {
      throw new Error("`requireRole` middleware is required.");
    }

    if (
      !(validateRequestBodyMiddelware instanceof ValidateRequestBodyMiddleware)
    ) {
      throw new Error("`validateRequestBody` middleware is required.");
    }

    if (
      !(
        validateResponseBodyMiddleware instanceof ValidateResponseBodyMiddleware
      )
    ) {
      throw new Error("`validateResponseBody` middleware is required.");
    }

    return original.bind(target)(
      path,
      requireRoleMiddleware,
      validateRequestBodyMiddelware,
      validateResponseBodyMiddleware,
      handler
    );
  };
}
