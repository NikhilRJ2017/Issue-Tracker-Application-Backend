// *********************** custom page not found for invalid route ***********************/
const pageNotFound = (req, res) => res.send(`<h1>Page Not Found <br><br> <a href="/">Back</a></h1>`);
module.exports = pageNotFound;