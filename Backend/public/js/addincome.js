document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("incomeForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required");
      return;
    }

    const data = {
      source: form.title.value,
      amount: form.amount.value,
      date: form.date.value,
      category: form.category.value,
      description: form.description.value,
    };

    try {
      const res = await fetch("/api/v1/income/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || "Failed to add income.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Income error:", err);
      alert("Something went wrong.");
    }
  });
});
