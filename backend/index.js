const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("./models/User.js")
const Contact = require("./models/Contact.js")
const Place = require("./models/Place.js")
const Booking = require("./models/Booking.js")
const Blog = require("./models/Blog.js")
const cookieParser = require("cookie-parser")
const jwt_decode = require("jwt-decode")

require("dotenv").config()
const app = express()

const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = "asdfe45we45w345wegw345werjktjwertkjvercel"

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://www.antaratma.site",
      "https://antaratma.site",
      "https://antaratma-nextjs-fe.vercel.app",
      "https://antaratma-fe.vercel.app",
    ],
    default: "https://antaratma.site",
  })
)
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO_URL)

const reqToken = (req) => {
  return (
    req?.headers["authorization"] && req.headers["authorization"].split(" ")[1]
  )
}

function getUserDataFromReq(req) {
  const token = reqToken(req)

  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err
      resolve(userData)
    })
  })
}

app.get("/api/auth/me", async (req, res) => {
  // ** Get token from header
  // @ts-ignore
  console.log(req)

  const token = reqToken(req)
  if (token) {
    // ** Checks if the token is valid or expired
    jwt.verify(token, jwtSecret, {}, async (err, decoded) => {
      // ** If token is expired
      if (err) {
        // ** If onTokenExpiration === 'logout' then send 401 error
        // ** If onTokenExpiration === 'refreshToken' then generate the new token
        const oldTokenDecoded = jwt_decode(token)
        // ** Get user id from old token
        // @ts-ignore
        const { id: userId } = oldTokenDecoded.payload

        // // ** Get user that matches id in token

        const userDoc = await User.findOne({ _id: userId })
        delete userDoc.password

        // // ** Sign a new token
        const accessToken = jwt.sign({ id: userId }, jwtSecret, {
          expiresIn: "3600m",
        })
        userDoc.token = accessToken

        // ** Set new token in localStorage
        res.status(200).json({
          role: userDoc.role,
          email: userDoc.email,
          fullName: userDoc.name,
          username: userDoc.name,
          name: userDoc.name,
          id: userDoc._id,
          token,
        })
      } else {
        // ** If token is valid do nothing
        // @ts-ignore
        const userId = decoded.id
        const userDoc = await User.findOne({ _id: userId })

        delete userDoc.password

        // ** return 200 with user data
        res.status(200).json({
          role: userDoc.role,
          email: userDoc.email,
          fullName: userDoc.name,
          username: userDoc.name,
          name: userDoc.name,
          id: userDoc._id,
          token,
        })
      }
    })
  } else {
    res.status(401).json({ ok: false })
  }
})

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body
  const userDoc = await User.findOne({ email })
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          username: userDoc.name,
          role: userDoc.role,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err
          res.cookie("token", token).json({
            role: userDoc.role,
            email: userDoc.email,
            fullName: userDoc.name,
            username: userDoc.name,
            name: userDoc.name,
            id: userDoc._id,
            token,
          })
        }
      )
    } else {
      res.status(422).json("pass not ok")
    }
  } else {
    res.status(401).json({ ok: false })
  }
})

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body
  try {
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    })
    res.json({ ok: true })
  } catch (e) {
    res.status(422).json(e)
  }
})

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body
  try {
    await Contact.create({
      name,
      email,
      phone,
      message,
    })
    res.json({ ok: true })
  } catch (e) {
    res.status(422).json(e)
  }
})

app.get("/api/contacts", async (req, res) => {
  res.json(await Contact.find())
})

app.get("/api/users", async (req, res) => {
  const userData = await getUserDataFromReq(req)
  if (userData.role === "admin") {
    const users = await User.find()
    res.json(users.map(e => {
      delete e.password
      return e
    }))
  } else {
    res.status(500)
  }
})

app.post("/api/logout", (req, res) => {
  res.cookie("token", "").json(true)
})

