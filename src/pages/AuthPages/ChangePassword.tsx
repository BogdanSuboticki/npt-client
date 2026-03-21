import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";
import { useDisableScroll } from "../../hooks/useDisableScroll";

export default function ChangePassword() {
  // Disable scroll on mobile devices
  useDisableScroll();

  return (
    <>
      <PageMeta
        title="Promena lozinke | NPT"
        description="Promena inicijalne lozinke pre prvog korišćenja sistema"
      />
      <AuthLayout>
        <ChangePasswordForm />
      </AuthLayout>
    </>
  );
}
