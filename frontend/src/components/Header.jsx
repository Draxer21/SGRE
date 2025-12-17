import PropTypes from "prop-types";

/**
 * Header component for page headers with title, subtitle, and action buttons.
 * @param {Object} props - Component props
 * @param {string} props.title - Main title text
 * @param {string} [props.subtitle] - Optional subtitle/description
 * @param {React.ReactNode} [props.actions] - Optional action buttons or controls
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Inline styles
 */
function Header({ title, subtitle, actions, className = "", style = {} }) {
  const headerClass = `app-header ${className}`.trim();

  return (
    <header className={headerClass} style={style}>
      <div>
        <h1 className="app-title">{title}</h1>
        {subtitle && <p className="app-subtitle">{subtitle}</p>}
      </div>
      {actions && (
        <div className="grid" style={{ gap: "12px", gridAutoFlow: "column" }}>
          {actions}
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Header;
