import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

type MobilePageLinkProps = {
  icon: React.ReactNode;
  title: string;
};

function MobilePageLink({ icon, title }: MobilePageLinkProps) {
  const pathname = usePathname();
  const dashboardActive = pathname === "/dashboard" && title === "Dashboard";
  const otherPageActive =
    pathname.includes(title.toLowerCase()) && title !== "Dashboard";
  const isActive = title === "Dashboard" ? dashboardActive : otherPageActive;

  const url =
    title === "Dashboard" ? "/dashboard" : `/dashboard/${title.toLowerCase()}`;

  return (
    <Link
      href={url}
      className={`${
        isActive ? "mobileSideBarLink-active" : "mobileSideBarLink"
      }`}
    >
      <span className="">{icon}</span>
    </Link>
  );
}

export default MobilePageLink;
