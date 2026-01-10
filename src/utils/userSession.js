export const getCurrentUserId = (user) => {
    if (user && user.uid) {
        return user.uid;
    }

    // Check session storage for existing guest ID
    let guestId = sessionStorage.getItem("vaani_guest_id");

    if (!guestId) {
        // Generate a new random guest ID
        guestId = "guest_" + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem("vaani_guest_id", guestId);
    }

    return guestId;
};
