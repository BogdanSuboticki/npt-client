import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import { useDisableScroll } from "../../hooks/useDisableScroll";

export default function ResetPassword() {
  // Disable scroll on mobile devices
  useDisableScroll();

  return (
    <>
      <PageMeta
        title="React.js Reset Password Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Reset Password Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}
