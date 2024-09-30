import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type DesktopPageLinkProps = {
  icon: React.ReactNode;
  title: string;
};

function DesktopPageLink({ icon, title }: DesktopPageLinkProps) {
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
      className={`${isActive ? "sideBarLink-active" : "sideBarLink"}`}
    >
      <span className="">{icon}</span>
      <span className=" font-bold">{title}</span>
    </Link>
  );
}

export default DesktopPageLink;
