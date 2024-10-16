/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
// ** React Imports
import { useEffect, useState, useCallback, useMemo } from 'react'

// ** Axios
import axios from 'axios'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Button, CardActionArea, CardActions, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { makeUseAxios } from 'axios-hooks'
import View360, { EquirectProjection } from '@egjs/react-view360'
import * as yup from 'yup'

// ** Third Party Imports
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import DatePicker from 'react-datepicker'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import addDays from 'date-fns/addDays'

// import { clsx } from 'clsx';
// import { PanoViewer, SpinViewer, PROJECTION_TYPE } from "@egjs/react-view360";
// ** Custom Component Imports


const schema = yup.object().shape({
  bookingAt: yup.date(),
  name: yup.string().required(),
  age: yup.string().required(),
  gender: yup.string().required(),
  citizen: yup.string().required(),
  city: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
})

const defaultValues = {
  bookingAt: setMinutes(new Date(), 0),
  name: '',
  age: '< 18',
  gender: 'female',
  citizen: 'WNI',
  city: '',
  email: '',
  phone: ''
}

const PameranDetailPage = () => {
  // ** Hooks
  const router = useRouter()
  const { user } = useAuth()
  const [srcNum, setSrc] = useState<number>(0)
  const [booking, setBooking] = useState<any>({})
  const [open, setOpen] = useState<boolean>(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  if (!router.isReady) return
  const useAxios = makeUseAxios({
    axios: axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASEURL,
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    })
  })

  const [{ data: fests = [], error, loading }, executeFests] = useAxios<any>(
    {
      url: '/fests'
    },
    { manual: true }
  )

  const [{ data: fest = {}, error: errfest, loading: festLoading }, executeFest] = useAxios<any>(
    {
      url: '/fest/' + router.query.id
    },
    { manual: true }
  )

  useEffect(() => {
    executeFests()
    executeFest()

    if (user?.role === 'client') checkBooking()

  }, [])

  const checkBooking = () => axios.get('/bookings', {
    headers: {
      Authorization: `Bearer ${user?.token}`
    }
  }).then((response) => {
    setBooking(response.data.find((e: any) => e.place._id === router.query.id))
  });

  const projection = useMemo(
    () =>
      new EquirectProjection({
        src: fest.photos360?.[srcNum] || ''
      }),
    [srcNum, fest.photos360]
  )

  const nextProjection = useCallback(() => {
    const nextRoom = srcNum < fest.photos360.length - 1 ? srcNum + 1 : 0
    setSrc(nextRoom)
  }, [srcNum, fest.photos360])

  const backProjection = useCallback(() => {
    const nextRoom = srcNum > 0 ? srcNum - 1 : fest.photos360.length - 1
    setSrc(nextRoom)
  }, [srcNum, fest.photos360])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: any) => {
    handleClose()
    const myPromise = new Promise((resolve, reject) => {
      axios.post('/bookings', { ...data, price: fest.price, place: router.query.id }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      }).then((response) => {
        checkBooking()
        resolve(response)
      }).catch((err) => reject(err))
    })

    return toast.promise(myPromise, {
      loading: 'Loading',
      success: 'Berhasil booking pameran!',
      error: 'Error when fetching'
    })
  }


  return (
    <Grid container spacing={6}>
      <Grid item md={12} lg={12}>
        <Button variant='outlined' sx={{ my: 3 }} onClick={() => router.push('/pameran')}>
          Kembali
        </Button>
      </Grid>

      <Grid item lg={12}>
        {festLoading && (
          <Typography align='center' color='text.secondary' paragraph>
            Loading...
          </Typography>
        )}
        {((!fest.title || errfest) && !festLoading && (
          <Typography align='center' color='text.secondary' paragraph>
            Data Empty
          </Typography>
        )) || (
            <Grid item lg={12}>
              <Box sx={{ mb: 3, mt: 3 }}>
                <Typography component='h3' variant='h4' align='center' color='text.primary' gutterBottom>
                  {fest.title}
                </Typography>
              </Box>

              {!!fest?.photos360?.length &&
                <Box
                  sx={{
                    width: '100%',
                    height: 665
                  }}
                >
                  <View360
                    className='CLASS_A'
                    canvasClass='CLASS_B'
                    hotspot={{
                      zoom: true
                    }}
                    projection={projection}
                    autoResize
                  >
                    {/* <div className="view360-hotspots">
                      {hotspots.map((hotspot, idx) => (
                        <div key={srcNum * 100 + idx} // A very rough way of bypassing key duplication
                          // Bind different class name by hotspot type
                          className={clsx("view360-hotspot", hotspot.type === "search" ? 'search' : 'link')}
                          data-yaw={hotspot.yaw}
                          data-pitch={hotspot.pitch}>
                          {hotspot.type === "link" ? hotspot.text : ""}
                        </div>
                      ))}
                    </div> */}
                  </View360>

                  <Box
                    sx={{
                      width: '100%',
                      textAlign: 'center'
                    }}
                  >
                    <Button variant='outlined' sx={{ my: 3 }} onClick={() => backProjection()}>
                      Back
                    </Button>

                    <Button variant='outlined' sx={{ my: 3 }} onClick={() => nextProjection()}>
                      Next
                    </Button>
                  </Box>
                </Box>
              }

              <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
              >
                {fest?.photos?.map((e: string) => (
                  <SwiperSlide key={e}>
                    <img src={e} alt={e} style={{ width: '100%', maxHeight: 600 }} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Box sx={{ px: 6, mt: 3 }}>
                <Typography align='left' color='text.secondary' paragraph>
                  {fest.description}
                </Typography>
              </Box>

              <Box sx={{ px: 6, mt: 3 }}>
                <Typography align='left' color='text.primary' paragraph>
                  Alamat: {fest.address}
                </Typography>
              </Box>

              {
                router.query.id === '64a0609ab8da8f6b1a41e421' && <Box sx={{ px: 6, mt: 3 }}>
                  <Typography align='left' color='text.primary' paragraph>
                    View 360 :
                  </Typography>
                  <a target="_blank" href="antaratma-virtualtour.site">
                    <Button variant='outlined'>
                      Lihat Pameran
                    </Button>
                  </a>
                </Box>
              }

              {user?.role === 'client' ?
                !booking?.name ? (
                  <Box sx={{ px: 6, mt: 3 }}>
                    <Typography align='left' color='text.primary' paragraph>
                      Pesan Tiket :
                    </Typography>
                    <Button variant='outlined' onClick={handleClickOpen}>
                      Booking sekarang yayi
                    </Button>
                  </Box>

                ) : (
                  <>
                    <Box sx={{ px: 6, mt: 3 }}>
                      <Typography component='h3' variant='h4' align='center' color='text.primary' gutterBottom>
                        Booking Berhasil
                      </Typography>
                    </Box>
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
                  </>
                ) : user?.role === 'guest' ? (
                  <Button variant='outlined' onClick={() => router.replace({
                    pathname: '/login',
                    query: { returnUrl: router.asPath }
                  })}>
                    Sign In
                  </Button>
                ) : null
              }



              <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Booking Tiket {fest.title}</DialogTitle>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                  <DialogContent>
                    <DialogContentText sx={{ mb: 8 }} color='text.primary'>
                      Alamat: {fest.address}
                    </DialogContentText>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <FormLabel component='legend'>Tanggal Kunjungan / Visit Date</FormLabel>
                      <Controller
                        name='bookingAt'
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <DatePicker
                            showTimeSelect
                            selected={value}
                            onBlur={onBlur}
                            id='specific-time'
                            dateFormat='MM/dd/yyyy h:mm aa'
                            onChange={onChange}
                            minDate={new Date()}
                            maxDate={addDays(new Date(), 5)}
                            minTime={setHours(setMinutes(new Date(), 0), 8)}
                            maxTime={setHours(setMinutes(new Date(), 30), 17)}
                            customInput={
                              <TextField
                                error={Boolean(errors.bookingAt)}
                                placeholder='date'
                              />
                            }
                          />
                        )}
                      />
                      {errors.bookingAt && <FormHelperText sx={{ color: 'error.main' }}>{errors.bookingAt.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <FormLabel component='legend'>Nama Lengkap / Fullname</FormLabel>
                      <Controller
                        name='name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.email)}
                            placeholder='Nama Lengkap / Fullname'
                          />
                        )}
                      />
                      {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <FormLabel component='legend'>Umur / Age</FormLabel>
                      <Controller
                        name='age'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <Select
                            value={value}
                            onBlur={onBlur}
                            error={Boolean(errors.age)}
                            onChange={onChange}
                            placeholder='Umur / Age'
                          >
                            <MenuItem value={'< 18'}>{`< 18 Tahun`}</MenuItem>
                            <MenuItem value={'18 - 24'}>{`18 - 24 Tahun`}</MenuItem>
                            <MenuItem value={'24 >'}>{`24 > Tahun`}</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.age && <FormHelperText sx={{ color: 'error.main' }}>{errors.age.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <FormLabel component='legend'>Jenis Kelamin / Gender</FormLabel>
                      <Controller
                        name='gender'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <RadioGroup
                            row
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                          >
                            <FormControlLabel value='female' control={<Radio />} label='Perempuan / Female' />
                            <FormControlLabel value='male' control={<Radio />} label='Laki-laki / Male' />
                          </RadioGroup>
                        )}
                      />
                      {errors.gender && <FormHelperText sx={{ color: 'error.main' }}>{errors.gender.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <FormLabel component='legend'>Kewarganegaraan / Citizen</FormLabel>
                      <Controller
                        name='citizen'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <RadioGroup
                            row
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                          >
                            <FormControlLabel value='WNI' control={<Radio />} label='WNI / Indonesia Citizen' />
                            <FormControlLabel value='WNA' control={<Radio />} label='WNA / Foreign Citizen' />
                          </RadioGroup>
                        )}
                      />
                      {errors.citizen && <FormHelperText sx={{ color: 'error.main' }}>{errors.citizen.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <FormLabel component='legend'>Kota / City</FormLabel>
                      <Controller
                        name='city'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.city)}
                            placeholder='Kota / City'
                          />
                        )}
                      />
                      {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <FormLabel component='legend'>Email</FormLabel>
                      <Controller
                        name='email'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.email)}
                            placeholder='your@mail.com'
                          />
                        )}
                      />
                      {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <FormLabel component='legend'>Kontak Telepon / Phone Number</FormLabel>
                      <Controller
                        name='phone'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.phone)}
                            placeholder='+62 '
                          />
                        )}
                      />
                      {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
                    </FormControl>
                  </DialogContent>
                  <DialogActions className='dialog-actions-dense'>
                    <Button onClick={handleClose} >Kembali / Back</Button>
                    <Button type='submit' variant='contained'>Kirim / Submit</Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Grid>
          )}
      </Grid>

      <Grid item lg={12}>
        <Typography component='h3' variant='h4' align='center' sx={{ my: 12 }} color='text.primary' gutterBottom>
          Pameran Lainnya
        </Typography>
        {loading && (
          <Typography align='center' color='text.secondary' paragraph>
            Loading...
          </Typography>
        )}
        {((!fests.length || error) && !loading && (
          <Typography align='center' color='text.secondary' paragraph>
            Data Empty
          </Typography>
        )) || (
            <Grid container spacing={4}>
              {fests.map((e: any) => (
                <Grid item xs={12} sm={6} md={4} key={e._id} sx={{ mb: 4 }}>
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
                        image={e.photos.length ? e.photos[0] : 'https://source.unsplash.com/random?wallpapers'}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant='h5' component='h2'>
                          {e.title}
                        </Typography>
                        <Typography>{e.simpleText}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button size='small' onClick={() => router.push('/pameran/' + e._id)}>
                          Pameran {e.online ? 'online' : 'offline'}
                        </Button>
                      </CardActions>
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

PameranDetailPage.acl = {
  action: 'read',
  subject: 'pameran'
}

export default PameranDetailPage
