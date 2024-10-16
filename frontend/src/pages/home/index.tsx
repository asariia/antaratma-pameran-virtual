// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Card, CardActionArea, CardContent, CardMedia, Chip, Paper } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import { makeUseAxios } from 'axios-hooks'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

const sectionsOffline = [
  { title: 'The Truth Inside You', url: '#' },
  { title: 'Pameran Tetap', url: '#' },
  { title: 'ImersifA', url: '#' },
  { title: 'New Hope', url: '#' },
  { title: '2madison Chapter #2', url: '#' }
]

const sectionsOnline = [
  { title: 'The Truth Inside You', url: '#' },
  { title: 'Pameran Tetap', url: '#' },
  { title: 'ImersifA', url: '#' },
  { title: 'Pameran Tetap', url: '#' },
  { title: 'New Hope', url: '#' },
  { title: 'The Spirit Within', url: '#' }
]

const mainFeaturedPost = {
  title: 'Antaratma: Penuhi Jiwa dengan Keindahan Seni',
  description:
    'Selamat datang di situs Pameran kami! Kami menyediakan informasi lengkap tentang pameran-pameran terbaru, baik yang dilaksanakan secara online maupun offline. Temukan beragam pilihan pameran yang menarik dan sesuai dengan kebutuhan Anda.',
  image: 'https://storage.googleapis.com/udahgatau/huhu.png',
  imageText: 'main image description',
  linkText: 'Continue reading…'
}


const descTrim = (desc: string) => {
  return desc.length < 60 ? desc : desc.slice(0, 57) + '...'
}

