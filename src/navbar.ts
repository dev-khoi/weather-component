const navBar = () => {
    const menuButton = document.getElementById("user-menu-button");
    const dashboardButton = document.getElementById("dashboard-button")
    menuButton?.addEventListener("click", () => {
        const userMenu = document.getElementById("user-menu");
        if (userMenu) {
            if (userMenu.classList.contains("hidden")) {
                userMenu.classList.remove("hidden");
                userMenu.classList.remove("leave");
                userMenu.classList.add("enter");
            } else {
                userMenu.classList.remove("enter");
                userMenu.classList.add("leave");

                // Wait for animation to finish before hiding
                setTimeout(() => {
                    userMenu?.classList.add("hidden");
                    userMenu?.classList.remove("leave");
                }, 75); // match duration of leave animation
            }
        }
    });
    
    // dashboard navbar 
    dashboardButton?.addEventListener("click", () => {
        const dashboard = document.getElementById("mobile-menu");
        if (dashboard) {
            if (dashboard.classList.contains("hidden")) {
                dashboard.classList.remove("hidden");
                dashboard.classList.remove("dashboard-leave");
                dashboard.classList.add("dashboard-enter");
            } else {
                dashboard.classList.remove("dashboard-enter");
                dashboard.classList.add("dashboard-leave");

                // Wait for animation to finish before hiding
                setTimeout(() => {
                    dashboard?.classList.add("hidden");
                    dashboard?.classList.remove("dashboard-leave");
                }, 75); // match duration of leave animation
            }
        }
    });
};

export { navBar };
