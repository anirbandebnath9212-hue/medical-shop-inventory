import React, { useEffect, useState } from "react";

import MedicineSearch from "../components/MedicineSearch";


function Inventory() {

  const [medicines, setMedicines] = useState([]);

  const [search, setSearch] = useState("");

  const [showAllBatches, setShowAllBatches] = useState(false);

  const [importantOrders, setImportantOrders] = useState([]);

  const [showOrderForm, setShowOrderForm] = useState(false);

  const [orderMedicine, setOrderMedicine] = useState("");

  const [orderQuantity, setOrderQuantity] = useState(1);

  const [form, setForm] = useState({
    name: "",
    genericName: "",
    category: "",
    minimumStock: "",
    sellingPrice: ""
  });


  // GET MEDICINES
  const getMedicines = async () => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/medicines?search=${search}&showAll=${showAllBatches}`
      );

      const data = await response.json();

      setMedicines(data);

    } catch (error) {

      console.error(error);

    }

  };


  // GET IMPORTANT ORDERS
  const getImportantOrders = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/important-orders"
      );

      const data = await response.json();

      setImportantOrders(data);

    } catch (error) {

      console.error(error);

    }

  };


  // ADD IMPORTANT ORDER
  const addImportantOrder = async () => {

    if (!orderMedicine) {
      alert("Please select a medicine");
      return;
    }

    if (Number(orderQuantity) <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:5000/api/important-orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            medicine: orderMedicine,
            quantityNeeded: Number(orderQuantity)
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {
        alert(data.message);
        return;
      }


      alert("Important order added");


      setOrderMedicine("");

      setOrderQuantity(1);

      setShowOrderForm(false);

      getImportantOrders();


    } catch (error) {

      alert("Something went wrong");

    }

  };

  // DELETE IMPORTANT ORDER
const deleteImportantOrder = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/important-orders/${id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Important order deleted");

    getImportantOrders();

  } catch (error) {
    alert("Something went wrong");
  }
};


  // LOAD DATA
  useEffect(() => {

    getMedicines();

    getImportantOrders();

  }, [search, showAllBatches]);


  // HANDLE ADD MEDICINE FORM
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  // ADD MEDICINE
  const addMedicine = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:5000/api/medicines",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            ...form,

            minimumStock: Number(
              form.minimumStock
            ),

            sellingPrice: Number(
              form.sellingPrice
            )
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert("Medicine added successfully");


      setForm({
        name: "",
        genericName: "",
        category: "",
        minimumStock: "",
        sellingPrice: ""
      });


      getMedicines();


    } catch (error) {

      alert("Something went wrong");

    }

  };


  return (

    <div className="inventory">


      {/* IMPORTANT ORDERS */}

      <section className="important-orders">

        <h2>⭐ Important Orders</h2>


        <button
          onClick={() =>
            setShowOrderForm(!showOrderForm)
          }
        >

          {showOrderForm
            ? "Cancel"
            : "+ Add Order"}

        </button>


        {/* ADD ORDER FORM */}

        {showOrderForm && (

          <div className="order-form">


            <select
              value={orderMedicine}
              onChange={(e) =>
                setOrderMedicine(e.target.value)
              }
            >

              <option value="">
                Select Medicine
              </option>


              {medicines.map((medicine) => (

                <option
                  key={medicine._id}
                  value={medicine._id}
                >
                  {medicine.name}
                </option>

              ))}

            </select>


            <input
              type="number"
              min="1"
              placeholder="Quantity needed"
              value={orderQuantity}
              onChange={(e) =>
                setOrderQuantity(e.target.value)
              }
            />


            <button onClick={addImportantOrder}>
              Add Order
            </button>


          </div>

        )}


        {/* IMPORTANT ORDER LIST */}

        {importantOrders.length === 0 ? (

          <p>
            No important orders.
          </p>

        ) : (

          importantOrders.map((order) => (

            <div
              className="important-order"
              key={order._id}
            >

              <h3>
                {order.medicine.name}
              </h3>


              <p>
                Quantity Needed:{" "}
                {order.quantityNeeded}
              </p>


              <p>
  Status:{" "}
  {order.status === "completed"
    ? "✅ Completed"
    : order.status === "in_stock"
    ? "📦 In Stock"
    : "🛒 Need to Buy"}
</p>

<p>
  Current Stock: {order.currentStock}
</p>

<button
  onClick={() => deleteImportantOrder(order._id)}
>
  🗑️ Delete
</button>

            </div>

          ))

        )}

      </section>


      {/* ADD MEDICINE */}

      <section className="add-section">

        <h2>Add Medicine</h2>


        <form
          onSubmit={addMedicine}
          className="medicine-form"
        >

          <input
            type="text"
            name="name"
            placeholder="Medicine name"
            value={form.name}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="genericName"
            placeholder="Generic name"
            value={form.genericName}
            onChange={handleChange}
          />


          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />


          <input
            type="number"
            name="minimumStock"
            placeholder="Minimum stock"
            value={form.minimumStock}
            onChange={handleChange}
            min="0"
          />


          <input
            type="number"
            name="sellingPrice"
            placeholder="Selling price"
            value={form.sellingPrice}
            onChange={handleChange}
            min="0"
            required
          />


          <button type="submit">
            Add Medicine
          </button>


        </form>

      </section>


      {/* SHOW ALL BATCHES */}

      <button
        onClick={() =>
          setShowAllBatches(!showAllBatches)
        }
      >

        {showAllBatches
          ? "Hide Empty Batches"
          : "Show All Batches"}

      </button>


      {/* SEARCH */}

      <section className="search-section">

        <h2>
          Check Medicine Availability
        </h2>


        <MedicineSearch
          search={search}
          setSearch={setSearch}
        />

      </section>


      {/* INVENTORY */}

      <section className="medicine-list">

        <h2>Inventory</h2>


        {medicines.length === 0 ? (

          <p>
            No medicines found.
          </p>

        ) : (

          <div className="medicine-grid">

            {medicines.map((medicine) => (

              <MedicineCard
                key={medicine._id}
                medicine={medicine}
                refreshMedicines={getMedicines}
              />

            ))}

          </div>

        )}

      </section>


    </div>

  );

}



function MedicineCard({
  medicine,
  refreshMedicines
}) {


  const [quantity, setQuantity] = useState(1);


  const [editingMedicine, setEditingMedicine] =
    useState(false);


  const [editingBatch, setEditingBatch] =
    useState(null);


  const [showBatchForm, setShowBatchForm] =
    useState(false);


  // MEDICINE EDIT FORM

  const [medicineForm, setMedicineForm] =
    useState({

      name: medicine.name,

      genericName:
        medicine.genericName || "",

      category:
        medicine.category || "",

      minimumStock:
        medicine.minimumStock,

      sellingPrice:
        medicine.sellingPrice

    });


  // BATCH FORM

  const [batchForm, setBatchForm] =
    useState({

      batchNumber: "",

      quantity: "",

      purchasePrice: "",

      expiryDate: "",

      supplier: ""

    });


  // HANDLE MEDICINE EDIT

  const handleMedicineChange = (e) => {

    setMedicineForm({

      ...medicineForm,

      [e.target.name]: e.target.value

    });

  };


  // HANDLE BATCH EDIT

  const handleBatchChange = (e) => {

    setBatchForm({

      ...batchForm,

      [e.target.name]: e.target.value

    });

  };


  // UPDATE MEDICINE

  const updateMedicine = async () => {

    try {

      const response = await fetch(

        `http://localhost:5000/api/medicines/${medicine._id}`,

        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            ...medicineForm,

            minimumStock:
              Number(
                medicineForm.minimumStock
              ),

            sellingPrice:
              Number(
                medicineForm.sellingPrice
              )

          })

        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert(
        "Medicine updated successfully"
      );


      setEditingMedicine(false);


      refreshMedicines();


    } catch (error) {

      alert("Something went wrong");

    }

  };


  // START EDIT BATCH

  const startEditBatch = (batch) => {

    setEditingBatch(batch._id);


    setBatchForm({

      batchNumber:
        batch.batchNumber,

      quantity:
        batch.quantity,

      purchasePrice:
        batch.purchasePrice,

      expiryDate:
        batch.expiryDate
          ? batch.expiryDate.substring(0, 10)
          : "",

      supplier:
        batch.supplier || ""

    });

  };


  // UPDATE BATCH

  const updateBatch = async () => {

    try {

      const response = await fetch(

        `http://localhost:5000/api/medicines/${medicine._id}/batches/${editingBatch}`,

        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            ...batchForm,

            quantity:
              Number(
                batchForm.quantity
              ),

            purchasePrice:
              Number(
                batchForm.purchasePrice
              )

          })

        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert(
        "Batch updated successfully"
      );


      setEditingBatch(null);


      refreshMedicines();


    } catch (error) {

      alert("Something went wrong");

    }

  };


  // ADD NEW BATCH

  const addBatch = async () => {

    try {

      const response = await fetch(

        `http://localhost:5000/api/medicines/${medicine._id}/batches`,

        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            ...batchForm,

            quantity:
              Number(
                batchForm.quantity
              ),

            purchasePrice:
              Number(
                batchForm.purchasePrice
              )

          })

        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert(
        "Batch added successfully"
      );


      setBatchForm({

        batchNumber: "",

        quantity: "",

        purchasePrice: "",

        expiryDate: "",

        supplier: ""

      });


      setShowBatchForm(false);


      refreshMedicines();


    } catch (error) {

      alert("Something went wrong");

    }

  };


  // SELL MEDICINE

  const sellMedicine = async () => {

    try {

      const response = await fetch(

        `http://localhost:5000/api/medicines/${medicine._id}/sell`,

        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            quantity:
              Number(quantity)

          })

        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert(
        "Medicine sold successfully"
      );


      refreshMedicines();


    } catch (error) {

      alert("Something went wrong");

    }

  };


  const totalStock =
    medicine.totalStock;


  const isAvailable =
    totalStock > 0;


  const isLowStock =
    totalStock <= medicine.minimumStock &&
    totalStock > 0;

