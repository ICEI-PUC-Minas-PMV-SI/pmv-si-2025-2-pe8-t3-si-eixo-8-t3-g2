import api from './api'
import Cookies from 'js-cookie'


export async function login(email, password) {
const res = await api.post('/api/auth/local', { identifier: email, password });
const { jwt, user } = res.data;
Cookies.set('token', jwt);
return user;
}


export function getToken() {
return Cookies.get('token');
}


export function authHeader() {
const token = getToken();
return token ? { Authorization: `Bearer ${token}` } : {};
}