import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { api, setAuthToken } from "../../api/client";
import { useUser } from "../../context/UserContext";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUserType } = useUser();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await api.post<{ token: string; user: { role?: string } }>("auth/login", {
        email,
        password,
        device_name: "web",
      });

      setAuthToken(response.token);

      const role = response.user?.role ?? "user";
      const mappedRole =
        role === "super_admin" ? "super-admin" : (role as "admin" | "user" | "komitent");
      setUserType(mappedRole);

      // Super admin goes directly to the database dashboard
      navigate(mappedRole === "super-admin" ? "/database" : "/");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Prijava nije uspela.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    E-mail <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    type="email"
                    placeholder="Unesite svoj e-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>
                    Lozinka <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Unesite svoju lozinku"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
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
                <div className="flex items-center justify-between mb-12">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Zaboravljena lozinka?
                  </Link>
                </div>
                <div>
                  <Button
                    className="w-full font-medium"
                    size="sm"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Prijavljivanje..." : "Prijavi se"}
                  </Button>
                </div>
                {errorMessage && (
                  <div className="text-sm text-error-500">{errorMessage}</div>
                )}
              </div>
            </form>

            {/* Registration link intentionally removed — users are created
                by an admin within the app. Only the initial super-admin
                account is created via /signup (bootstrap). */}
          </div>
        </div>
      </div>
    </div>
  );
}
