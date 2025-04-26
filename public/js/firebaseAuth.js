// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6SndtBb3NYM6XQy75WYXvQ5WMxmhx5XY",
    authDomain: "dairahandyconnect.firebaseapp.com",
    projectId: "dairahandyconnect",
    storageBucket: "dairahandyconnect.firebasestorage.app",
    messagingSenderId: "773313785883",
    appId: "1:773313785883:web:90fe86961228cf3b7f48be"};
    

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    
    // Add auth state observer for debugging
    firebase.auth().onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'User logged out');
    });
} catch (error) {
    console.error('Error initializing Firebase:', error);
    // Show error on the page for better visibility
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #ff4444; color: white; padding: 10px; border-radius: 5px; z-index: 9999;';
    errorDiv.textContent = 'Firebase initialization error. Check console for details.';
    document.body.appendChild(errorDiv);
}

const auth = firebase.auth();

class AuthService {
    // Sign up with email and password
    async signUp(email, password) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();
            console.log('User signed up successfully:', user.email);
            return { user, token };
        } catch (error) {
            console.error('Signup error:', error);
            throw this.handleError(error);
        }
    }

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const token = await user.getIdToken();
            console.log('User signed in successfully:', user.email);
            return { user, token };
        } catch (error) {
            console.error('Sign in error:', error);
            throw this.handleError(error);
        }
    }

    // Sign in with Google
    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const userCredential = await auth.signInWithPopup(provider);
            const user = userCredential.user;
            const token = await user.getIdToken();
            console.log('User signed in with Google successfully:', user.email);
            return { user, token };
        } catch (error) {
            console.error('Google sign in error:', error);
            throw this.handleError(error);
        }
    }

    // Sign out
    async signOut() {
        try {
            await auth.signOut();
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Sign out error:', error);
            throw this.handleError(error);
        }
    }

    // Get current user
    getCurrentUser() {
        return new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged(user => {
                unsubscribe();
                if (user) {
                    console.log('Current user:', user.email);
                }
                resolve(user);
            }, error => {
                console.error('Auth state error:', error);
                reject(error);
            });
        });
    }

    // Get current user's token
    async getCurrentToken() {
        const user = await this.getCurrentUser();
        if (user) {
            return user.getIdToken();
        }
        return null;
    }

    // Handle Firebase Auth errors
    handleError(error) {
        let message = 'An error occurred during authentication.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                message = 'This email is already registered.';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address.';
                break;
            case 'auth/operation-not-allowed':
                message = 'Email/password accounts are not enabled.';
                break;
            case 'auth/weak-password':
                message = 'Password is too weak.';
                break;
            case 'auth/user-disabled':
                message = 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                message = 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                message = 'Invalid password.';
                break;
            case 'auth/popup-closed-by-user':
                message = 'Google sign-in popup was closed.';
                break;
        }

        return { code: error.code, message };
    }
}

// Export the auth service instance
const authService = new AuthService();

// Add auth state observer
auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? user.email : 'No user');
}); 