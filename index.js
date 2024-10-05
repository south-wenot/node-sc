const port = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");


const app = express();

const xmlo =[];
const newsPapers = [
    {
        name: "standard",
        address: "https://www.standard.co.uk/sport/football",
        base: ""
    },
    {
        name: "timesfootball",
        address: "https://www.timesfootball.co.uk/",
        base: ""
    },
    {
        name: "theguardian",
        address: "https://www.theguardian.com/football",
        base: ""
    },
    {
        name: "newsnow",
        address: "https://www.newsnow.com/ng/football/world+football",
        base: ""
    },
    {
        name: "europort",
        address: "https://www.eurosport.com/football/",
        base: ""
    },
    {
        name: "goal",
        address: "https://www.goal.com/en",
        base: ""
    },
    {
        name: "football",
        address: "https://www.football365.com/news",
        base: ""
    },
    {
        name: "Metro",
        address: "https://www.metro.co.uk/sport/football/",
        base: ""
    },
    {
        name: "espn",
        address: "https://www.espn.com/soccer/league/_/name/ger.1",
        base: ""
    },
    {
        name: "THESUN",
        address: "https://www.thesun.co.uk/sport/football/",
        base: ""
    },
    {
        name: "bbc",
        address: "https://www.bbc.com/sport/football/",
        base: ""
    },
];

const articles = [];

newsPapers.forEach((newsPaper) => {
    axios(newsPaper.address).then( response => {
        const html = response.data;
        const $ = cheerio.load(html);
        

        $('a:contains("football"),a:contains("messi"),a:contains("game"),a:contains("salah"),a:contains("ronaldo"),a:contains("liverpool"),a:contains("timesfootball")', html).each(function(){
            const title = $(this).text().replace(/\s+/g,' ').trim();
            const uri = $(this).attr('href').trim();
            articles.push({
                title,
                ur: newsPaper.base + uri,
                source: newsPaper.name
            })
           // console.log(articles);
        })
    }).catch(err => console.log(err));
})

app.get('/', (req, res) => {
    // axios.default('https://feeds.bbci.co.uk/sport/football/rss.xml').then(d=> {
    //     let jaso = d.data
    // xmlo.push(jaso)
    // }).catch(err => console.log(err.message))

    // res.status(200).json({
    //  xmlo
    // });
    res.json('Welcome to the game')
});

app.get('/news', async(req, res) => {
  res.json(articles);
});

app.get('/news/:newspaperId', (req, res) => {
    
    const newspaperId = req.params.newspaperId;
    
    
    const newspaperAddress = newsPapers.filter(newsPaper => newsPaper.name == newspaperId)[0].address;
    console.log(newspaperAddress);
    const newspaperBase = newsPapers.filter(newsPaper => newsPaper.name == newspaperId)[0].base;

    axios(newspaperAddress).then((ress)=> {
        const html = ress.data;
        const $ = cheerio.load(html);
        const specificArticles = [];

       

        $('a:contains("football")', html).each(function(){
            const title = $(this).text().trim();
            const ur = $(this).attr('href');

            specificArticles.push({
                title,
                ur: newspaperBase + ur,
                source: newspaperId
            })
        })
        res.json(specificArticles);
    }).catch((err) => console.log(err.message));
});


app.listen(port, () => console.log(`server running on port ${port}`));
