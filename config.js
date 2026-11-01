window.WAYGO_CONFIG = {
  SUPABASE_URL: "https://ysqqadnwnfalvzuiitor.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_YqcSlHSZUcerUur-7zLMYA_1GTCxcs9"};

// =====================================
// WAYGO – SUPABASE INITIALIZATION
// =====================================

const supabaseClient = window.supabase.createClient(
    window.WAYGO_CONFIG.SUPABASE_URL,
    window.WAYGO_CONFIG.SUPABASE_ANON_KEY
);

// =====================================
// AUTHENTICATION
// =====================================

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const authForm = document.getElementById("authForm");
const nameField = document.getElementById("nameField");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const submitBtn = document.getElementById("submitBtn");
const errorElement = document.getElementById("error");

const googleBtn = document.getElementById("googleBtn");
const appleBtn = document.getElementById("appleBtn");

const verificationModal = document.getElementById("verificationModal");
const closeModal = document.getElementById("closeModal");

let currentMode = "login";

function setMode(mode) {
    currentMode = mode;

    errorElement.textContent = "";

    const isLogin = mode === "login";

    loginTab.classList.toggle("active", isLogin);
    signupTab.classList.toggle("active", !isLogin);

    nameField.classList.toggle("hidden", isLogin);
    nameInput.required = !isLogin;

    passwordInput.autocomplete = isLogin
        ? "current-password"
        : "new-password";

    submitBtn.textContent = isLogin
        ? "Prihlásiť sa →"
        : "Vytvoriť účet →";
}

loginTab.addEventListener("click", () => setMode("login"));
signupTab.addEventListener("click", () => setMode("signup"));

// =====================================
// EMAIL AUTHENTICATION
// =====================================

authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    errorElement.textContent = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const name = nameInput.value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = "Spracovávam...";

    try {
        if (currentMode === "signup") {

            if (!name) {
                throw new Error("Zadaj svoje meno.");
            }

            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    },
                    emailRedirectTo: window.location.origin
                }
            });

            if (error) throw error;

            if (data.user && !data.session) {
                verificationModal.classList.remove("hidden");
            } else if (data.session) {
                window.location.href = "index.html";
            }

        } else {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

            if (error) throw error;

            if (data.session) {
                window.location.href = "index.html";
            }
        }

    } catch (error) {
        console.error("WayGo Auth:", error);
        errorElement.textContent = error.message || "Nastala chyba.";
    } finally {
        submitBtn.disabled = false;

        submitBtn.textContent = currentMode === "login"
            ? "Prihlásiť sa →"
            : "Vytvoriť účet →";
    }
});

// =====================================
// GOOGLE LOGIN
// =====================================

googleBtn.addEventListener("click", async () => {
    errorElement.textContent = "";

    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: window.location.origin
        }
    });

    if (error) {
        errorElement.textContent = error.message;
    }
});

// =====================================
// APPLE LOGIN
// =====================================

appleBtn.addEventListener("click", async () => {
    errorElement.textContent = "";

    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "apple",
        options: {
            redirectTo: window.location.origin
        }
    });

    if (error) {
        errorElement.textContent = error.message;
    }
});

// =====================================
// VERIFICATION MODAL
// =====================================

closeModal.addEventListener("click", () => {
    verificationModal.classList.add("hidden");
});

// =====================================
// SESSION CHECK
// =====================================

async function checkSession() {
    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error(error);
        return;
    }

    if (data.session) {
        console.log("WayGo: Používateľ je prihlásený.");
    }
}

checkSession();

console.log("WayGo successfully initialized!");
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>

</body>
</html>
