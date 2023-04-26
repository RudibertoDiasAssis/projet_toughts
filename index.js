const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const hbs = require("express-handlebars");
const path = require("path"); // Importando o módulo path

const app = express();

const conn = require("./db/conn");

//require models
const Tought = require("./models/Tought");
const User = require("./models/User");

// require routes

const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");

// require controllers
const ToughtController = require("./controllers/ToughtController");

// template engine
app.engine(
    "hbs",
    hbs.engine({
        extname: "hbs",
        defaultLayout: "main",
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname, "views/partials"),
    })
)
.set("views", path.join(__dirname, "views"))
.set("view engine", "hbs")

// app.use(express.static(path.join(__dirname, "public")));

//receber res body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// session middleware

app.use(
  session({
    name: "session",
    secret: "my_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);

//config flash messages
app.use(flash());

// public path

app.use("/public", express.static(__dirname + "/public"));
// set session to res
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }
  next();
});

//routes
app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);

app.get("/", ToughtController.showToughts);

conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
