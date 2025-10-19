import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="card">
      <h2 className="card__title">No encontramos lo que buscas</h2>
      <p>Verifica la URL o vuelve al panel principal.</p>
      <Link to="/dashboard" className="nav__link nav__link--active">
        Ir al panel
      </Link>
    </section>
  );
}

export default NotFoundPage;
