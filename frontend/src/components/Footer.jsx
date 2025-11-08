const DEFAULT_SECTIONS = [
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
];

function Footer({ sections = DEFAULT_SECTIONS }) {
  const currentYear = new Date().getFullYear();
  const linkSections = Array.isArray(sections) ? sections : DEFAULT_SECTIONS;

  return (
    <footer className="sgre-footer" role="contentinfo">
      <div className="sgre-footer__wrap">
        <div className="sgre-footer__top">
          <div className="sgre-footer__brand">
            <div className="sgre-footer__logo" aria-label="SGRE">
              SGRE
            </div>
            <p className="sgre-footer__mission">
              Nuestra mision es impulsar una gestion publica moderna, transparente
              y centrada en las personas a traves de procesos, datos y colaboracion.
            </p>
          </div>
          <div className="sgre-footer__cols">
            {linkSections.map((section) => (
              <nav
                key={section.title}
                className="sgre-footer__col"
                aria-label={section.ariaLabel ?? section.title}
              >
                <h3 className="sgre-footer__title">{section.title}</h3>
                <ul className="sgre-footer__list">
                  {section.items?.map((item) => (
                    <li key={item.href ?? item.label}>
                      <a className="sgre-footer__link" href={item.href}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="sgre-footer__bottom">
          <p className="sgre-footer__copy">
            &copy; {currentYear} SGRE · Todos los derechos reservados
          </p>
          <div className="sgre-footer__badges" aria-label="Sellos y medios aceptados">
            <span className="sgre-badge">SSL</span>
            <span className="sgre-badge">ISO</span>
            <span className="sgre-badge">GDPR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
