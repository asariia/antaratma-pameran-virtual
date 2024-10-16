import React, { useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Modal, Button, CardMedia, CardActions, CardActionArea, Box, Link } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import axios from 'axios'
import { makeUseAxios } from 'axios-hooks'
import { useRouter } from 'next/router'

const descTrim = (desc: string) => {
  return desc.length < 60 ? desc : desc.slice(0, 57) + '...'
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const PameranPage = () => {
  // ** Hooks
  const router = useRouter()
  const bookingList: any = {}
  const List: any = []

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleLogin: any = () => router.replace('/login')

  useEffect(() => {
    if (!user?.token) handleOpen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { user } = useAuth()
  const useAxios = makeUseAxios({
    axios: axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASEURL,
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    })
  })

  const [{ data: ListOfflineData = [], error: errOff, loading: loadOff }] = useAxios<any>({
    url: '/fests?online=false'
  })

  const [{ data: ListOnlineData = [], error: errOn, loading: loadOn }] = useAxios<any>({
    url: '/fests?online=true'
  })

  const [{ data: bookings = [], error: errBook, loading: loadBook }] = useAxios<any>({
    url: '/bookingList'
  })

  if (bookings?.length) {
    bookings.map((e: any) => {
      const isNew = !bookingList?.[e.place._id];
      if (isNew) bookingList[e.place._id] = []
      bookingList[e.place._id].push(e)
    })
    Object.keys(bookingList).forEach((key: any) => List.push(
      <>
        <Typography component='h4' variant='h5' align='center' sx={{ my: 14 }} color='text.primary' gutterBottom key={key}>
          {bookingList[key]?.[0]?.place?.title} Pameran {bookingList[key]?.[0]?.place.online ? 'online' : 'offline'} (Total: {bookingList[key].length})
        </Typography>
        <Grid container spacing={4}>

          {bookingList[key].map((booking: any) => (
            <Grid item xs={12} sm={6} md={4} key={booking._id}>
              <Box sx={{ px: 6, mt: 3 }}>
                <Typography align='left' color='text.primary' paragraph>
                  Nama Lengkap / Fullname: {booking.name}
                </Typography>
              </Box>
              <Box sx={{ px: 6, mt: 3 }}>
                <Typography align='left' color='text.primary' paragraph>
                  Umur / Age: {booking.age} Tahun
                </Typography>
              </Box>
              <Box sx={{ px: 6, mt: 3 }}>
                <Typography align='left' color='text.primary' paragraph>
                  Jenis Kelamin / Gender: {booking.gender}
                </Typography>
              </Box>
              <Box sx={{ px: 6, mt: 3 }}>
                <Typography align='left' color='text.primary' paragraph>
                  Kewarganegaraan / Citizen: {booking.citizen}
                </Typography>
              </Box>
              <Box sx={{ px: 6, mt: 3 }}>
                <Typography align='left' color='text.primary' paragraph>
                  Kota / City: {booking.city}
                </Typography>
              </Box>
              <Box sx={{ px: 6, mt: 3 }}>
                <Typography align='left' color='text.primary' paragraph>
                  Email: {booking.email}
                </Typography>
              </Box>
              <Box sx={{ px: 6, mt: 3 }}>
                <Typography align='left' color='text.primary' paragraph>
                  Kontak Telepon / Phone Number: {booking.phone}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

      </>
    ))
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sx={{ mb: 12, textAlign: 'center' }}>
        <Typography component='h3' variant='h4' align='center' color='text.primary' gutterBottom>
          Pameran Antaratma
        </Typography>
        <Typography align='center' color='text.secondary' paragraph>
          Kami menyediakan artikel-artikel terbaru seputar dunia pameran. Pelajari lebih lanjut tentang bagaimana
          memaksimalkan pengalaman dalam mengunjungi pameran dan tips-tips lainnya seputar dunia pameran. Jangan
          lewatkan kesempatan untuk meningkatkan pengetahuan Anda tentang pameran!
        </Typography>

        <Modal
          open={open}
          onClose={handleLogin}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Selamat datang!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Anda harus login untuk mengakses fitur ini. <Link href="/policy">baca syarat dan ketentuan.</Link>
            </Typography>
            <Button variant="contained" sx={{ mt: 4 }} fullWidth={true} onClick={handleLogin}>Login</Button>
          </Box>
        </Modal>


        {user?.role === 'admin' && (
          <>
            <Typography component='h4' variant='h5' align='center' sx={{ my: 14 }} color='text.primary' gutterBottom>
              List Booking Pameran
            </Typography>

            {loadOff && (
              <Typography align='center' color='text.secondary' paragraph>
                Loading...
              </Typography>
            )}

            {((errBook || !bookings.length) && !loadBook && (
              <Typography align='center' color='text.secondary' paragraph>
                Data Empty
              </Typography>
            )) || List
            }
          </>
        )}

        <Typography component='h4' variant='h5' align='center' sx={{ my: 14 }} color='text.primary' gutterBottom>
          Pameran Offline
        </Typography>

        {loadOff && (
          <Typography align='center' color='text.secondary' paragraph>
            Loading...
          </Typography>
        )}
        {((errOff || !ListOfflineData.length) && !loadOn && (
          <Typography align='center' color='text.secondary' paragraph>
            Data Empty
          </Typography>
        )) || (
          <Grid container spacing={4}>
            {ListOfflineData.map((e: any) => (
              <Grid item xs={12} sm={6} md={4} key={e._id}>
                <CardActionArea component='a' onClick={() => router.push('/pameran/' + e._id)} >
                  <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <CardMedia
                        component='div'
                        sx={{
                          // 16:9
                          pt: '56.25%'
                        }}
                        image={e.tumbnail}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant='h5' component='h2'>
                          {e.title}
                        </Typography>
                        <Typography>{descTrim(e.simpleText)}</Typography>
                      </CardContent>
                      <CardActions>
                      <Button size='small' onClick={() => router.push('/pameran/' + e._id)}>
                        {e.address}
                        </Button>
                        {/* <Button size="small">Edit</Button> */}
                      </CardActions>
                  </Card>
                </CardActionArea>
              </Grid>
            ))}
          </Grid>
          )}

        <Typography component='h4' variant='h5' align='center' color='text.primary' sx={{ my: 14 }} gutterBottom>
          Pameran Online
        </Typography>

        {loadOn && (
          <Typography align='center' color='text.secondary' paragraph>
            Loading...
          </Typography>
        )}
        {((errOn || !ListOnlineData.length) && !loadOn && (
          <Typography align='center' color='text.secondary' paragraph>
            Data Empty
          </Typography>
        )) || (
            <Grid container spacing={4}>
              {ListOnlineData.map((e: any) => (
                <Grid item xs={12} sm={6} md={4} key={e._id}>
                  <CardActionArea component='a' onClick={() => router.push('/pameran/' + e._id)} >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <CardMedia
                        component='div'
                        sx={{
                          // 16:9
                          pt: '56.25%'
                        }}
                        image={e.tumbnail}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant='h5' component='h2'>
                          {e.title}
                        </Typography>
                        <Typography>{descTrim(e.simpleText)}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button size='small' onClick={() => router.push('/pameran/' + e._id)}>
                          {e.address}
                        </Button>
                      </CardActions>
                      {/* <CardActions>
                        {!!e.photos360.length && <Button size='small'>
                          360 View
                        </Button>}
                      </CardActions> */}
                    </Card>
                  </CardActionArea>
                </Grid>
              ))}
            </Grid>
          )}
      </Grid>
    </Grid>
  )
}

PameranPage.acl = {
  action: 'read',
  subject: 'pameran'
}

export default PameranPage
