document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const errorMsg = document.getElementById('errorMsg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            fullName: form.fullName.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value.trim()
        };

        if (!formData.fullName || !formData.email || !formData.password) {
            errorMsg.textContent = "Please fill in all required fields.";
            return;
        }

        try {
            const res = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                errorMsg.textContent = data.message || "Signup failed";
                return;
            }

            alert('Account created successfully! Redirecting to login...');
            window.location.href = '/login';
        } catch (err) {
            console.error('Signup Error:', err);
            errorMsg.textContent = "Something went wrong. Please try again.";
        }
    });
});
