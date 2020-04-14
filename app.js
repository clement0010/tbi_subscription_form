const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function () {
    console.log("Server listening at port 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us19.api.mailchimp.com/3.0/lists/a9b2a7a0e4";
    const options = {
        auth: "clement0010:ee6ea38f3ca6b9593e185be0e109b383-us19",
        method: "POST"
    };

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        };
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/")
})