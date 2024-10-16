// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'


const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Home',
    path: '/home',
    action: 'read',
    subject: 'home',
    icon: 'mdi:home-outline',
  },
  {
    path: '/pameran',
    action: 'read',
    subject: 'pameran',
    title: 'Pameran',
    icon: 'mdi:camera-outline',
  },
  {
    path: '/artikel',
    action: 'read',
    subject: 'artikel',
    title: 'Artikel',
    icon: 'mdi:post',
  },
  {
    path: '/about',
    action: 'read',
    subject: 'about',
    title: 'Tentang Kami',
    icon: 'mdi:info-outline',
  },
  {
    path: '/policy',
    action: 'read',
    subject: 'policy',
    title: 'Ketentuan',
    icon: 'mdi:guardian',
  },
]

export default navigation
