// config/roleRoutes.ts

export const ROLE_ROUTES = {
  super_admin: ['/admin'],
  institute_admin: ['/dashboard'],
  faculty: ['/dashboard'],
  student: ['/dashboard'],
  parent: ['/dashboard'],
} as const;