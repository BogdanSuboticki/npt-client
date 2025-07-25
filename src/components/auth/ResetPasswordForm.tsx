import { Link } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function ResetPasswordForm() {
  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2 mb-20">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto lg:mb-0 mb-30">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Zaboravljena lozinka?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Unesite svoj e-mail, a mi ćemo vam poslati link za resetovanje lozinke.
          </p>
        </div>
        <div>
          <form>
            <div className="space-y-5">
              {/* <!-- Email --> */}
              <div>
                <Label>
                  E-mail <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Unesite svoj e-mail"
                />
              </div>

              {/* <!-- Button --> */}
              <div>
                <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                  Pošalji link za resetovanje
                </button>
              </div>
            </div>
          </form>
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Setio sam se lozinke...
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Kliknite ovde
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
