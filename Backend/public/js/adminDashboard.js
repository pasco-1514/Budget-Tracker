// public/js/adminDashboard.js

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/v1/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Unauthorized or failed");

      const users = await res.json();
      const tbody = document.getElementById("usersTable");

      tbody.innerHTML = users.map(user => `
        <tr>
          <td>${user.fullName}</td>
          <td>${user.email}</td>
          <td>${user.isAdmin ? "Yes" : "No"}</td>
          <td>
            ${!user.isAdmin ? `<button onclick="makeAdmin('${user._id}')" class="btn blue">Make Admin</button>` : ""}
            <button onclick="deleteUser('${user._id}')" class="btn red">Delete</button>
          </td>
        </tr>
      `).join("");
    } catch (err) {
      console.error("Fetch users failed:", err);
    }
  };

  window.makeAdmin = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/v1/admin/users/${id}/make-admin`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUsers();
  };

  window.deleteUser = async (id) => {
    const token = localStorage.getItem("token");
    if (confirm("Are you sure?")) {
      await fetch(`/api/v1/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    }
  };

  fetchUsers();
});
