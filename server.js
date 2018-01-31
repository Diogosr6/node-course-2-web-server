const express = require('express');
const hbs = require('hbs');
var fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log');
        };
    });
    next();
});

/* // Maintenace page. Tudo o que estiver abaixo disto não vai ser executado
// porque não foi adicionado o next()
app.use((req, res, next) => {
    res.render('maintenance.hbs');
}); */

// Isto tem de estar aqui porque se não as paginas que estão no directorio publico
// iam aparecer na mesma independentemente da pagina de maintenance estar activa.
app.use(express.static(__dirname + "/public"));

// Em vez de termos esta funcao definida para cada pagina
// definimos aqui uma unica vez.
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to some website!!',
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Portfolio',
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request.'
    });
});


app.listen(port, () => {
    console.log(`Listening in port ${port}.`);
});