export const signInWithSupabase = async () => {
  // Stub: simulate a successful login with Supabase
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ user: { id: 'dummy-user', email: 'dummy@example.com' } })
    }, 500)
  })
}

export const getSession = async () => {
  // Stub: simulate retrieving an active session
  return new Promise(resolve => {
    setTimeout(() => {
      // Return null for no session or a dummy session object if logged in
      resolve(null)
    }, 500)
  })
}
