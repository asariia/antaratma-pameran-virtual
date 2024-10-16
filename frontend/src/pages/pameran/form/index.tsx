// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import {
  Divider,
  TextField,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  DialogActions,
  Button,
  Radio,
  RadioGroup, FormControl, FormControlLabel,
  FormLabel
} from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios'
import UserIcon from 'src/layouts/components/UserIcon'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

const PameranFormPage = () => {
  // ** Hooks
  // const {user}: any = useThemeContext()
  // if (user?.name) return push("/")
  function srcset(image: string, width: number, height: number, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format&dpr=2 2x`
    }
  }

  const router = useRouter()
  const { user } = useAuth()
  const [image, setImage] = useState([] as { img: string; featured: boolean }[])
  const [image360, setImage360] = useState([] as { img: string; featured: boolean }[])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget)
    event.preventDefault()

    const payload = {
      title: data.get('title'),
      address: data.get('address'),
      online: data.get('online') === 'true' ? true : false,
      photos: image.map(e => e.img),
      photos360: image360.map(e => e.img),
      description: data.get('description'),
      tumbnail: image.map(e => e.img)[0],
      simpleText: data.get('description'),
      smallPhotos360: [],
      maxGuests: 100,
      price: 100000
    }

    axios
      .post('/fest', payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      })
      .then(() => {
        alert('tambah Pameran berhasil')
        router.push('/dashboard')
      })
  }

  return (
    <Grid container spacing={6}>
      <Grid xs={12} item sx={{ backgroundColor: '#eee', py: 8 }}>
        <Typography component='h3' variant='h4' align='center' color='text.primary' gutterBottom>
          Buat Pameran
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
            <Box sx={{ pt: 5, pb: 1 }}>
              <Box component='form' noValidate onSubmit={handleSubmit}>
                <TextField
                  margin='normal'
                  autoFocus
                  required
                  fullWidth
                  name='title'
                  label='Judul'
                  placeholder='Judul Pameran'
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='address'
                  label='Alamat'
                  placeholder='Alamat Pameran'
                />
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">Status Pameran</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="true"
                    name="online"
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Online" />
                    <FormControlLabel value="false" control={<Radio />} label="Offline" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  focused
                  name='photos360'
                  type='file'
                  label='Foto 360 List'
                  inputProps={{
                    accept: '.jpg,.jpeg,.png,.webp',
                    multiple: 'multiple'
                  }}
                  onChange={(image: any) => {
                    const [file] = image.target.files
                    if (file) {
                      for (let i = 0; i < image.target.files.length; i++) {
                        const data = new FormData()
                        data.append('sendimage', image.target.files[i])
                        axios({
                          url: 'https://vps.chipkoding.tech/upload.php',
                          method: 'POST',
                          data: data,
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'multipart/form-data'
                          },
                          withCredentials: false
                        }).then(response => {
                          const { data } = response
                          if (!data.status) return alert('upload failed')
                          setImage360(prev => {
                            return [
                              ...prev,
                              {
                                img: `https://vps.chipkoding.tech/upload/${data.fileName}`,
                                featured: !prev.length
                              }
                            ]
                          })
                        })
                      }
                      image.target.value = ''
                    }
                  }}
                />

                <ImageList
                  sx={{
                    display: !image360?.length ? 'none' : 'block',
                    width: 500,
                    height: 450,
                    transform: 'translateZ(0)'
                  }}
                  rowHeight={200}
                  gap={1}
                >
                  {image360.map((item: any, index: number) => {
                    const cols = 2
                    const rows = 2

                    return (
                      <ImageListItem key={item.img} cols={cols} rows={rows}>
                        <img {...srcset(item.img, 250, 400, rows, cols)} alt={'image'} loading='lazy' />
                        <ImageListItemBar
                          sx={{
                            background:
                              'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                              'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                          }}
                          position='top'
                          actionIcon={
                            <IconButton
                              sx={{ color: 'red' }}
                              aria-label={`delete`}
                              onClick={() =>
                                setImage360((prev: any) => {
                                  return prev.filter((e: any, id: number) => id != index)
                                })
                              }
                            >
                              <UserIcon icon={'ic:outline-delete'} fontSize={'1.5rem'} />
                            </IconButton>
                          }
                          actionPosition='right'
                        />
                      </ImageListItem>
                    )
                  })}
                </ImageList>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  focused
                  name='photos'
                  type='file'
                  label='Tumbnail / Foto Slide'
                  inputProps={{
                    accept: '.jpg,.jpeg,.png,.webp',
                    multiple: 'multiple'
                  }}
                  onChange={(image: any) => {
                    const [file] = image.target.files
                    if (file) {
                      for (let i = 0; i < image.target.files.length; i++) {
                        const data = new FormData()
                        data.append('sendimage', image.target.files[i])
                        axios({
                          url: 'https://vps.chipkoding.tech/upload.php',
                          method: 'POST',
                          data: data,
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'multipart/form-data'
                          },
                          withCredentials: false
                        }).then(response => {
                          const { data } = response
                          if (!data.status) return alert('upload failed')
                          setImage(prev => {
                            return [
                              ...prev,
                              {
                                img: `https://vps.chipkoding.tech/upload/${data.fileName}`,
                                featured: !prev.length
                              }
                            ]
                          })
                        })
                      }
                      image.target.value = ''
                    }
                  }}
                />

                <ImageList
                  sx={{
                    display: !image?.length ? 'none' : 'block',
                    width: 500,
                    height: 450,
                    transform: 'translateZ(0)'
                  }}
                  rowHeight={200}
                  gap={1}
                >
                  {image.map((item: any, index: number) => {
                    const cols = 2
                    const rows = 2

                    return (
                      <ImageListItem key={item.img} cols={cols} rows={rows}>
                        <img {...srcset(item.img, 250, 400, rows, cols)} alt={'image'} loading='lazy' />
                        <ImageListItemBar
                          sx={{
                            background:
                              'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                              'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                          }}
                          position='top'
                          actionIcon={
                            <IconButton
                              sx={{ color: 'red' }}
                              aria-label={`delete`}
                              onClick={() =>
                                setImage((prev: any) => {
                                  return prev.filter((e: any, id: number) => id != index)
                                })
                              }
                            >
                              <UserIcon icon={'ic:outline-delete'} fontSize={'1.5rem'} />
                            </IconButton>
                          }
                          actionPosition='right'
                        />
                      </ImageListItem>
                    )
                  })}
                </ImageList>

                <TextField
                  margin='normal'
                  required
                  name='description'
                  rows={4}
                  multiline
                  fullWidth
                  variant='filled'
                  label='Deskripsi'
                  placeholder='...'
                  id='textarea-outlined-static'
                />

                <DialogActions
                  sx={{
                    justifyContent: 'right',
                    pt: 3
                  }}
                >
                  <Button type='submit' variant='contained' sx={{ mr: 2 }}>
                    Submit
                  </Button>
                </DialogActions>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

PameranFormPage.acl = {
  action: 'read',
  subject: 'pameran-form'
}

export default PameranFormPage
