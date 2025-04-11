"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

interface Customer {
  name: string;
  vehicleNumber: string;
  scanDate: string;
  scannedBy: string;
}

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(["Tất cả"]);
  const [vehicleOptions, setVehicleOptions] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer; direction: "asc" | "desc" } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("https://api2.travel.com.vn/auto/webhook/checkin-result?session=1");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data: Customer[] = await response.json();
        setCustomers(data);
        setFilteredCustomers(data); // Initialize filtered list

        // Extract unique vehicle numbers
        const uniqueVehicles = Array.from(new Set(data.map((customer) => customer.vehicleNumber)));
        setVehicleOptions(["Tất cả", ...uniqueVehicles]); // Add "Tất cả" option
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search term and selected vehicles
  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearchTerm = customer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVehicle =
        selectedVehicles.includes("Tất cả") || selectedVehicles.includes(customer.vehicleNumber);
      return matchesSearchTerm && matchesVehicle;
    });

    // Apply sorting
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, selectedVehicles, customers, sortConfig]);

  // Handle vehicle selection
  const handleVehicleChange = (vehicle: string) => {
    if (vehicle === "Tất cả") {
      setSelectedVehicles(["Tất cả"]); // Select all
    } else {
      setSelectedVehicles((prev) => {
        const newSelection = prev.includes(vehicle)
          ? prev.filter((v) => v !== vehicle) // Remove if already selected
          : [...prev.filter((v) => v !== "Tất cả"), vehicle]; // Add and remove "Tất cả" if necessary
        return newSelection;
      });
    }
  };

  // Handle sorting
  const handleSort = (key: keyof Customer) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        // Toggle direction if the same column is clicked
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      // Default to ascending order
      return { key, direction: "asc" };
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Danh sách khách hàng đã quét QR thành công</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Tìm kiếm theo tên..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {/* Custom Dropdown for Vehicle Filter */}
      <div className={styles.dropdownContainer}>
        <button
          className={styles.dropdownButton}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          Chọn số xe
        </button>
        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            {vehicleOptions.map((vehicle) => (
              <label key={vehicle} className={styles.dropdownOption}>
                <input
                  type="checkbox"
                  value={vehicle}
                  checked={selectedVehicles.includes(vehicle)}
                  onChange={() => handleVehicleChange(vehicle)}
                />
                {vehicle}
              </label>
            ))}
          </div>
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr className={styles.tableRow}>
            <th className={styles.tableHeader} onClick={() => handleSort("name")}>
              Tên {sortConfig?.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className={styles.tableHeader} onClick={() => handleSort("vehicleNumber")}>
              Số xe {sortConfig?.key === "vehicleNumber" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className={styles.tableHeader} onClick={() => handleSort("scanDate")}>
              Ngày quét {sortConfig?.key === "scanDate" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className={styles.tableHeader} onClick={() => handleSort("scannedBy")}>
              Người quét {sortConfig?.key === "scannedBy" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>{customer.name}</td>
                <td className={styles.tableCell}>{customer.vehicleNumber}</td>
                <td className={styles.tableCell}>{customer.scanDate}</td>
                <td className={styles.tableCell}>{customer.scannedBy}</td>
              </tr>
            ))
          ) : (
            <tr className={styles.tableRow}>
              <td colSpan={4} className={styles.tableCell} style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}