app.get("/api/profile", (req, res) => {
  const token = reqToken(req)
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err
      const { name, email, profilePic, phone, role, _id } = await User.findById(
        userData.id
      )
      res.json({ name, email, profilePic, phone, role, _id })
    })
  } else {
    res.status(401).json({ ok: false })
  }
})

app.post("/api/upload-by-link", async (req, res) => {
  const { link, vps } = req.body
  if (vps) return res.json(link)
  const request = require("request").defaults({ encoding: null })
  request.get(link, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const data =
        "data:" +
        response.headers["content-type"] +
        ";base64," +
        Buffer.from(body).toString("base64")
      res.json(data)
    }
  })
})

app.post("/api/fest", (req, res) => {
  const token = reqToken(req)

  const {
    title,
    address,
    online,
    description,
    simpleText,
    tumbnail,
    photos = [],
    photos360 = [],
    smallPhotos360 = [],
    maxGuests = 100,
    price = 0,
  } = req.body

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      res.status(500)
      return
    }
    let placeDoc
    if (online) {
      placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        online,
        photos360,
        smallPhotos360,
        tumbnail,
        photos,
        description,
        simpleText,
        maxGuests,
        price,
      })
    } else {
      placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        online,
        tumbnail,
        photos,
        description,
        simpleText,
        maxGuests,
        price,
      })
    }

    res.status(200).json(placeDoc)
    return
  })
})

app.get("/api/user-fest", (req, res) => {
  const token = reqToken(req)

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData
    res.json(await Place.find({ owner: id }))
  })
})

app.get("/api/fest/:id", async (req, res) => {
  const { id } = req.params
  res.json(await Place.findById(id))
})

app.get("/api/fests", async (req, res) => {
  const { online: on } = req.query
  const online = on ? JSON.parse(on) : false
  if (on) {
    res.json(await Place.find({ online }))
  } else {
    res.json(await Place.find())
  }
})

app.put("/api/places", async (req, res) => {
  const token = reqToken(req)

  const {
    id,
    title,
    address,
    online,
    photos360,
    smallPhotos360,
    tumbnail,
    photos,
    description,
    simpleText,
    maxGuests,
    price,
  } = req.body
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err
    const placeDoc = await Place.findById(id)
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        online,
        photos360,
        smallPhotos360,
        tumbnail,
        photos,
        description,
        simpleText,
        maxGuests,
        price,
      })
      await placeDoc.save()
      res.json("ok")
    }
  })
})

app.post("/api/blog", (req, res) => {
  const token = reqToken(req)
  const { title, photos, description } = req.body

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      res.status(500)
      return
    }

    let blogDoc = await Blog.create({
      owner: userData.id,
      title,
      photos,
      description,
    })

    res.status(200).json(blogDoc)
    return
  })
})

app.get("/api/blog/:id", async (req, res) => {
  const { id } = req.params
  res.json(await Blog.findById(id))
})

app.get("/api/blog", async (req, res) => {
  res.json(await Blog.find())
})

app.put("/api/blog", async (req, res) => {
  const token = reqToken(req)

  const { id, title, photos, description } = req.body
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err
    const blogDoc = await Blog.findById(id)
    if (userData.id === blogDoc.owner.toString()) {
      blogDoc.set({
        title,
        photos,
        description,
      })
      await blogDoc.save()
      res.json("ok")
    }
  })
})

app.post("/api/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req)
  const {
    bookingAt,
    name,
    age,
    gender,
    citizen,
    city,
    price,
    phone,
    place,
    email,
  } = req.body
  Booking.create({
    bookingAt,
    name,
    age,
    gender,
    citizen,
    city,
    price,
    phone,
    place,
    email,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc)
    })
    .catch((err) => {
      throw err
    })
})

app.get("/api/bookingList", async (req, res) => {
  const userData = await getUserDataFromReq(req)
  if (userData.role === "admin") {
    res.json(await Booking.find().populate("place"))
  } else {
    res.status(500)
  }
})

app.get("/api/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req)
  res.json(await Booking.find({ user: userData.id }).populate("place"))
})

app.listen(4000)
