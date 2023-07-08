document.addEventListener('DOMContentLoaded', () => {

    // Switch between login and register forms
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('show', 'active');
        registerForm.classList.remove('show', 'active');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('show', 'active');
        loginForm.classList.remove('show', 'active');
    });

    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response) {
                const data = await response.json();
                if (data.error) {
                    throw new Error(response.error);
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Login Success',
                    text: 'Welcome! You have successfully logged in.',
                    customClass: {
                        icon: 'swal-icon-success',
                        confirmButton: 'swal-button'
                    },
                    confirmButtonColor: '#0069d9'
                });
                document.cookie = `token=${data.token}; expires=expiration_date; path=/`;
                window.location.href = "./event.html";
                console.log(data)

            } else {
                const { error } = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Wrong Password',
                    text: 'Please enter the correct password.',
                    customClass: {
                        icon: 'swal-icon-error',
                        confirmButton: 'swal-button'
                    },
                    confirmButtonColor: '#0069d9'
                });

            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred. Please try again later.',
                customClass: {
                    icon: 'swal-icon-error',
                    confirmButton: 'swal-button'
                },
                confirmButtonColor: '#0069d9'
            });

        }
    });

    // Register form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response) {
                const data = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Register Success',
                    text: 'Congratulations! You have successfully registered.',
                    customClass: {
                        icon: 'swal-icon-success',
                        confirmButton: 'swal-button'
                    },
                    confirmButtonColor: '#0069d9'
                });
                console.log(data)
                loginTab.click();
            } else {
                const { error } = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred. Please try again later.',
                    customClass: {
                        icon: 'swal-icon-error',
                        confirmButton: 'swal-button'
                    },
                    confirmButtonColor: '#0069d9'
                });

            }
        } catch (error) {
            console.error('Registration error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred. Please try again later.',
                customClass: {
                    icon: 'swal-icon-error',
                    confirmButton: 'swal-button'
                },
                confirmButtonColor: '#0069d9'
            });
        }
    });
});
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return null;
}