const Home = () => {
  const router = useRouter()

  const { user } = useAuth()

  const useAxios = makeUseAxios({
    axios: axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASEURL,
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    })
  })

  const [{ data: ListData = [], error, loading }] = useAxios<any>({
    url: '/blog'
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'transparent',
            color: '#fff',
            mb: 4,
            backgroundSize: '640px',
            backgroundRepeat: 'no-repeat',

            // backgroundPosition: 'center',
            backgroundPosition: 'right 30px top -20px',
            backgroundImage: `url(${mainFeaturedPost.image})`
          }}
        >
          {/* Increase the priority of the hero background image */}
          {<img style={{ display: 'none' }} src={mainFeaturedPost.image} alt={mainFeaturedPost.imageText} />}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,.0)'
            }}
          />
          <Grid container>
            <Grid item md={8}>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 28 },
                  pr: { xs: 10, md: 15 },
                  pl: { xs: 10, md: 15 }
                }}
              >
                <Box>
                  <Typography variant='h3' color='rgb(0,0,0)' paragraph
                    sx={{
                      fontFamily: 'Mochiy Pop One',
                      marginBottom: '30px'
                    }}>Penuhi Jiwa dengan Keindahan Seni </Typography>
                </Box>
                <Typography variant='h5' align='left' color='rgb(71,85,105)' textAlign='justify' paragraph>
                  {mainFeaturedPost.description}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography component='h3' variant='h4' align='center' color='rgb(0,0,0)' gutterBottom
          sx={{
            fontFamily: 'Poppins',
          }}>
          Kunjungi Pameran
        </Typography>
        <Typography align='center' color='text.secondary' paragraph>
          Anda dapat mencari Pameran baik yang dilaksanakan secara online maupun offline
        </Typography>
        <Grid container spacing={4} sx={{ mt: 8 }}>
          <Grid item xs={12} md={6} sx={{ pt: 14 }}>
            <CardActionArea component='a' onClick={() => router.push('/pameran')} >
              <Card sx={{ display: 'flex' }}>
                <CardContent sx={{ flex: 1, pr: 8, pt: 6 }}>
                  <Typography component='h2' variant='h4' sx={{ mb: 3 }}>
                    Pameran Offline
                  </Typography>
                  <Typography variant='subtitle1' paragraph>
                    Nikmati pengalaman langsung dalam mengunjungi pameran offline terbaru kami. Dapatkan kesempatan
                    untuk melihat produk-produk unggulan dari para peserta pameran. Jangan lewatkan kesempatan ini!
                  </Typography>
                  <Typography variant='subtitle1' color='text.secondary'>
                    {sectionsOffline.map(e => (
                      <Chip key={e.title} label={e.title} sx={{ mb: 1, mr: 1 }} />
                    ))}
                  </Typography>
                  <Typography
                    variant='subtitle1'
                    color='primary'
                    sx={{ mt: 1 }}
                    onClick={() => router.push('/pameran')}
                  >
                    Lihat Semua...
                  </Typography>
                </CardContent>
                <CardMedia
                  component='img'
                  sx={{
                    width: '50%',
                    display: { xs: 'none', sm: 'block' }
                  }}
                  image={'https://vps.chipkoding.tech/upload/img/point-4.jpg'}
                  alt={'....'}
                />
              </Card>
            </CardActionArea>
          </Grid>

          <Grid item xs={12} md={6} sx={{ pt: 14 }}>
            <CardActionArea component='a' onClick={() => router.push('/pameran')} >
              <Card sx={{ display: 'flex' }}>
                <CardMedia
                  component='img'
                  sx={{
                    width: '50%',
                    display: { xs: 'none', sm: 'block' }
                  }}
                  image={'https://vps.chipkoding.tech/upload/img/point-3.jpg'}
                  alt={'....'}
                />
                <CardContent sx={{ flex: 1, pl: 8, pt: 6 }}>
                  <Typography component='h2' variant='h4' align='right' sx={{ mb: 3 }}>
                    Pameran Online
                  </Typography>
                  <Typography variant='subtitle1' align='right' paragraph>
                    Nikmati pengalaman langsung dalam mengunjungi pameran offline terbaru kami. Dapatkan kesempatan
                    untuk melihat produk-produk unggulan dari para peserta pameran. Jangan lewatkan kesempatan ini!
                  </Typography>
                  <Typography variant='subtitle1' align='right' color='text.secondary'>
                    {sectionsOnline.map((e, id) => (
                      <Chip key={id} label={e.title} sx={{ mb: 1, ml: 1 }} />
                    ))}
                  </Typography>
                  <Typography
                    variant='subtitle1'
                    align='right'
                    color='primary'
                    sx={{ mt: 1 }}
                    onClick={() => router.push('/pameran')}
                  >
                    Lihat Semua...
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        </Grid>

        <Box sx={{ my: 12 }}>
          <Typography component='h3' variant='h4' align='center' color='rgb(0,0,0)' gutterBottom
            sx={{
              fontFamily: 'Poppins',
            }}>
            Artikel Antaratma
          </Typography>
          <Typography align='center' color='text.secondary' paragraph>
            Kami menyediakan artikel-artikel terbaru seputar dunia pameran. Pelajari lebih lanjut tentang bagaimana
            memaksimalkan pengalaman dalam mengunjungi pameran dan tips-tips lainnya seputar dunia pameran. Jangan
            lewatkan kesempatan untuk meningkatkan pengetahuan Anda tentang pameran!
          </Typography>
        </Box>

        {loading && (
          <Typography align='center' color='text.secondary' paragraph>
            Loading...
          </Typography>
        )}
        {((error || !ListData.length) && !loading && (
          <Typography align='center' color='text.secondary' paragraph>
            Data Empty
          </Typography>
        )) || (
          <Grid container spacing={4}>
            {ListData?.slice(0, 6)?.map((e: any) => (
              <Grid key={e._id} item xs={12} sm={6} md={4}>
                <CardActionArea component='a' onClick={() => router.push('/artikel/' + e._id)} >
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
                      image={e?.photos?.[0] || 'https://source.unsplash.com/random?wallpapers'}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant='h5' component='h2'>
                        {e.title}
                      </Typography>
                      <Typography>{descTrim(e.description)}</Typography>
                    </CardContent>
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

Home.acl = {
  action: 'read',
  subject: 'home'
}

export default Home
