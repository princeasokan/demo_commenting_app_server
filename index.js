const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const logger = require('./utils/logger')
const app = express();
// process.on('uncaughtException',(error)=>{
// logger.exceptions(error)
// })

const route = require('./routes/v1');
app.use(cors({
  exposedHeaders: ['Content-Length', 'Content-Disposition'],
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
 app.use(express.static('public'))
app.use('/api/v1', route);
app.use('/api/*', (req, res, next) => {
  return res.status(404).send('not found');
})


app.get('/*', (req, res, next) => {
    return res.status(404).send('not found');
})

app.use((err, req, res, next) => {
  if (err.isServer) {
    //
  }
  else if (err.isBoom){
    const {output}=err;
    return res.status(output.statusCode).json(output.payload);   
  }
  const statuscode = err.statusCode || 500
  return res.status(statuscode).json({});
})
app.listen(4000, () => {
  logger.info('Server started..!!')
})

module.exports = app;