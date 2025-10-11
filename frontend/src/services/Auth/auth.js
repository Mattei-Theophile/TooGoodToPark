export const login = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (data.token) {
            // Store in localStorage instead
            localStorage.setItem('auth_token', data.token);
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const isLoggedIn = () => {
    const token = localStorage.getItem('auth_token');
    return token !== null && token !== undefined;
}

export const logout = () => {

    fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Failed to logout');
        }
        localStorage.removeItem('auth_token');
        console.log("The user is logged out");
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        })
}
