import { NextFunction, Request, Response } from "express";
import { Requirements } from "../../types/interfaces/password.interface";
import { ValidatePassword } from "../../tools/password.tools";
import { ApiError } from "../../types/classes/error.class";
import { ValidationOptions, registerDecorator } from "class-validator";

export function passwordValidatorMiddleware(requirementsSchema: Requirements, passwordFieldName: string = "password") {
  const passwordValidator = new ValidatePassword(requirementsSchema);
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.body[passwordFieldName]) next();
    let resultVerifyPassword = passwordValidator.getStrength(req.body[passwordFieldName]);
    if (resultVerifyPassword < 99) {
      req.flash("error", "Password is not strong enough");
      return next(new ApiError(400, "Password is not strong enough"));
    };
    return next();
  };
};

export function PasswordValidator(requirements: Requirements, validationOptions?: ValidationOptions) {
  const passwordValidator = new ValidatePassword(requirements);
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'PasswordValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(password: string | undefined, validationArguments) {
          return !!password && passwordValidator.getStrength(password) > 99;
        },
      },
    });
  };
}