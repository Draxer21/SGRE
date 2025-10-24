function Footer() {
  const currentYear = new Date().getFullYear();

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
            <nav className="sgre-footer__col" aria-label="General">
              <h3 className="sgre-footer__title">Panorama</h3>
              <ul className="sgre-footer__list">
                <li>
                  <a className="sgre-footer__link" href="/reportes/">
                    Reportes
                  </a>
                </li>
                <li>
                  <a className="sgre-footer__link" href="/eventos/">
                    Eventos
                  </a>
                </li>
                <li>
                  <a className="sgre-footer__link" href="/reservas/">
                    Reservas
                  </a>
                </li>
                <li>
                  <a className="sgre-footer__link" href="/notificaciones/">
                    Notificaciones
                  </a>
                </li>
              </ul>
            </nav>
            <nav className="sgre-footer__col" aria-label="Recursos">
              <h3 className="sgre-footer__title">Recursos</h3>
              <ul className="sgre-footer__list">
                <li>
                  <a className="sgre-footer__link" href="/api/docs/">
                    Documentacion API
                  </a>
                </li>
                <li>
                  <a className="sgre-footer__link" href="/api/redoc/">
                    ReDoc
                  </a>
                </li>
                <li>
                  <a className="sgre-footer__link" href="/admin/">
                    Administracion
                  </a>
                </li>
                <li>
                  <a className="sgre-footer__link" href="#">
                    Politicas y terminos
                  </a>
                </li>
              </ul>
            </nav>
            <nav className="sgre-footer__col" aria-label="Comunidad">
              <h3 className="sgre-footer__title">Comunidad</h3>
              <ul className="sgre-footer__list">
                <li>
                  <a className="sgre-footer__link" href="#">
                    Transparencia
                  </a>
                </li>
                <li>
                  <a className="sgre-footer__link" href="#">
                    Blog
                  </a>
                </li>
                <li>
                  <a className="sgre-footer__link" href="#">
                    Contacto
                  </a>
                </li>
                <li>
                  <a className="sgre-footer__link" href="#">
                    Soporte
                  </a>
                </li>
              </ul>
            </nav>
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
