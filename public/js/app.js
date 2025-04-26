document.addEventListener('DOMContentLoaded', () => {
    // Modal elements
    const modal = document.getElementById('loginModal');
    const openModalBtn = document.getElementById('openLoginModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const profileButton = document.getElementById('profileButton');
    const userEmailSpan = document.getElementById('userEmail');

    // Login/Signup form elements
    const loginButton = document.getElementById('loginButton');
    const googleLoginButton = document.getElementById('googleLoginButton');
    const signupButton = document.getElementById('signupButton');

    // Modal controls
    openModalBtn.onclick = () => {
        modal.style.display = 'block';
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    showSignupLink.onclick = (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'flex';
    };

    showLoginLink.onclick = (e) => {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'flex';
    };

    // Authentication handlers
    loginButton.onclick = async () => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const result = await authService.signIn(email, password);
            handleSuccessfulAuth(result.user);
        } catch (error) {
            alert(error.message);
        }
    };

    googleLoginButton.onclick = async () => {
        try {
            const result = await authService.signInWithGoogle();
            handleSuccessfulAuth(result.user);
        } catch (error) {
            alert(error.message);
        }
    };

    signupButton.onclick = async () => {
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const result = await authService.signUp(email, password);
            handleSuccessfulAuth(result.user);
        } catch (error) {
            alert(error.message);
        }
    };

    // Handle successful authentication
    function handleSuccessfulAuth(user) {
        modal.style.display = 'none';
        openModalBtn.style.display = 'none';
        profileButton.style.display = 'flex';
        userEmailSpan.textContent = user.email;

        // Clear form fields
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('signupConfirmPassword').value = '';
    }

    // Check if user is already logged in
    authService.getCurrentUser().then(user => {
        if (user) {
            handleSuccessfulAuth(user);
        }
    });

    // Profile button dropdown (optional)
    profileButton.onclick = async () => {
        if (confirm('Do you want to log out?')) {
            try {
                await authService.signOut();
                profileButton.style.display = 'none';
                openModalBtn.style.display = 'block';
            } catch (error) {
                alert(error.message);
            }
        }
    };
}); 