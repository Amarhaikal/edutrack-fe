import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getMenu } from "./MainService";
import type { MenuModel } from "./menu-model";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { SnackBarProvider, useSnackBar } from "../../contexts/SnackBarContext";
import SnackBarLib from "../../components/SnackBarLib/SnackBarLib";

interface MenuTreeViewModel {
  [key: string]: any;
  id: string;
  name: string;
  hasChild: boolean;
  expanded: boolean;
  pid: string | null;
  selected: boolean;
  icon: string;
  url: string;
  child: MenuTreeViewModel[];
}

function MainContent() {
  const { user } = useAuth();
  const { notification, hideSnackBar } = useSnackBar();
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [menus, setMenus] = useState<MenuModel[]>([]);
  const [treeData, setTreeData] = useState<MenuTreeViewModel[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    setToken(currentToken);

    const handleStorageChanges = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
    };

    window.addEventListener("storage", handleStorageChanges);

    return () => window.removeEventListener("storage", handleStorageChanges);
  }, []);

  useEffect(() => {
    if (token) {
      const fetchMenu = async () => {
        try {
          const data = await getMenu();
          setMenus(data.menus);
        } catch (err) {
          console.error("err", err);
        } finally {
        }
      };

      fetchMenu();
    }
  }, [token]);

  useEffect(() => {
    if (menus?.length > 0) {
      mappingMenu();
    }
  }, [menus]);

  // function to mapping menu (treeview) from api menus
  const mappingMenu = () => {
    if (menus.length > 0) {
      const mapped: MenuTreeViewModel[] = [];

      // Function to recursively map menu items and their children
      const mapMenuRecursive = (
        menuItems: MenuModel[],
        parentId: string | null = null
      ): MenuTreeViewModel[] => {
        return menuItems.map((menu) => {
          const hasChildren = !!(menu.children && menu.children.length > 0);

          const menuItem: MenuTreeViewModel = {
            id: menu.id.toString(),
            name: menu.name,
            hasChild: hasChildren,
            expanded: false,
            pid: parentId,
            selected: false,
            icon: menu.icon,
            url: menu.url || "",
            child:
              hasChildren && menu.children
                ? mapMenuRecursive(menu.children, menu.id.toString())
                : [],
          };

          return menuItem;
        });
      };

      // First, map all parent menus (menus with no parent_id)
      const parentMenus = menus.filter((menu) => !menu.parent_id);

      // Map parent menus with their children
      parentMenus.forEach((parentMenu) => {
        const hasChildren = !!(
          parentMenu.children && parentMenu.children.length > 0
        );

        const parentItem: MenuTreeViewModel = {
          id: parentMenu.id.toString(),
          name: parentMenu.name,
          hasChild: hasChildren,
          expanded: false,
          pid: null,
          selected: false,
          icon: parentMenu.icon,
          url: parentMenu.url || "",
          child:
            hasChildren && parentMenu.children
              ? mapMenuRecursive(parentMenu.children, parentMenu.id.toString())
              : [],
        };

        mapped.push(parentItem);
      });

      setTreeData(mapped);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        treeData={treeData}
        onMenuSelect={(menuId) => {
          setSelectedMenu(menuId);
          console.log("selectedMenu", selectedMenu);
        }}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Header userName={user?.name || "Guest"} />

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "#1a1a1a", // Dark background to match the theme
            color: "white", // White text for better contrast
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Global SnackBar */}
      <SnackBarLib
        type={notification.type}
        action={notification.action}
        entityName={notification.entityName}
        description={notification.message}
        show={notification.show}
        onClose={hideSnackBar}
      />
    </div>
  );
}

export default function Main() {
  return (
    <SnackBarProvider>
      <MainContent />
    </SnackBarProvider>
  );
}
