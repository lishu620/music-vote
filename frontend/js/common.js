const API_BASE = `${window.location.protocol}//${window.location.host}`;

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

function checkLogin() {
    if (!getToken()) {
        location.href = 'login.html';
    }
}

async function request(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json'
    };
    const token = getToken();
    if (token) {
        headers['x-token'] = token;
    }
    const response = await fetch(API + url, {
        ...options,
        headers
    });
    return await response.json();
}