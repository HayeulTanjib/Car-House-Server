const express = require('express');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello From Node');
})

app.listen(port, () => {
    console.log("Listening On: ", port);
})



