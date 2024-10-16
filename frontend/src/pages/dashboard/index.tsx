import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import CardHeader from '@mui/material/CardHeader'

// ** Custom Components Imports
import CardStatsHorizontal from 'src/@core/components/mui/card-stats-horizontal'
import TableStickyHeader from 'src/@core/components/table/mui/TableStickyHeader'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Card, Button } from '@mui/material'

import { useAuth } from 'src/hooks/useAuth'
import axios from 'axios'
import { makeUseAxios } from 'axios-hooks'

const statsHorizontal: any = [
  {
    title: 'New User',
    stats: '3',
    icon: 'mdi:account-outline'
  },

  {
    title: 'Total Pameran',
    stats: '24',
    color: 'warning',
    icon: 'mdi:poll',
  },

  {
    title: 'Total Blog',
    stats: '23',
    color: 'info',
    icon: 'mdi:trending-up',
  },
  {
    title: 'Total Booking',
    stats: '10',
    color: 'success',
    icon: 'mdi:currency-usd',
  }
]

const columnsUsers = [
  { id: 'name', label: 'Nama', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },
  {
    id: 'role', label: 'Role', minWidth: 100,
    align: 'right',
  },
]

const columnsFests = [
  { id: 'title', label: 'Judul', minWidth: 170 },
  {
    id: 'address', label: 'Alamat', minWidth: 170,
  },
  {
    id: 'online', label: 'Status', minWidth: 100,
    align: 'right',
    format: (value: boolean) => value ? 'online' : 'offline'
  },
  {
    id: 'description', label: 'Deskripsi', minWidth: 100,
    align: 'right',
  },
]

const columnsBlogs = [
  { id: 'title', label: 'Judul', minWidth: 170 },
  {
    id: 'description', label: 'Deskripsi', minWidth: 100,
    align: 'right',
  },
]

const columnsBookings = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },

  { id: 'phone', label: 'Nomor HP', minWidth: 100 },
  {
    id: 'bookingAt', label: 'Jam Booking', minWidth: 170,
    format: (value: any) => new Date(value).toLocaleString()
  },
  {
    id: 'age', label: 'Umur', minWidth: 100,
    align: 'right',
  },
  {
    id: 'gender', label: 'Jenis Kelamin', minWidth: 100,
    align: 'right',
  },
  {
    id: 'citizen', label: 'Kewarganegaraan', minWidth: 100,
    align: 'right',
  },
  {
    id: 'city', label: 'Kota', minWidth: 100,
    align: 'right',
  },
]

const columnsContacts = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'phone', label: 'Nomor HP', minWidth: 100 },
  {
    id: 'message', label: 'Pesan', minWidth: 100,
    align: 'right',
  },
]

const DashboardPage = () => {
  const [stats, setStats] = useState(statsHorizontal)

  const { user } = useAuth()
  const router = useRouter()

  const useAxios = makeUseAxios({
    axios: axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASEURL,
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    })
  })

  const [{ data: users = [], error: users_e, loading: users_l }, g_users] = useAxios<any>({
    url: '/users'
  },
    { manual: true })

  const [{ data: fests = [], error: fests_e, loading: fests_l }, g_fests] = useAxios<any>({
    url: '/fests'
  },
    { manual: true })

  const [{ data: blogs = [], error: blogs_e, loading: blogs_l }, g_blogs] = useAxios<any>({
    url: '/blog'
  },
    { manual: true })

  const [{ data: bookings = [], error: bookings_e, loading: bookings_l }, g_bookings] = useAxios<any>({
    url: '/bookingList'
  },
    { manual: true })

  const [{ data: contacts = [], error: contacts_e, loading: contacts_l }, g_contacts] = useAxios<any>({
    url: '/contacts'
  },
    { manual: true })

  useEffect(() => {
    g_users().then((users) => {
      if (users.data) setStats((prev: any) => prev.map((data: any, id: number) => id === 0 ? ({ ...data, stats: users.data.length }) : data))
    })
    g_fests().then((fests) => {
      if (fests.data) setStats((prev: any) => prev.map((data: any, id: number) => id === 1 ? ({ ...data, stats: fests.data.length }) : data))
    })
    g_blogs().then((blogs) => {
      if (blogs.data) setStats((prev: any) => prev.map((data: any, id: number) => id === 2 ? ({ ...data, stats: blogs.data.length }) : data))
    })
    g_bookings().then((bookings) => {
      if (bookings.data) setStats((prev: any) => prev.map((data: any, id: number) => id === 3 ? ({ ...data, stats: bookings.data.length }) : data))
    })
    g_contacts().then((contacts) => {
      if (contacts.data) setStats((prev: any) => prev.map((data: any, id: number) => id === 3 ? ({ ...data, stats: contacts.data.length }) : data))
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <Typography component='h3' variant='h4' align='center' color='text.primary' gutterBottom>
            Dashboard Antaratma!
          </Typography>
        </Box>
      </Grid>
      {stats.map((item: any, index: number) => {
        return (
          <Grid item xs={12} md={3} sm={6} key={index}>
            <CardStatsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
          </Grid>
        )
      })}

      {!users_e && !users_l && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title='List Users' />
            <TableStickyHeader columns={columnsUsers} rows={users} />
          </Card>
        </Grid>
      )}

      {!fests_e && !fests_l && (
        <Grid item xs={12}>
          <Card>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid>
                <CardHeader title='List Pameran' />
              </Grid>
              <Grid>
                <Button variant='outlined' sx={{ m: 3 }} onClick={() => router.push('/pameran/form')}>
                  Tambah Pameran
                </Button>
              </Grid>
            </Grid>
            <TableStickyHeader columns={columnsFests} rows={fests} />
          </Card>
        </Grid>
      )}

      {!blogs_e && !blogs_l && (
        <Grid item xs={12}>
          <Card>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid>
                <CardHeader title='List Artikel' />
              </Grid>
              <Grid>
                <Button variant='outlined' sx={{ m: 3 }} onClick={() => router.push('/artikel/form')}>
                  Tambah Artikel
                </Button>
              </Grid>
            </Grid>
            <TableStickyHeader columns={columnsBlogs} rows={blogs} />
          </Card>
        </Grid>
      )}

      {!bookings_e && !bookings_l && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title='List Bookings' />
            <TableStickyHeader columns={columnsBookings} rows={bookings} />
          </Card>
        </Grid>
      )}

      {!contacts_e && !contacts_l && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title='List Contacts' />
            <TableStickyHeader columns={columnsContacts} rows={contacts} />
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

DashboardPage.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default DashboardPage
