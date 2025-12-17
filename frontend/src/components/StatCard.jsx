import PropTypes from "prop-types";

/**
 * Simple stat card for displaying key metrics
 */
function StatCard({ title, value, subtitle, icon, color = "#1d4ed8" }) {
  return (
    <div
      className="stat-card"
      style={{
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e7ed",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#52606d", fontWeight: 500 }}>
            {title}
          </p>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "2rem",
              fontWeight: 700,
              color: color,
              lineHeight: 1,
            }}
          >
            {value}
          </p>
          {subtitle && (
            <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#7c8a97" }}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              backgroundColor: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  color: PropTypes.string,
};

export default StatCard;
