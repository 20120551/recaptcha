const express = require("express");
const { create } = require('express-handlebars');
const path = require('path');
const { createAssessment } = require("./recaptchaHandler");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const hbs = create({
    extname: 'hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.render("form");
})
app.post("/recaptcha/v3", async (req, res) => {
    const { token, recaptchaAction } = req.body;
    const data = await createAssessment({ token, recaptchaAction });
    if (data === null) {
        return res.status(500).text("something error");
    }
    return res.status(200).json(data);
})
app.listen(3000, () => {
    console.log("server is listening in port 3000");
})