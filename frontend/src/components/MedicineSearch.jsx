import React from "react";
function MedicineSearch({ search, setSearch }) {

  return (
    <div className="search-box">

      <input
        type="text"
        placeholder="🔍 Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </div>
  );
}

export default MedicineSearch;