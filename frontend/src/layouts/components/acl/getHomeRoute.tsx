/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'client') return '/home'
  else return '/home'
}

export default getHomeRoute
