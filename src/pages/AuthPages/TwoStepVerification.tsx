import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import OtpForm from "../../components/auth/OtpForm";
import { useDisableScroll } from "../../hooks/useDisableScroll";

export default function TwoStepVerification() {
  // Disable scroll on mobile devices
  useDisableScroll();

  return (
    <>
      <PageMeta
        title="React.js Two Step Verification Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Two Step Verification Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <OtpForm />
      </AuthLayout>
    </>
  );
}
