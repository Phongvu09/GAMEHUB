export function getCurrentRole() {
    return localStorage.getItem('userRole')
}

export function logout() {
    localStorage.removeItem('userRole')
}
