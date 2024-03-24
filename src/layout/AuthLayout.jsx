import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";
import logo from '../../public/log.png'
import { useTranslation } from "react-i18next";

const AuthLayout = () => {
  const { ready } = useSelector((state) => state.auth);
  const { t, i18n } = useTranslation();
  // console.log(data)
  const isLoggedIn = ready
  const path = useMemo(() => {
    return !isLoggedIn ? <Outlet /> : <Navigate to="/" />;
  }, [isLoggedIn]);
  return (
    <>
      {/* <Navbar /> */}
      <div
        className="auth"
        id="welcome"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          // width: "40%",
          padding: "20px 0",
          background: "transparent",
          position: "fixed",
          top: "0",
          flexDirection: i18n.language === "en" ? "row" : "row-reverse",
        }}
      >
        <div
          className="right"
          style={{
            fontSize: "19px",
            justifyContent: i18n.language === "en" ? "flex-start" : "flex-end",
            fontWeight: "bold",
          }}
        >
          <Link
            to={"https://einvoice.nozzm.com"}
            style={{ color: "white", textDecoration: "none" }}
          >
            {t("backHome")}
          </Link>
        </div>
        <div
          className="left"
          style={{
            alignItems: i18n.language === "en" ? "flex-end" : "flex-start",
          }}
        >
          <img src={logo} alt="" style={{ width: "70px" }} />
        </div>
      </div>
      <div className="auth-layout">{path}</div>
    </>
  );
};

export default AuthLayout;
