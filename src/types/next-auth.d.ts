import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      branchId: string | null
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    branchId: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    branchId: string | null
  }
}
