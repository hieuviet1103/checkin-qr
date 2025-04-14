"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Customer {
  name: string;
  vehicleNumber: string;
  scanDate: string;
  scannedBy: string;
  isCheckin: boolean; // Trạng thái check-in
}

export default function CustomerCheckinPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(["Tất cả"]);
  const [vehicleOptions, setVehicleOptions] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer; direction: "asc" | "desc" } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const itemsPerPage = 50; // Số item mỗi trang

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("https://api2.travel.com.vn/auto/webhook/checkin-customer-list?session=1");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data: Customer[] = await response.json();

        // Giả lập thêm trạng thái check-in cho mỗi khách hàng
        const customersWithCheckin = data.map((customer) => ({
          ...customer//,
          //isCheckin: Math.random() > 0.5, // Random trạng thái check-in (giả lập)
        }));

        setCustomers(customersWithCheckin);
        setFilteredCustomers(customersWithCheckin); // Initialize filtered list

        // Extract unique vehicle numbers
        const uniqueVehicles = Array.from(new Set(customersWithCheckin.map((customer) => customer.vehicleNumber)));        
        setVehicleOptions(["Tất cả", ...uniqueVehicles]); // Add "Tất cả" option
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
    //setInterval(() => {fetchCustomers()}, 10000)
  }, []);

  // Filter customers based on search term and selected vehicles
  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearchTerm = customer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVehicle =
        selectedVehicles.includes("Tất cả") || selectedVehicles.includes(customer.vehicleNumber);
        //selectedVehicles2.some(d=>d.value == null) || selectedVehicles.includes(customer.vehicleNumber);
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
    if(filtered.length != customers.length){
      setCurrentPage(1); // Reset về trang đầu khi dữ liệu thay đổi
    }
    //setCurrentPage(1); // Reset về trang đầu khi dữ liệu thay đổi
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

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCustomers.slice(startIndex, endIndex);

  // Tổng số trang
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Danh sách check-in</h1>

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
          Chọn vị trí
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
                  className={styles.checkbox}
                />
                <span className={styles.checkboxLabel}>{vehicle}</span>
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
              Vị trí {sortConfig?.key === "vehicleNumber" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className={styles.tableHeader} onClick={() => handleSort("scanDate")}>
              Ngày quét {sortConfig?.key === "scanDate" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className={styles.tableHeader} onClick={() => handleSort("scannedBy")}>
              Người quét {sortConfig?.key === "scannedBy" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className={styles.tableHeader} onClick={() => handleSort("isCheckin")}>
              Đã check-in {sortConfig?.key === "isCheckin" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((customer, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>{customer.name}</td>
                <td className={styles.tableCell}>{customer.vehicleNumber}</td>
                <td className={styles.tableCell}>{customer.scanDate}</td>
                <td className={styles.tableCell}>{customer.scannedBy}</td>
                <td className={styles.tableCell}>
                  {customer.isCheckin ? "Đã check-in" : "Chưa check-in"}
                </td>
                <td className={styles.tableCell}>


                </td>
              </tr>
            ))
          ) : (
            <tr className={styles.tableRow}>
              <td colSpan={5} className={styles.tableCell} style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        
        {(() => {
          // Tạo mảng phân trang có giới hạn
          const pageNumbers = [];
          let startPage = 1;
          let endPage = totalPages;
          const showEllipsis = totalPages > 10;
          
          // Nếu số trang > 10, giới hạn hiển thị
          if (showEllipsis) {
            // Tính toán trang bắt đầu và kết thúc
            if (currentPage <= 5) {
              // Nếu trang hiện tại gần đầu
              startPage = 1;
              endPage = 8;
            } else if (currentPage + 4 >= totalPages) {
              // Nếu trang hiện tại gần cuối
              startPage = totalPages - 7;
              endPage = totalPages;
            } else {
              // Nếu trang hiện tại ở giữa
              startPage = currentPage - 3;
              endPage = currentPage + 3;
            }
          }
          
          // Luôn hiển thị trang đầu tiên
          if (showEllipsis && startPage > 1) {
            pageNumbers.push(
              <button
                key={1}
                className={`${styles.paginationButton} ${currentPage === 1 ? styles.activePage : ""}`}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
            );
            
            // Thêm dấu "..." nếu không bắt đầu từ trang 2
            if (startPage > 2) {
              pageNumbers.push(
                <span key="start-ellipsis" className={styles.paginationEllipsis}>...</span>
              );
            }
          }
          
          // Tạo nút cho các trang ở giữa
          for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
              <button
                key={i}
                className={`${styles.paginationButton} ${currentPage === i ? styles.activePage : ""}`}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </button>
            );
          }
          
          // Luôn hiển thị trang cuối cùng
          if (showEllipsis && endPage < totalPages) {
            // Thêm dấu "..." nếu không kết thúc ở trang gần cuối
            if (endPage < totalPages - 1) {
              pageNumbers.push(
                <span key="end-ellipsis" className={styles.paginationEllipsis}>...</span>
              );
            }
            
            pageNumbers.push(
              <button
                key={totalPages}
                className={`${styles.paginationButton} ${currentPage === totalPages ? styles.activePage : ""}`}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            );
          }
          
          return pageNumbers;
        })()}
        
        <button
          className={styles.paginationButton}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
}