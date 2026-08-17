import { useEffect, useState } from "react";
import { notify } from "../utils/notify";

import AnnouncementForm from "../components/AnnouncementForm";
import AnnouncementTable from "../components/AnnouncementTable";

import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  togglePinAnnouncement,
} from "../services/announcementService";

import "../styles/Announcements.css";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "General",
    audience: "Everyone",
    course: "",
    isPinned: false,
    status: "Active",
    expiresAt: "",
  });

  // ==========================
  // Load Announcements
  // ==========================

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements();
      setAnnouncements(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  });
};

 // ==========================
// Submit
// ==========================

const handleSubmit = async (e) => {
  e.preventDefault();

  const isEditing = Boolean(editingAnnouncement);

  notify.confirmAction({

    title: isEditing
      ? "Update Announcement"
      : "Publish Announcement",

    message: isEditing
      ? "Are you sure you want to update this announcement?"
      : "Are you sure you want to publish this announcement?",

    confirmText: isEditing
      ? "Update"
      : "Publish",

    cancelText: "Cancel",

    type: isEditing
      ? "info"
      : "success",

    onConfirm: async () => {

      try {

        // ==========================================
        // UPDATE
        // ==========================================

        if (editingAnnouncement) {

          await updateAnnouncement(
            editingAnnouncement._id,
            formData
          );

          notify.success(
            "Announcement updated successfully."
          );

        }

        // ==========================================
        // CREATE / PUBLISH
        // ==========================================

        else {

          await createAnnouncement(
            formData
          );

          notify.success(
            "Announcement published successfully."
          );

        }

        // ==========================================
        // RESET FORM
        // ==========================================

        setFormData({
          title: "",
          description: "",
          type: "General",
          audience: "Everyone",
          course: "",
          isPinned: false,
          status: "Active",
          expiresAt: "",
        });

        setEditingAnnouncement(null);

        // ==========================================
        // REFRESH ANNOUNCEMENTS
        // ==========================================

        fetchAnnouncements();

      } catch (error) {

        console.error(
          "Announcement submit error:",
          error
        );

        if (error.response) {

          console.log(
            "Status:",
            error.response.status
          );

          console.log(
            "Response:",
            error.response.data
          );

        }

        notify.apiError(error);
      }
    },
  });
};

  // ==========================
  // Edit
  // ==========================

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);

    setFormData({
      title: announcement.title,
      description: announcement.description,
      type: announcement.type,
      audience: announcement.audience,
      course: announcement.course?._id || "",
      isPinned: announcement.isPinned,
      status: announcement.status,
      expiresAt: announcement.expiresAt
        ? announcement.expiresAt.substring(0, 10)
        : "",
    });
  };

  // ==========================
  // Delete
  // ==========================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      await deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
      alert("Unable to delete announcement.");
    }
  };

  // ==========================
  // Pin / Unpin
  // ==========================

  const handleTogglePin = async (id) => {
    try {
      await togglePinAnnouncement(id);
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
      alert("Unable to update announcement.");
    }
  };

  return (
    <main className="announcements-page">

      <div className="page-header">
        <h1>Announcement Management</h1>

        <p>
          Create, publish and manage announcements
          for your academy.
        </p>
      </div>

      <AnnouncementForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingAnnouncement={editingAnnouncement}
      />

      <AnnouncementTable
        announcements={announcements}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleTogglePin={handleTogglePin}
      />

    </main>
  );
}

export default Announcements;