import { useState, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * Reusable table component with sorting, selection, and custom rendering.
 * 
 * @param {Object} props
 * @param {Array} props.data - Array of data objects to display
 * @param {Array} props.columns - Column definitions
 * @param {Function} [props.onRowClick] - Callback when a row is clicked
 * @param {string} [props.keyField="id"] - Field to use as unique key
 * @param {boolean} [props.striped=true] - Enable striped rows
 * @param {boolean} [props.hoverable=true] - Enable hover effect
 * @param {string} [props.emptyMessage] - Message when no data
 */
function Table({
  data = [],
  columns = [],
  onRowClick,
  keyField = "id",
  striped = true,
  hoverable = true,
  emptyMessage = "No hay datos para mostrar",
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortConfig.direction === "asc"
        ? aVal < bVal ? -1 : 1
        : aVal > bVal ? -1 : 1;
    });

    return sorted;
  }, [data, sortConfig]);

  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ marginTop: "16px" }}>
        {emptyMessage}
      </div>
    );
  }

  const tableClass = [
    "data-table",
    striped && "data-table--striped",
    hoverable && "data-table--hoverable",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="table-wrapper">
      <table className={tableClass}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.sortable ? "sortable" : ""}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
                style={{
                  width: column.width,
                  textAlign: column.align || "left",
                  cursor: column.sortable ? "pointer" : "default",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {column.label}
                  {column.sortable && sortConfig.key === column.key && (
                    <span style={{ fontSize: "0.8em" }}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr
              key={row[keyField]}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={{ cursor: onRowClick ? "pointer" : "default" }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{ textAlign: column.align || "left" }}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      width: PropTypes.string,
      align: PropTypes.oneOf(["left", "center", "right"]),
      render: PropTypes.func,
    })
  ).isRequired,
  onRowClick: PropTypes.func,
  keyField: PropTypes.string,
  striped: PropTypes.bool,
  hoverable: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

export default Table;
