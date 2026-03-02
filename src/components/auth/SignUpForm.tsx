import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { api, setAuthToken } from "../../api/client";
import { useUser } from "../../context/UserContext";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { setUserType } = useUser();
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  // On mount, check whether bootstrap registration is still open.
  // If not, redirect straight to sign-in.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ allowed: boolean }>("auth/can-register");
        if (!cancelled && !res.allowed) {
          navigate("/signin", { replace: true });
        }
      } catch {
        // API unreachable – stay on the page, the submit will fail with a
        // descriptive error instead.
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!isChecked) {
      setErrorMessage("Morate prihvatiti uslove korišćenja.");
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setErrorMessage("Lozinke se ne podudaraju.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post<{
        message: string;
        user: { role?: string };
        token: string;
      }>("auth/register", {
        ime: formData.ime,
        prezime: formData.prezime,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      });

      setAuthToken(response.token);
      setUserType("super-admin");
      navigate("/database");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Registracija nije uspela.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="flex flex-col flex-1 w-full items-center justify-center lg:w-1/2">
        <div className="text-sm text-gray-400 dark:text-gray-500">Učitavanje...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto lg:mb-0 mb-30">
        <div>
          <div className="mb-3 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Početno podešavanje
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kreirajte prvi administratorski nalog za sistem.
            </p>
          </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="sm:col-span-1">
                    <Label>
                      Ime <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Unesite svoje ime"
                      value={formData.ime}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, ime: event.target.value }))
                      }
                      required
                    />
                  </div>
                  {/* Last Name */}
                  <div className="sm:col-span-1">
                    <Label>
                      Prezime <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Unesite svoje prezime"
                      value={formData.prezime}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, prezime: event.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
                {/* Email */}
                <div>
                  <Label>
                    E-mail <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Unesite svoj e-mail"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, email: event.target.value }))
                    }
                    required
                  />
                </div>
                {/* Password */}
                <div>
                  <Label>
                    Lozinka <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Unesite svoju lozinku"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, password: event.target.value }))
                      }
                      required
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
                <div>
                  <Label>
                    Potvrda lozinke <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Potvrdite lozinku"
                    type={showPassword ? "text" : "password"}
                    value={formData.passwordConfirmation}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, passwordConfirmation: event.target.value }))
                    }
                    required
                  />
                </div>
                {/* Checkbox */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400 text-sm">
                    Kreiranjem naloga, prihvatate naše{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Uslove korišćenja
                    </span>{" "}
                    i našu{" "}
                    <span className="text-gray-800 dark:text-white">
                      Politiku privatnosti
                    </span>
                  </p>
                </div>
                {/* Button */}
                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Kreiranje..." : "Kreiraj administratorski nalog"}
                  </Button>
                </div>
                {errorMessage && (
                  <div className="text-sm text-error-500">{errorMessage}</div>
                )}
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Već imate nalog?{" "}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Prijavite se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
