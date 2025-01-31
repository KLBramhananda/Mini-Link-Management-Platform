import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import "./Links.css";
import CreateLink from "../Create-link";
import { useLocation } from "react-router-dom";

const Links = forwardRef((props, ref) => {
  const [links, setLinks] = useState([]);
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const username = localStorage.getItem("username") || "";
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 10;

  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = links.slice(indexOfFirstLink, indexOfLastLink);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(links.length / linksPerPage))
    );
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedLinks = React.useMemo(() => {
    console.log("Sorting links:", currentLinks); // Debug log
    return [...currentLinks].sort((a, b) => {
      if (sortConfig.key === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortConfig.key === "status") {
        const statusOrder = { Active: 1, Inactive: 2 };
        const orderA = statusOrder[a.status];
        const orderB = statusOrder[b.status];
        return sortConfig.direction === "asc"
          ? orderA - orderB
          : orderB - orderA;
      }
      return 0;
    });
  }, [currentLinks, sortConfig]);

  useImperativeHandle(ref, () => ({
    addNewLink: handleCreateLink,
  }));

  const isLinkActive = (expirationDate) => {
    if (!expirationDate) return true;
    return new Date(expirationDate) > new Date();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const location = useLocation();
  const searchTerm = location.state?.searchTerm || "";

  useEffect(() => {
    const fetchAndSearch = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/links`,
          {
            headers: {
              "user-id": userId,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          const formattedLinks = response.data.map((link) => ({
            ...link,
            date: formatDateTime(link.createdAt),
          }));
          setLinks(formattedLinks);

          // Handle search if coming from search
          if (location.state?.fromSearch && searchTerm) {
            const searchResult = formattedLinks.find((link) =>
              link.remarks.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (searchResult) {
              // Calculate which page the result is on
              const resultIndex = formattedLinks.indexOf(searchResult);
              const targetPage = Math.floor(resultIndex / linksPerPage) + 1;

              // Set the current page to show the result
              setCurrentPage(targetPage);

              // Wait for next render cycle
              setTimeout(() => {
                const element = document.querySelector(
                  `tr[data-id="${searchResult._id}"]`
                );
                if (element) {
                  element.classList.add("highlight");
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  const rowIndex = (resultIndex % linksPerPage) + 1;
                  alert(
                    `"${searchTerm}" found in row ${rowIndex} of page ${targetPage}`
                  );
                }
              }, 100);
            } else {
              alert(`"${searchTerm}" not found in Links table!`);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching links:", error);
        setLinks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSearch();
  }, [userId, searchTerm, location.state?.fromSearch, linksPerPage]);

  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) {
      return "Mobile";
    } else if (/tablet/i.test(userAgent)) {
      return "Tablet";
    } else if (/ipad/i.test(userAgent)) {
      return "iPad";
    } else if (/android/i.test(userAgent)) {
      return "Android";
    } else if (/win/i.test(userAgent)) {
      return "Desktop";
    } else if (/mac/i.test(userAgent)) {
      return "Mac";
    } else if (/linux/i.test(userAgent)) {
      return "Linux";
    } else {
      return "Desktop";
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("Retrieved userId from localStorage:", storedUserId);

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("No userId found in localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchLinks = async () => {
      if (!userId) {
        console.log("No userId available, skipping fetch");
        setLinks([]); // Clear links if no userId
        setIsLoading(false);
        return;
      }

      try {
        if (isInitialLoad) {
          setIsLoading(true);
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/links`,
          {
            headers: {
              "user-id": userId,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          const formattedLinks = response.data.map((link) => ({
            ...link,
            date: formatDateTime(link.createdAt),
          }));
          setLinks(formattedLinks);
          if (isInitialLoad) {
            setIsInitialLoad(false);
          }
        }
      } catch (error) {
        console.error("Error fetching links:", error.response?.data || error);
        setLinks([]); // Clear links on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
    const interval = setInterval(fetchLinks, 10000);
    return () => clearInterval(interval);
  }, [userId, isInitialLoad]);

  useEffect(() => {
    console.log("Current links state:", links);
  }, [links]);

  const handleCreateLink = async (linkData) => {
    try {
      const userId = localStorage.getItem("userId");

      console.log("Creating link with data:", linkData);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/links/create`,
        {
          originalLink: linkData.originalLink,
          remarks: linkData.remarks,
          expirationDate: linkData.expirationDate,
          device: linkData.device,
          ipAddress: linkData.ipAddress,
        },
        {
          headers: {
            "user-id": userId,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Link created successfully:", response.data);

      // Add new link to the beginning of the array
      setLinks((prevLinks) => [response.data.link, ...prevLinks]);

      // Refresh the dashboard
      window.dispatchEvent(new Event("refreshDashboard"));
    } catch (error) {
      console.error("Link Creation Error:", error.response?.data || error);
    }
  };

  const handleEdit = (link) => {
    console.log("Editing link:", link);
    setEditingLink({
      _id: link._id,
      destinationUrl: link.originalLink,
      remarks: link.remarks,
      linkExpiration: !!link.expirationDate,
      expirationDate: link.expirationDate
        ? new Date(link.expirationDate).toISOString().slice(0, 16)
        : null,
      shortLink: link.shortLink,
    });
    setShowCreateLink(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/links/${deleteId}`,
        {
          headers: {
            "user-id": userId,
          },
        }
      );

      setLinks((prevLinks) =>
        prevLinks.filter((link) => link._id !== deleteId)
      );
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      console.log("Sending update with data:", updatedData);

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/links/${editingLink._id}`,
        {
          originalLink: updatedData.destinationUrl,
          remarks: updatedData.remarks,
          expirationDate: updatedData.expirationDate,
        },
        {
          headers: {
            "user-id": userId,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        // Update the link in the local state
        setLinks((prevLinks) =>
          prevLinks.map((link) =>
            link._id === editingLink._id
              ? {
                  ...link,
                  originalLink: updatedData.destinationUrl,
                  remarks: updatedData.remarks,
                  expirationDate: updatedData.expirationDate,
                  status: updatedData.expirationDate
                    ? new Date(updatedData.expirationDate) > new Date()
                      ? "Active"
                      : "Inactive"
                    : "Active",
                }
              : link
          )
        );

        setShowCreateLink(false);
        setEditingLink(null);
      }
    } catch (error) {
      console.error("Update Error:", error.response?.data || error);
    }
  };

  const handleCopyLink = async (shortLink) => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setShowCopyModal(true);
      setTimeout(() => setShowCopyModal(false), 2000); // Hide modal after 2 seconds
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleLinkClick = async (shortLink) => {
    try {
      // Optimistically update the click count immediately
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.shortLink === shortLink
            ? { ...link, clicks: (link.clicks || 0) + 1 }
            : link
        )
      );

      // Then make the API call
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/links/click/${shortLink}`
      );

      // Open the original URL in a new tab
      window.open(response.data.destinationUrl, "_blank");
    } catch (error) {
      // If the API call fails, revert the optimistic update
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link.shortLink === shortLink
            ? { ...link, clicks: (link.clicks || 0) - 1 }
            : link
        )
      );
      console.error("Failed to handle link click:", error);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Update status based on expiration date
  useEffect(() => {
    const interval = setInterval(() => {
      setLinks((prevLinks) =>
        prevLinks.map((link) => ({
          ...link,
          status: link.expirationDate
            ? isLinkActive(link.expirationDate)
              ? "Active"
              : "Inactive"
            : "Active",
        }))
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (isInitialLoad && isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading links...</div>
      </div>
    );
  }

  return (
    <div className="links-container">
      <table className="links-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("date")}
              style={{ cursor: "pointer" }}
            >
              Date{" "}
              <img
                src="/assets/links-page-icons/dropdown.png"
                alt="option"
                style={{
                  transform:
                    sortConfig.key === "date" && sortConfig.direction === "desc"
                      ? "rotate(180deg)"
                      : "none",
                  transition: "transform 0.3s",
                }}
              />
            </th>
            <th
              style={{
                width: "14.28%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Original Link
            </th>
            <th
              style={{
                width: "14.28%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Short Link
            </th>
            <th
              style={{
                width: "14.28%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Remarks
            </th>
            <th
              style={{
                width: "14.28%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              className="clicks"
            >
              Clicks
            </th>
            <th
              onClick={() => handleSort("status")}
              style={{ cursor: "pointer" }}
            >
              Status{" "}
              <img
                src="/assets/links-page-icons/dropdown.png"
                alt="option"
                style={{
                  transform:
                    sortConfig.key === "status" &&
                    sortConfig.direction === "desc"
                      ? "rotate(180deg)"
                      : "none",
                  transition: "transform 0.3s",
                }}
              />
            </th>
            <th
              style={{
                width: "14.28%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedLinks.map((link) => (
            <tr
              key={link._id}
              data-id={link._id}
              className={
                searchTerm &&
                link.remarks.toLowerCase().includes(searchTerm.toLowerCase())
                  ? "highlight"
                  : ""
              }
            >
              <td
                style={{
                  width: "14.28%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {link.date}
              </td>
              <td
                style={{
                  width: "14.28%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                className="original-link"
              >
                {link.originalLink.replace(/^https?:\/\//, "")}
              </td>
              <td
                style={{
                  width: "14.28%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                className="short-link"
              >
                <span
                  className="text-content"
                  onClick={() => handleLinkClick(link.shortLink)}
                  style={{ cursor: "pointer" }}
                >
                  {link.shortLink}
                </span>
                <button
                  className="copy-button"
                  onClick={() => handleCopyLink(link.shortLink)}
                >
                  <img
                    src="/assets/links-page-icons/copy-icon.png"
                    alt="copy"
                  />
                </button>
              </td>
              <td
                style={{
                  width: "14.28%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                className="remarks"
              >
                {link.remarks}
              </td>
              <td
                style={{
                  width: "14.28%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                className="clicks"
              >
                {link.clicks || 0}
              </td>
              <td
                style={{
                  width: "14.28%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                className={`status-${(link.status || "active").toLowerCase()}`}
              >
                {link.status || "Active"}
              </td>
              <td
                style={{
                  width: "14.28%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <img
                  src="/assets/links-page-icons/edit.png"
                  alt="edit"
                  onClick={() => handleEdit(link)}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                />
                <img
                  src="/assets/links-page-icons/delete.png"
                  alt="delete"
                  onClick={() => handleDelete(link._id)}
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} className="page-arrow">
          &lt;
        </button>
        {Array.from(
          { length: Math.ceil(links.length / linksPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          )
        )}
        <button onClick={nextPage} className="page-arrow">
          &gt;
        </button>
      </div>

      {showCreateLink && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateLink
              onClose={() => {
                setShowCreateLink(false);
                setEditingLink(null);
              }}
              onSubmit={editingLink ? handleUpdate : handleCreateLink}
              initialData={editingLink}
              isEditMode={!!editingLink}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <button className="close-btn" onClick={handleCloseDeleteModal}>
              X
            </button>
            <h3>Are you sure, you want to remove it?</h3>
            <div className="delete-modal-buttons">
              <button onClick={handleCloseDeleteModal}>No</button>
              <button className="dm" onClick={confirmDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {showCopyModal && (
        <div className="copy-modal">
          <img src="/assets/copy-link.png" alt="Copy Icon" />
          <span>Link Copied</span>
        </div>
      )}
    </div>
  );
});

export default Links;
