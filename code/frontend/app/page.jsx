'use client'
import { useState } from 'react'
import { login } from '../lib/auth'
import { useRouter } from 'next/navigation'


export default function LoginPage() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const router = useRouter()


async function onSubmit(e) {
e.preventDefault()
try {
await login(email, password)
router.push('/dashboard')
} catch (err) {
alert('Login failed')
}
}


return (
<div className="min-h-screen flex items-center justify-center">
<form onSubmit={onSubmit} className="w-96 p-6 border rounded">
<h2 className="text-lg mb-4">Sign in</h2>
<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 mb-2" />
<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 mb-4" />
<button className="w-full p-2 bg-blue-600 text-white">Login</button>
</form>
</div>
)
}