import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalLinks, setTotalLinks] = useState(0);
  const [dateWiseLinks, setDateWiseLinks] = useState([]);
  const [deviceWiseLinks, setDeviceWiseLinks] = useState({
    mobile: 0,
    desktop: 0,
    tablet: 0,
  });
  const [links, setLinks] = useState([]);

  const processLinks = useCallback((linksData) => {
    // Update total links
    setTotalLinks(linksData.length);
  
    // Process date-wise links with accumulated counts
    const linksByDate = linksData.reduce((acc, link) => {
      const date = new Date(link.createdAt).toLocaleDateString("en-US");
      acc[date] = (acc[date] || 0) + 1; // Count links per date
      return acc;
    }, {});
  
    // Convert to array and sort by date (oldest to newest)
    const sortedDates = Object.entries(linksByDate)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]));
  
    // Calculate running total
    let runningTotal = 0;
    const dateWiseArray = sortedDates.map(([date, count]) => {
      runningTotal += count;
      return {
        date,
        count: runningTotal // Use accumulated total
      };
    });
  
    dateWiseArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    setDateWiseLinks(dateWiseArray);

    // Process device-wise links
    const linksByDevice = linksData.reduce(
      (acc, link) => {
        let device = (link.analytics?.device || "Desktop").toLowerCase();
        if (device.includes("mobile")) device = "mobile";
        else if (device.includes("tablet")) device = "tablet";
        else device = "desktop";
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      },
      { mobile: 0, desktop: 0, tablet: 0 }
    );

    setDeviceWiseLinks(linksByDevice);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLinks([]);
        setTotalLinks(0);
        setDateWiseLinks([]);
        setDeviceWiseLinks({ mobile: 0, desktop: 0, tablet: 0 });
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/links`,
        {
          headers: {
            "user-id": userId,
          },
        }
      );

      setLinks(response.data);
      processLinks(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLinks([]);
      setTotalLinks(0);
      setDateWiseLinks([]);
      setDeviceWiseLinks({ mobile: 0, desktop: 0, tablet: 0 });
    }
  }, [processLinks]);

  useEffect(() => {
    fetchDashboardData();

    const handleRefresh = () => {
      fetchDashboardData();
    };

    const handleLinkCreated = (event) => {
      // Immediately update the local state with the new link
      setLinks((prevLinks) => {
        const newLinks = [...prevLinks, event.detail];
        processLinks(newLinks);
        return newLinks;
      });
    };

    window.addEventListener("refreshDashboard", handleRefresh);
    window.addEventListener("linkCreated", handleLinkCreated);

    return () => {
      window.removeEventListener("refreshDashboard", handleRefresh);
      window.removeEventListener("linkCreated", handleLinkCreated);
    };
  }, [fetchDashboardData, processLinks]);
  
//BRAMHANANDA K L

  return (
    <>
      <div className="total-links">
        <h2>
          Total Clicks <span>{totalLinks}</span>
        </h2>
      </div>
      <div className="charts">
        <div className="chart date-wise">
          <h3>Date-wise Clicks</h3>
          <ul className="chart-bars">
            {dateWiseLinks.map((item) => (
              <li key={item.date}>
                <span className="date">{item.date}</span>
                <div className="bar">
                  <span
                    style={{
                      display: "inline-block",
                      width: `${item.count}%`,
                      backgroundColor: "blue",
                      height: "10px",
                    }}
                  ></span>
                </div>
                <span className="count">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="chart devices">
          <h3>Click Devices</h3>
          <ul className="chart-bars">
            {Object.entries(deviceWiseLinks).map(([device, count]) => (
              <li key={device}>
                <span className="device">
                  {device.charAt(0).toUpperCase() + device.slice(1)}
                </span>
                <div className="bar">
                  <span
                    style={{
                      display: "inline-block",
                      width: `${count}%`,
                      backgroundColor: "blue",
                      height: "10px",
                    }}
                  ></span>
                </div>
                <span className="count">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
