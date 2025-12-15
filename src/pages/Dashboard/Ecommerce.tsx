import SystemMetrics from "../../components/ecommerce/SystemMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import DnevniIzvestajiWidget from "../../components/dashboard/DnevniIzvestajiWidget";
import RokoviWidget from "../../components/dashboard/RokoviWidget";
import PovredeWidget from "../../components/dashboard/PovredeWidget";
import LekarskiPreglediWidget from "../../components/dashboard/LekarskiPreglediWidget";
import PreglediOpremeWidget from "../../components/dashboard/PreglediOpremeWidget";
import PageMeta from "../../components/common/PageMeta";
import { useUser } from "../../context/UserContext";

export default function Ecommerce() {
  const { userType } = useUser();
  const isKomitent = userType === 'komitent';
  const isAdmin = userType === 'admin' || userType === 'super-admin';

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {isKomitent ? (
          // Komitent view - only show Dnevni Izvestaji widget
          <div className="col-span-12">
            <DnevniIzvestajiWidget />
          </div>
        ) : (
          // Regular view for other roles
          <>
            {/* System Metrics - Full width row */}
            <div className="col-span-12">
              <SystemMetrics />
            </div>

            {/* Widgets at the top */}
            {isAdmin ? (
              <>
                <div className="col-span-12 xl:col-span-6">
                  <DnevniIzvestajiWidget />
                </div>
                <div className="col-span-12 xl:col-span-6">
                  <RokoviWidget />
                </div>
              </>
            ) : (
              <div className="col-span-12 xl:col-span-4">
                <DnevniIzvestajiWidget />
              </div>
            )}

            {/* Safety & Compliance Widgets */}
            <div className="col-span-12 xl:col-span-4">
              <PovredeWidget />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <LekarskiPreglediWidget />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <PreglediOpremeWidget />
            </div>

            <div className="col-span-12 space-y-6 xl:col-span-7">
              <MonthlySalesChart />
            </div>

            <div className="col-span-12 xl:col-span-5">
              <MonthlyTarget />
            </div>

            <div className="col-span-12">
              <StatisticsChart />
            </div>

            <div className="col-span-12 xl:col-span-5">
              <DemographicCard />
            </div>

            <div className="col-span-12 xl:col-span-7">
              <RecentOrders />
            </div>
          </>
        )}
      </div>
    </>
  );
}
