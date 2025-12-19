import { useMemo } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import Footer from "./Footer.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useI18n } from "../contexts/I18nContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import { getFrontendManifest } from "../services/frontendService.js";

const FALLBACK_MANIFEST = {
  brand: {
    title: "SGRE",
    subtitle: "Gestion Municipal",
    header: {
      heading: "Municipalidad ",
      intro: "Sistema de Gestion de Reservas y Eventos.",
    },
  },
  navigation: [
    { to: "/cuentas", label: "Cuentas" },
    { to: "/dashboard", label: "Panel" },
    { to: "/perfil", label: "Perfil" },
    { to: "/eventos", label: "Eventos" },
    { to: "/reservas", label: "Reservas" },
    { to: "/reportes", label: "Reportes" },
    { to: "/notificaciones", label: "Notificaciones" },
  ],
  styleBundles: ["cuentas"],
  footerSections: [
    {
      title: "Panorama",
      ariaLabel: "General",
      items: [
        { label: "Reportes", href: "/reportes/" },
        { label: "Eventos", href: "/eventos/" },
        { label: "Reservas", href: "/reservas/" },
        { label: "Notificaciones", href: "/notificaciones/" },
      ],
    },
    {
      title: "Recursos",
      ariaLabel: "Recursos",
      items: [
        { label: "Documentacion API", href: "/api/docs/" },
        { label: "ReDoc", href: "/api/redoc/" },
        { label: "Administracion", href: "/admin/" },
        { label: "Politicas y terminos", href: "#" },
      ],
    },
    {
      title: "Comunidad",
      ariaLabel: "Comunidad",
      items: [
        { label: "Transparencia", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contacto", href: "#" },
        { label: "Soporte", href: "#" },
      ],
    },
  ],
};

function toTitle(value) {
  if (!value) {
    return "";
  }
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

function Layout() {
  const { data: manifestData } = useAsync(getFrontendManifest, []);
  const { user, role, loading: authLoading, logout } = useAuth();
  const { t } = useI18n();

  const navigationItems = manifestData?.navigation ?? FALLBACK_MANIFEST.navigation;
  const restrictedPrefixes = [
    "/dashboard",
    "/cuentas",
    "/reportes",
    "/notificaciones",
  ];
  const visibleNavigationItems =
    role === "consulta"
      ? navigationItems.filter(
          (item) =>
            !restrictedPrefixes.some((prefix) => item.to.startsWith(prefix)),
        )
      : navigationItems;
  const brand = {
    title: manifestData?.brand?.title ?? t("brand.title"),
    subtitle: manifestData?.brand?.subtitle ?? t("brand.subtitle"),
    header: {
      heading:
        manifestData?.brand?.header?.heading ??
        t("brand.headerTitle"),
      intro:
        manifestData?.brand?.header?.intro ??
        t("brand.headerIntro"),
    },
  };

  const footerSections = useMemo(() => {
    if (manifestData?.footer?.links) {
      return Object.entries(manifestData.footer.links).map(([key, items]) => ({
        title: toTitle(key),
        ariaLabel: toTitle(key),
        items: Array.isArray(items) ? items : [],
      }));
    }
    return FALLBACK_MANIFEST.footerSections;
  }, [manifestData]);

  const styleBundles =
    manifestData?.styleBundles ?? FALLBACK_MANIFEST.styleBundles;
  useBackendStyles(styleBundles);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="app-shell app-shell--react">
      <aside className="app-shell__sidebar">
        <div className="app-shell__brand">
          <span className="brand__title">{brand.title}</span>
          <span className="brand__subtitle">{brand.subtitle}</span>
        </div>
        <nav className="app-shell__nav">
          {visibleNavigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav__link${isActive ? " nav__link--active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-shell__actions">
          {user ? (
            <>
              <span className="nav__user">
                {t("layout.sessionLabel", "Sesión")}:{" "}
                <strong>{user}</strong>
              </span>
              <button
                type="button"
                className="nav__cta nav__cta--logout"
                onClick={handleLogout}
                disabled={authLoading}
              >
                {t("layout.logoutCta", "Cerrar sesión")}
              </button>
            </>
          ) : (
            <Link to="/acceso" className="nav__cta">
              {t("layout.loginCta", "Iniciar sesión")}
            </Link>
          )}
          <LanguageSwitcher />
        </div>
      </aside>
      <div className="app-shell__content">
        <header className="app-shell__header">
          <h1>{brand.header.heading}</h1>
          <p className="app-shell__intro">{brand.header.intro}</p>
        </header>
        <main className="app-shell__main">
          <Outlet />
        </main>
        <Footer sections={footerSections} />
      </div>
    </div>
  );
}

export default Layout;
