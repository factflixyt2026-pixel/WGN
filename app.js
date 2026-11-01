
const authForm = document.getElementById("authForm");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const nameField = document.getElementById("nameField");
const submitBtn = document.getElementById("submitBtn");
const errorBox = document.getElementById("error");
const modal = document.getElementById("verificationModal");

let mode = "login";

function setMode(newMode) {
    mode = newMode;

    loginTab.classList.toggle("active", mode === "login");
    signupTab.classList.toggle("active", mode === "signup");

    nameField.classList.toggle("hidden", mode === "login");

    submitBtn.textContent =
        mode === "login" ? "Prihlásiť sa →" : "Vytvoriť účet →";

    document.getElementById("password").autocomplete =
        mode === "login" ? "current-password" : "new-password";

    errorBox.textContent = "";
}

loginTab.addEventListener("click", () => setMode("login"));
signupTab.addEventListener("click", () => setMode("signup"));

authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value.trim();

    submitBtn.disabled = true;

    try {
        if (mode === "signup") {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name },
                    emailRedirectTo: location.origin + "/login.html"
                }
            });

            if (error) throw error;

            if (data.session) {
                location.replace("index.html");
            } else {
                modal.classList.remove("hidden");
            }

        } else {
            const { data, error } =
                await supabase.auth.signInWithPassword({
                    email,
                    password
                });

            if (error) throw error;

            location.replace("index.html");
        }

    } catch (error) {
        errorBox.textContent = error.message;
    } finally {
        submitBtn.disabled = false;
    }
});

// Google login
document.getElementById("googleBtn").addEventListener("click", async () => {
    await socialLogin("google");
});

// Apple login
document.getElementById("appleBtn").addEventListener("click", async () => {
    await socialLogin("apple");
});

async function socialLogin(provider) {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: location.origin + "/login.html"
            }
        });

        if (error) throw error;

    } catch (error) {
        errorBox.textContent = error.message;
    }
}

// Verification modal
document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
    setMode("login");
});

