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
  const username = localStorage.getItem("username") || "";

  const [links, setLinks] = useState(() => {
    try {
      const storedLinks = localStorage.getItem(`${username}_links`);
      return storedLinks ? JSON.parse(storedLinks) : [];
    } catch (error) {
      console.error("Error loading links from localStorage:", error);
      return [];
    }
  });
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showCopyModal, setShowCopyModal] = useState(false);

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

  const sortedLinks = [...currentLinks].sort((a, b) => {
    if (sortConfig.key === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.key === "status") {
      const statusA = a.status.toLowerCase();
      const statusB = b.status.toLowerCase();
      if (statusA < statusB) return sortConfig.direction === "asc" ? -1 : 1;
      if (statusA > statusB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  useImperativeHandle(ref, () => ({
    addNewLink: handleCreateLink,
  }));

  const generateShortLink = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 6;
    let randomString = "";
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return `http://localhost:5000/${randomString}`;
  };

  const isLinkActive = (expirationDate) => {
    if (!expirationDate) return true;
    return new Date(expirationDate) > new Date();
  };

  const formatDateTime = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date)
      .toLocaleString("en-US", options)
      .replace(/ AM| PM/, "");
  };

  const location = useLocation();
  const searchTerm = location.state?.searchTerm || "";

  useEffect(() => {
    const storedLinks =
      JSON.parse(localStorage.getItem(`${username}_links`)) || [];
    setLinks(storedLinks);
    if (location.state?.fromSearch && searchTerm) {
      setTimeout(() => {
        const searchResult = storedLinks.find((link) =>
          link.remarks.includes(searchTerm)
        );
        if (searchResult) {
          const element = document.querySelector(
            `tr[data-id="${searchResult.id}"]`
          );
          if (element) {
            element.classList.add("highlight");
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            const rowIndex =
              Array.from(element.parentNode.children).indexOf(element) + 1;
            alert(`"${searchTerm}" ->  found in  ${rowIndex} row`);
          }
        } else {
          alert(`"${searchTerm}" -> not found!`);
        }
      }, 0); // Delay to ensure navigation completes before executing search logic
    }
    // Clear the state after handling the search
    return () => {
      if (location.state?.fromSearch) {
        location.state.fromSearch = false;
      }
    };
  }, [username, searchTerm, location.state?.fromSearch, location.state]);

  const getDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
      return "Tablet";
    } else if (
      /mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(
        userAgent
      )
    ) {
      return "Mobile";
    }
    return "Desktop";
  };

  const handleCreateLink = async (linkData) => {
    try {
      const ipResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/ip`
      );
      const userIp = ipResponse.data.ip;

      const newLink = {
        id: Date.now(),
        date: formatDateTime(new Date()),
        originalLink: linkData.destinationUrl,
        remarks: linkData.remarks,
        clicks: 0,
        status:
          linkData.linkExpiration && linkData.expirationDate
            ? isLinkActive(linkData.expirationDate)
              ? "Active"
              : "Inactive"
            : "Active",
        expirationDate: linkData.expirationDate,
        ipAddress: userIp,
        device: getDeviceType(),
      };

      // Create link in backend first
      const response = await axios.post(
        `https://mini-link-management-platform-server.vercel.app/api/links/create`,
        {
          originalLink: linkData.destinationUrl,
          remarks: linkData.remarks,
          expirationDate: linkData.expirationDate,
        }
      );

      if (!response.data || !response.data.link) {
        throw new Error("Invalid response from server");
      }

      const updatedLink = {
        ...newLink,
        shortLink: response.data.link.shortLink,
      };

      // Update state only after successful backend operation
      setLinks((prevLinks) => {
        try {
          const newLinks = [updatedLink, ...prevLinks];
          // Use try-catch for localStorage
          try {
            localStorage.setItem(`${username}_links`, JSON.stringify(newLinks));
          } catch (storageError) {
            console.error("localStorage error:", storageError);
          }
          return newLinks;
        } catch (error) {
          console.error("State update error:", error);
          return prevLinks; // Keep previous state on error
        }
      });

      // Close modal only after successful update
      setShowCreateLink(false);
    } catch (error) {
      console.error("Link Creation Error:", error);
      alert("Error creating link. Please try again.");
    }
  };

  const handleEdit = (link) => {
    setEditingLink({
      ...link,
      destinationUrl: link.originalLink, // Map for CreateLink component
    });
    setShowCreateLink(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setLinks((prevLinks) => {
      const updatedLinks = prevLinks.filter((link) => link.id !== deleteId);
      localStorage.setItem(`${username}_links`, JSON.stringify(updatedLinks));
      return updatedLinks;
    });
    setShowDeleteModal(false);
  };

  const handleUpdate = (updatedData) => {
    const updatedLinks = links.map((link) =>
      link.id === editingLink.id
        ? {
            ...link,
            originalLink: updatedData.destinationUrl,
            remarks: updatedData.remarks,
            expirationDate: updatedData.expirationDate,
            status:
              updatedData.linkExpiration && updatedData.expirationDate
                ? isLinkActive(updatedData.expirationDate)
                  ? "Active"
                  : "Inactive"
                : "Active",
          }
        : link
    );
    setLinks(updatedLinks);
    localStorage.setItem(`${username}_links`, JSON.stringify(updatedLinks));
    setShowCreateLink(false);
    setEditingLink(null);
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
      // Extract the shortUrl from the full shortLink
      const shortUrl = shortLink.replace("http://localhost:5000/", "");

      // First, increment the click in the database
      const response = await axios.get(
        `https://mini-link-management-platform-server.vercel.app/api/links/click/${shortUrl}`   
      );

      // Update click count in local state regardless of link status
      setLinks((prevLinks) => {
        const updatedLinks = prevLinks.map((link) =>
          link.shortLink === shortLink
            ? { ...link, clicks: (link.clicks || 0) + 1 }
            : link
        );
        localStorage.setItem(`${username}_links`, JSON.stringify(updatedLinks));
        return updatedLinks;
      });

      // Open the destination URL in a new tab if link is active
      if (response.data.destinationUrl) {
        window.open(response.data.destinationUrl, "_blank");
      }
    } catch (error) {
      console.error("Failed to fetch destination URL:", error);
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

  // Modified useEffect for deployment
  useEffect(() => {
    let isComponentMounted = true;

    const fetchLinks = async () => {
      try {
        // Get links from backend
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/links`   
        );  // while deploying frontend add backend deploy url

        if (!isComponentMounted) return;

        if (response.data) {
          setLinks((prevLinks) => {
            const updatedLinks = prevLinks.map((link) => {
              const dbLink = response.data.find(
                (l) => l.shortLink === link.shortLink
              );
              return dbLink ? { ...link, clicks: dbLink.clicks || 0 } : link;
            });

            try {
              localStorage.setItem(
                `${username}_links`,
                JSON.stringify(updatedLinks)
              );
            } catch (storageError) {
              console.error("localStorage error:", storageError);
            }

            return updatedLinks;
          });
        }
      } catch (error) {
        console.error("Failed to fetch links:", error);
      }
    };

    fetchLinks();
    const interval = setInterval(fetchLinks, 3000);

    return () => {
      isComponentMounted = false;
      clearInterval(interval);
    };
  }, [username]);

  // Add error boundary
  if (!Array.isArray(links)) {
    return <div>Loading links...</div>;
  }

  return (
    <div className="links-container">
      <table className="links-table">
        <thead>
          <tr>
            <th
              style={{
                width: "14.28%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              onClick={() => handleSort("date")}
            >
              Date{" "}
              <img
                id="date"
                src="/assets/links-page-icons/dropdown.png"
                alt="option"
              />
            </th>
            <th
              style={{
                width: "14.28%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              className="original-link"
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
              style={{
                width: "14.28%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              onClick={() => handleSort("status")}
            >
              Status{" "}
              <img src="/assets/links-page-icons/dropdown.png" alt="option" />
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
          {currentLinks.map((link) => (
            <tr
              key={link.id}
              data-id={link.id}
              className={link.remarks.includes(searchTerm) ? "highlight" : ""}
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
                {link.originalLink}
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
                className={
                  link.status === "Active" ? "status-active" : "status-inactive"
                }
              >
                {link.status}
              </td>
              <td
                style={{
                  width: "14.28%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <button className="edit-btn" onClick={() => handleEdit(link)}>
                  <img src="/assets/links-page-icons/edit.png" alt="edit" />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(link.id)}
                >
                  <img src="/assets/links-page-icons/delete.png" alt="delete" />
                </button>
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