// DELETE MEDICINE
const deleteMedicine = async () => {
  const confirmed = window.confirm(
    `⚠️ WARNING!\n\nAre you sure you want to delete "${medicine.name}"?\n\nThis will also delete all batches of this medicine.\n\nThis action cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/medicines/${medicine._id}`,
      {
        method: "DELETE"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Medicine deleted successfully");

    refreshMedicines();

  } catch (error) {
    alert("Something went wrong");
  }
};


  return (

    <div className="medicine-card">


      {/* MEDICINE INFORMATION */}

      <h3>
        {medicine.name}
      </h3>


      <p>
        Generic:{" "}
        {medicine.genericName || "N/A"}
      </p>


      <p>
        Category:{" "}
        {medicine.category || "N/A"}
      </p>


      <p>
        Price: ₹
        {medicine.sellingPrice}
      </p>


      <div className="stock">


        {isAvailable ? (

          <span className="available">
            ✅ Available
          </span>

        ) : (

          <span className="unavailable">
            ❌ Out of Stock
          </span>

        )}


        <strong>
          Total Stock: {totalStock}
        </strong>


      </div>


      {isLowStock && (

        <p className="low-stock">
          ⚠️ Low Stock
        </p>

      )}


      {/* EDIT MEDICINE */}

      {!editingMedicine && (

        <button
          className="edit-button"
          onClick={() =>
            setEditingMedicine(true)
          }
        >
          ✏️ Edit Medicine
        </button>

      )}


      {editingMedicine && (

        <div className="edit-form">

          <h4>
            Edit Medicine
          </h4>


          <label>
            Medicine Name
          </label>


          <input
            type="text"
            name="name"
            value={medicineForm.name}
            onChange={handleMedicineChange}
          />


          <label>
            Generic Name
          </label>


          <input
            type="text"
            name="genericName"
            value={medicineForm.genericName}
            onChange={handleMedicineChange}
          />


          <label>
            Category
          </label>


          <input
            type="text"
            name="category"
            value={medicineForm.category}
            onChange={handleMedicineChange}
          />


          <label>
            Low Stock Alert
          </label>


          <input
            type="number"
            name="minimumStock"
            value={medicineForm.minimumStock}
            onChange={handleMedicineChange}
            min="0"
          />


          <label>
            Selling Price (₹)
          </label>


          <input
            type="number"
            name="sellingPrice"
            value={medicineForm.sellingPrice}
            onChange={handleMedicineChange}
            min="0"
          />


          <div className="edit-buttons">

            <button
              onClick={updateMedicine}
            >
              Save Changes
            </button>


            <button
              onClick={() =>
                setEditingMedicine(false)
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* DELETE MEDICINE */}

<button
  className="delete-button"
  onClick={deleteMedicine}
>
  ⚠️ Delete Medicine
</button>


      {/* BATCHES */}

      <div className="batches">

        <h4>
          Batches
        </h4>


        {medicine.batches.length === 0 ? (

          <p>
            No batches added.
          </p>

        ) : (

          medicine.batches.map(
            (batch) => (

              <div
                className="batch"
                key={batch._id}
              >


                {editingBatch === batch._id ? (

                  <div className="edit-form">

                    <h4>
                      Edit Batch
                    </h4>


                    <label>
                      Batch Number
                    </label>


                    <input
                      type="text"
                      name="batchNumber"
                      value={batchForm.batchNumber}
                      onChange={handleBatchChange}
                    />


                    <label>
                      Quantity
                    </label>


                    <input
                      type="number"
                      name="quantity"
                      value={batchForm.quantity}
                      onChange={handleBatchChange}
                      min="0"
                    />


                    <label>
                      Purchase Price (₹)
                    </label>


                    <input
                      type="number"
                      name="purchasePrice"
                      value={batchForm.purchasePrice}
                      onChange={handleBatchChange}
                      min="0"
                    />


                    <label>
                      Expiry Date
                    </label>


                    <input
                      type="date"
                      name="expiryDate"
                      value={batchForm.expiryDate}
                      onChange={handleBatchChange}
                    />


                    <label>
                      Supplier
                    </label>


                    <input
                      type="text"
                      name="supplier"
                      value={batchForm.supplier}
                      onChange={handleBatchChange}
                    />


                    <div className="edit-buttons">

                      <button
                        onClick={updateBatch}
                      >
                        Save Changes
                      </button>


                      <button
                        onClick={() =>
                          setEditingBatch(null)
                        }
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                ) : (

                  <>

                    <p>
                      <strong>
                        Batch:
                      </strong>{" "}
                      {batch.batchNumber}
                    </p>


                    <p>
                      Stock:{" "}
                      {batch.quantity}
                    </p>


                    <p>
                      Expiry:{" "}

                      {new Date(
                        batch.expiryDate
                      ).toLocaleDateString()}

                    </p>


                    <p>
                      Supplier:{" "}

                      {batch.supplier ||
                        "N/A"}

                    </p>


                    <button
                      className="edit-button"
                      onClick={() =>
                        startEditBatch(batch)
                      }
                    >
                      ✏️ Edit Batch
                    </button>

                  </>

                )}

              </div>

            )
          )

        )}

      </div>


      {/* ADD NEW BATCH */}

      <button
        onClick={() =>
          setShowBatchForm(
            !showBatchForm
          )
        }
      >

        {showBatchForm
          ? "Cancel"
          : "Add New Batch"}

      </button>


      {showBatchForm && (

        <div className="batch-form">


          <input
            type="text"
            name="batchNumber"
            placeholder="Batch number"
            value={batchForm.batchNumber}
            onChange={handleBatchChange}
          />


          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={batchForm.quantity}
            onChange={handleBatchChange}
            min="1"
          />


          <input
            type="number"
            name="purchasePrice"
            placeholder="Purchase price"
            value={batchForm.purchasePrice}
            onChange={handleBatchChange}
            min="0"
          />


          <input
            type="date"
            name="expiryDate"
            value={batchForm.expiryDate}
            onChange={handleBatchChange}
          />


          <input
            type="text"
            name="supplier"
            placeholder="Supplier"
            value={batchForm.supplier}
            onChange={handleBatchChange}
          />


          <button onClick={addBatch}>
            Save Batch
          </button>


        </div>

      )}


      {/* SELL */}

      {isAvailable && (

        <div className="sell-box">


          <input
            type="number"
            min="1"
            max={totalStock}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                e.target.value
              )
            }
          />


          <button
            onClick={sellMedicine}
          >
            Sell
          </button>


        </div>

      )}

    </div>

  );

}


export default Inventory;