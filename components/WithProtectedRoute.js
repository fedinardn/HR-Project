import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getUserPermission } from "../services/database.mjs";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

const withProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const { user } = props;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
      const checkPermission = async () => {
        if (user === null) {
          return;
        }

        if (!user) {
          router.push("/login");
          return;
        }

        try {
          const permission = await getUserPermission(user.email);
          if (permission === "Admin") {
            setHasPermission(true);
          } else {
            setShowErrorModal(true);
          }
        } catch (error) {
          console.error("Error checking user permission:", error);
          setShowErrorModal(true);
        } finally {
          setLoading(false);
        }
      };

      checkPermission();
    }, [user, router]);

    const handleCloseErrorModal = () => {
      setShowErrorModal(false);
      router.push("/");
    };

    if (loading) {
      return (
        <div className="flex justify-content-center flex-wrap">
          <ProgressSpinner
            style={{ width: "100px", height: "100px" }}
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration="1s"
          />
        </div>
      );
    }

    if (showErrorModal) {
      return (
        <Dialog
          header="Access Denied"
          visible={showErrorModal}
          onHide={handleCloseErrorModal}
          footer={
            <div>
              <Button
                label="OK"
                icon="pi pi-check"
                onClick={handleCloseErrorModal}
                autoFocus
              />
            </div>
          }
        >
          <p>You do not have permission to access this page.</p>
        </Dialog>
      );
    }

    if (hasPermission) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withProtectedRoute;
