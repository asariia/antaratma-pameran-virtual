/* eslint-disable react-hooks/rules-of-hooks */
// ** React Imports
import { useEffect } from 'react'

// ** Axios
import axios from 'axios'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Button, CardActions, CardMedia } from '@mui/material'
import { Box } from '@mui/system'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { makeUseAxios } from 'axios-hooks'

const ArtikelDetailPage = () => {
  // ** Hooks
  const router = useRouter()
  const { user } = useAuth()
  if (!router.isReady) return
  const useAxios = makeUseAxios({
    axios: axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASEURL,
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    })
  })
  const [{ data: blogs = [], error, loading }, executeBlogs] = useAxios<any>(
    {
      url: '/blog'
    },
    { manual: true }
  )

  const [{ data: blog = [], error: errblog, loading: blogLoading }, executeBlog] = useAxios<any>(
    {
      url: '/blog/' + router.query.id
    },
    { manual: true }
  )
  useEffect(() => {
    executeBlogs()
    executeBlog()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const descTrim = (desc: string) => {
    return desc.length < 60 ? desc : desc.slice(0, 57) + '...'
  }

  return (
    <Grid container spacing={6}>
      <Grid item md={12} lg={12}>
        <Button variant='outlined' sx={{ my: 3 }} onClick={() => router.push('/artikel')}>
          Kembali
        </Button>
      </Grid>

      <Grid item md={12} lg={9}>
        {blogLoading && (
          <Typography align='center' color='text.secondary' paragraph>
            Loading...
          </Typography>
        )}
        {((!blog.title || errblog) && !blogLoading && (
          <Typography align='center' color='text.secondary' paragraph>
            Data Empty
          </Typography>
        )) || (
          <>
            <Grid item md={12} lg={9}>
              <Box sx={{ mb: 3, mt: 3 }}>
                <Typography component='h3' variant='h4' align='center' color='text.primary' gutterBottom>
                  {blog.title}
                </Typography>
              </Box>

              <CardMedia
                component='div'
                sx={{
                  // 16:9
                  pt: '56.25%'
                }}
                image={blog?.photos?.[0]}
              />

              <Box sx={{ px: 6, mt: 3 }}>
                <Typography align='left' color='text.secondary' paragraph>
                  {blog.description}
                </Typography>
              </Box>
            </Grid>
          </>
        )}
      </Grid>

      <Grid item md={12} lg={3}>
        {loading && (
          <Typography align='center' color='text.secondary' paragraph>
            Loading...
          </Typography>
        )}
        {((!blogs.length || error) && !loading && (
          <Typography align='center' color='text.secondary' paragraph>
            Data Empty
          </Typography>
        )) || (
          <Grid container spacing={4}>
            {blogs.map((e: any) => (
              <Grid item xs={12} key={e._id} sx={{ mb: 4 }}>
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
                    <Typography>{descTrim(e.description)}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size='small' onClick={() => router.push('/artikel/' + e._id)}>
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

ArtikelDetailPage.acl = {
  action: 'read',
  subject: 'artikel'
}

export default ArtikelDetailPage
