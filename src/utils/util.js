function validate(mode, { email, password, displayName }) {
    const errors = {};

    if (mode === "signup") {
        if (!displayName.trim()) {
            errors.displayName = "Name is required.";
        }
        else if (displayName.trim().length < 2) {
            errors.displayName = "Name must be at least 2 characters.";
        }
    }

    if (!email.trim()) {
        errors.email = "Email is required.";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!password) {
        errors.password = "Password is required.";
    }
    else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters.";
    }

    return errors;
}

function friendlyError(msg) {
    if (msg.includes("email-already-in-use")) {
        return "An account with this email already exists.";
    }
    if (msg.includes("user-not-found")) {
        return "No account found with this email.";
    }
    if (msg.includes("wrong-password")) {
        return "Incorrect password. Please try again.";
    }
    if (msg.includes("invalid-email")) {
        return "Please enter a valid email address.";
    }
    if (msg.includes("weak-password")) {
        return "Password should be at least 6 characters.";
    }
    if (msg.includes("popup-closed-by-user")) {
        return "Sign-in popup was closed. Please try again.";
    }

    return "Something went wrong. Please try again.";
}

export {
    validate,
    friendlyError,
}
