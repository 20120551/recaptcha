require("dotenv").config()
const express = require("express");
const { create } = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const { createAssessment } = require("./recaptchaHandler");

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const hbs = create({
    extname: 'hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("form");
})
app.post("/recaptcha/v3", async (req, res) => {
    console.log(req.body);
    const { token, action } = req.body;
    const data = await createAssessment({ token, recaptchaAction: action });
    res.render("form", { score: data || 0 });
})
app.listen(3000, () => {
    console.log("server is listening in port 3000");
})