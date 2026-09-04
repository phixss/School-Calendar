const logregBox = document.querySelector(".logreg-box");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");

registerLink.addEventListener("click", () => {
    logregBox.classList.add("active");
});
loginLink.addEventListener("click", () => {
    logregBox.classList.remove("active");
});

async function loadAccounts() {
    try {
        const response = await fetch('users.json');
        if (!response.ok) throw new Error("Cannot load users.json");
        return await response.json();
    } catch (err) {
        console.error("Error:", err);
        return { accounts: [] };
    }
}

const inpname = document.getElementById('inpname');
const inpemail = document.getElementById('inpemail');
const inppassword = document.getElementById('inppassword');
const signupBtn = document.getElementById('signup');

signupBtn.addEventListener('click', async function(e) {
    e.preventDefault();

    const name = inpname.value.trim();
    const email = inpemail.value.trim();
    const password = inppassword.value;

    if (!name || !email || !password) {
        alert('Please fill in ALL fields^^');
        return;
    }

    const data = await loadAccounts();

    const exists = data.accounts.find(acc => acc.email === email);
    if (exists) {
        alert('Email is already registered!');
        return;
    }

    data.accounts.push({name, email, password});

    localStorage.setItem('jsonAccounts', JSON.stringify(data));

    alert('YEY! Account registered successfully!^^');

    inpname.value = '';
    inpemail.value = '';
    inppassword.value = '';
    logregBox.classList.remove('active');
});

document.querySelector('.form-box.login .btn').addEventListener('click', async function(e) {
    e.preventDefault();

    const loginEmail = document.querySelector('.form-box.login input[type="email"]').value.trim();
    const loginPass = document.querySelector('.form-box.login input[type="password"]').value;

    let data = await loadAccounts();
    const backup = localStorage.getItem('jsonAccounts');
    if (backup) {
        const backupData = JSON.parse(backup);
        data.accounts = [...data.accounts, ...backupData.accounts];
    }
    const user = data.accounts.find(acc => 
        acc.email === loginEmail && acc.password === loginPass
    );

    if (user) {
        localStorage.setItem('currentUser', user.name);
        window.location.href = 'main.html';
    } else {
        const emailExists = data.accounts.find(acc => acc.email === loginEmail);
        if (emailExists) {
            alert('Incorrect password!><');
        } else {
            alert('Account not found! Please Sign Up first.^^');
        }
    }
});