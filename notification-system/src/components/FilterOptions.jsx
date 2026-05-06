import React from "react";

const FilterOptions = ({
  mode,
  setMode,
  Currentpage,
  setCurrentPage,
  maxProductsPerPage,
  setMaxProductsPerPage,
  n,
  setN,
  studentId,
  setStudentId,
  options = [],
  filterType,
  setFilterType,
}) => {
  return (
    <div className="filter-row">
      <div className="filter-field">
        <label className="filter-label">Mode</label>
        <select
          className="filter-control"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {mode === "normal" ? (
        <>
          <div className="filter-field small">
            <label className="filter-label">Page</label>
            <input
              className="filter-control"
              type="number"
              min="1"
              value={Currentpage}
              onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
            />
          </div>

          <div className="filter-field small">
            <label className="filter-label">Type</label>
            <select
              className="filter-control"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All</option>
              {options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-field small">
            <label className="filter-label">Limit</label>
            <select
              className="filter-control"
              value={maxProductsPerPage}
              onChange={(e) => setMaxProductsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="filter-field small">
            <label className="filter-label">n</label>
            <input
              className="filter-control"
              type="number"
              min="1"
              max="10"
              value={n}
              onChange={(e) =>
                setN(Math.min(10, Math.max(1, Number(e.target.value) || 1)))
              }
            />
          </div>

          <div className="filter-field small">
            <label className="filter-label">Student ID</label>
            <select
              className="filter-control"
              value={studentId}
              onChange={(e) =>
                setStudentId(
                  Math.min(3, Math.max(1, Number(e.target.value) || 1)),
                )
              }
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterOptions;
