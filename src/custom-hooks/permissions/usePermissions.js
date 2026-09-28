import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";

const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loginAs, setLoginAs] = useState(null);

  useEffect(() => {
    const storedPermissions = localStorage.getItem("UP");

    if (storedPermissions) {
      try {
        setPermissions(JSON.parse(storedPermissions));
      } catch (error) {
        console.error("Invalid permissions:", error);
        setPermissions([]);
      }
    }

    const userData = Cookies.get("userData");

    if (userData) {
      try {
        const parsedUserData = JSON.parse(decodeURIComponent(userData));

        setLoginAs(parsedUserData?.login_as);
      } catch (error) {
        console.error("Invalid userData:", error);
      }
    }
  }, []);

  const getPermission = useCallback(
    (moduleKey) => {
      return permissions.find((item) => item?.module_key === moduleKey);
    },
    [permissions],
  );

  const canView = useCallback(
    (moduleKey) => {
      // Admin → allow everything
      if (loginAs !== "partner_user") {
        return true;
      }

      // Partner user → check permission
      return !!getPermission(moduleKey)?.can_view;
    },
    [loginAs, getPermission],
  );

  const canAdd = useCallback(
    (moduleKey) => {
      // Admin → allow everything
      if (loginAs !== "partner_user") {
        return true;
      }

      return !!getPermission(moduleKey)?.can_add;
    },
    [loginAs, getPermission],
  );

  const canEdit = useCallback(
    (moduleKey) => {
      // Admin → allow everything
      if (loginAs !== "partner_user") {
        return true;
      }

      return !!getPermission(moduleKey)?.can_edit;
    },
    [loginAs, getPermission],
  );

  const canDelete = useCallback(
    (moduleKey) => {
      // Admin → allow everything
      if (loginAs !== "partner_user") {
        return true;
      }

      return !!getPermission(moduleKey)?.can_delete;
    },
    [loginAs, getPermission],
  );

  return {
    permissions,
    loginAs,
    getPermission,
    canView,
    canAdd,
    canEdit,
    canDelete,
  };
};

export default usePermissions;
