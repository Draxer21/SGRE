import { Link } from "react-router-dom";

import { useBackendStyles } from "../hooks/useBackendStyles.js";

function ReportsPage() {
  useBackendStyles("reportes");

  return (
    <>
      <header className="app-header">
        <div>
          <h1 className="app-title">Reportes e Indicadores</h1>
          <p className="app-subtitle">Monitorea desempeno y publica informes.</p>
        </div>
        <div className="grid" style={{ gap: "12px", gridAutoFlow: "column" }}>
          <Link className="btn btn--primary" to="/reportes/nuevo">
            Nuevo reporte
          </Link>
          <Link className="btn btn--ghost" to="/reportes/lista">
            Gestionar
          </Link>
        </div>
      </header>

      <main className="grid grid--two-columns">
        <section className="surface">
          <h2 className="section-title">Comienza aqui</h2>
          <article className="card">
            <div className="card__header">
              <h3 className="card__title">Crear un informe</h3>
            </div>
            <p className="card__meta">
              Titulo, fecha, descripcion y estado de publicacion.
            </p>
            <Link className="link" to="/reportes/nuevo">
              Crear ahora
            </Link>
          </article>
        </section>

        <section className="surface">
          <h2 className="section-title">Enlaces utiles</h2>
          <div className="grid">
            <a className="link" href="/api/docs/">
              Documentacion API
            </a>
            <a className="link" href="/api/redoc/">
              ReDoc
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

export default ReportsPage;
