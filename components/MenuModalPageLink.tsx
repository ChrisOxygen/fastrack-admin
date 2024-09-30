import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type MenuModalPageLinkProps = {
  icon: React.ReactNode;
  title: string;
};

function MenuModalPageLink({ icon, title }: MenuModalPageLinkProps) {
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
      className={`${isActive ? "modalMenuLink-active" : "modalMenuLink"}`}
    >
      <span className="">{icon}</span>
      <span className=" font-bold">{title}</span>
    </Link>
  );
}

export default MenuModalPageLink;
