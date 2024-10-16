// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'

const PolicyPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ mb: 3, mt: 3 }}>
          <Typography component='h3' variant='h4' align='center' color='text.primary' gutterBottom>
            Syarat dan Ketentuan Antaratma!
          </Typography>
        </Box>

        <Box sx={{ px: 6, mt: 3 }}>
          <Typography align='left' color='text.secondary' paragraph>
            1. Pengguna yang ingin mengexplore fitur-fitur dalam website Antaratma haruslah login terlebih dahulu.
            <br />
            2. Pengguna yang belum memiliki akun, dapat membuat akun terlebih dahulu. Pengguna dapat mendaftarkan diri pada halaman sign up yang dapat terhubung dalam halaman sign in.
            <br />
            3. Dalam melakukan sign up pengguna harus memasukkan username, email serta password. Untuk username dan password, pengguna memiliki ketentuan minimal 5 karakter.
            <br />
            4. Email yang sudah pernah digunakan untuk mendaftar, tidak dapat didaftarkan kembali. Pengguna dapat menggunakan email lain yang dimiliki.
            <br />
            5. Setelah melakukan sign up, pengguna dapat langsung login ke website Antaratma dengan mengakses Sign In.
            <br />
            6. Pengguna dapat sign in dengan memasukkan email serta password yang telah didaftarkan sebelumnya.
            <br />
            7. Pengguna yang sign in dapat mengakses berbagai pameran yang telah tersedia dalam website Antaratma.
            <br />
            8. Jika pengguna memiliki kesulitan, dapat menghubungi pihak Antaratma dengan cara mengakses halaman Tentang Kami. Pengguna dapat menunggu 1 x 24 jam untuk menerima balasan email dari Antaratma.
            <br />
            9. Pengguna dapat melakukan reservasi tiket pemesanan Pameran Offline dalam setiap detail pameran. Pengguna hanya dapat memesan 1 tiket dalam periode tertentu.
            <br />
            10. Pengguna wajib menunjukkan tiket yang telah dipesan ketika melakukan kunjungan.
            <br />
            11. Bagi seniman yang ingin bekerja sama dengan Antaratma, juga dapat menghubungi kami pada halaman Tentang Kami.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

PolicyPage.acl = {
  action: 'read',
  subject: 'policy'
}

export default PolicyPage
