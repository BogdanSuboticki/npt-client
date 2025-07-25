import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col flex-1">

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto lg:mb-0 mb-30">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Prijavite se
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
            Unesite svoje podatke da biste se prijavili!
            </p>
          </div>
          <div>

            <form>
              <div className="space-y-6">
                <div>
                  <Label>
                    E-mail <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="Unesite svoj e-mail" />
                </div>
                <div>
                  <Label>
                    Lozinka <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Unesite svoju lozinku"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-12">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Zaboravljena lozinka?
                  </Link>
                </div>
                <div>
                  <Button className="w-full font-medium" size="sm">
                    Prijavi se
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Nemate nalog? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Registrujte se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
