import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { useBackendStyles } from "../hooks/useBackendStyles.js";
import Header from "../components/Header.jsx";

function ReportsPage() {
  useBackendStyles("reportes");
  const { canEdit } = useAuth();

  return (
    <>
      <Header
        title="Reportes e Indicadores"
        subtitle={canEdit() ? "Monitorea desempeno y publica informes." : "Consulta reportes publicados."}
        actions={
          <>
            {canEdit() && (
              <Link className="btn btn--primary" to="/reportes/nuevo">
                Nuevo reporte
              </Link>
            )}
            <Link className="btn btn--ghost" to="/reportes/lista">
              {canEdit() ? "Gestionar" : "Ver lista"}
            </Link>
          </>
        }
      />

      <main className="grid grid--two-columns">
        <section className="surface">
          <h2 className="section-title">{canEdit() ? "Comienza aqui" : "Información"}</h2>
          <article className="card">
            <div className="card__header">
              <h3 className="card__title">{canEdit() ? "Crear un informe" : "Consulta reportes"}</h3>
            </div>
            <p className="card__meta">
              {canEdit() ? "Titulo, fecha, descripcion y estado de publicacion." : "Revisa reportes publicados y sus estadisticas."}
            </p>
            <Link className="link" to={canEdit() ? "/reportes/nuevo" : "/reportes/lista"}>
              {canEdit() ? "Crear ahora" : "Ver reportes"}
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
