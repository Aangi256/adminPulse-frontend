"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";

import {
  GridIcon,
  UserCircleIcon,
  RoleIcon,
  Customers,
  JobIcon
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

/* 🔥 ALL NAV ITEMS */
const allNavItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/" },
  { icon: <UserCircleIcon />, name: "User Profile", path: "/profile" },

  { name: "Role", icon: <RoleIcon className="w-5 h-5" />, path: "/role1" },
  { name: "Users", icon: <UserCircleIcon />, path: "/user" },
  { name: "Customer", icon: <Customers className="w-5 h-5" />, path: "/customers" },

  { name: "Chat", path: "/chat", icon: "💬" },

  { name: "Job", path: "/jobs", icon: <JobIcon className="w-5 h-5" /> },
  { name: "Assigned Job", path: "/jobs/assigned", icon: <JobIcon className="w-5 h-5" /> }
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>(null);

  /* 🔥 GET ROLE */
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("CURRENT ROLE:", storedRole);
    setRole(storedRole);
  }, []);

  /* 🔥 FILTER BASED ON ROLE */
  const navItems =
    role === "Admin"
      ? allNavItems.filter((item) => item.name !== "Assigned Job")
      : allNavItems.filter(
          (item) =>
            item.name === "Dashboard" ||
            item.name === "User Profile" ||
            item.name === "Chat" ||
            item.name === "Assigned Job"
        );

  /* ---------- EXISTING LOGIC ---------- */

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;

    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;

      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (
    items: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.path && (
            <Link
              href={nav.path}
              className={`menu-item group ${
                isActive(nav.path)
                  ? "menu-item-active"
                  : "menu-item-inactive"
              }`}
            >
              <span>{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col top-0 px-5 left-0 bg-white h-screen transition-all duration-300 border-r
      ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-8 flex justify-start">
        <Link href="/">
          <Image
            src="/tailadmin-nextjs/images/logo/AdminPulse.svg"
            alt="Logo"
            width={150}
            height={40}
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-4">
        <h2 className="text-xs uppercase text-gray-400">Menu</h2>

        {renderMenuItems(navItems, "main")}
      </nav>
    </aside>
  );
};

export default AppSidebar;