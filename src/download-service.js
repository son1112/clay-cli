var chalk    = require('chalk')
 ,  print    = console.log
 ,  fs       = require('fs-extra')
 ,  path     = require('path')
 ,  decompress  = require('decompress')
 ,  rp       = require('request-promise-native');


module.exports = function(serviceName) {

  // format serviceName
  serviceName = serviceName.split('/').slice(-2).join('-');

  const dir = path.resolve(process.cwd(), `${serviceName}`)

  if(fs.existsSync(dir)) {
    print(chalk.white(`Directory `)+chalk.red(`${dir}`)+chalk.white(` already exists please delete it to download this Clay service`));
    process.exit();
  }

  print(chalk.white(`Starting download of Clay service:\n`));

  var getFunctionOptions = {
    uri: this.apis.downloadApi,
    method: 'POST',
    body: {
      apiToken: this.credentials.token,
      functionName: serviceName
    },
    timeout: 0,
    json: true
  }

  rp(getFunctionOptions)
  .then((response) => {
    var downloadOptions = {
      uri: response.Code.Location,
      method: 'GET',
      timeout: 0,
      encoding: null,
      json: true
    }
    return rp(downloadOptions)
  })
  .then((downloadedCode) => {
    fs.writeFile(`${dir}.zip`, downloadedCode, (err) => {
      return decompress(`${dir}.zip`, `${dir}`)
    });
  })
  .then(() => {
    print(chalk.white(`Successfully downloaded the Clay service to this directory `)+chalk.red(`${dir}`));
  })
  .catch((err) => {
    print(chalk.white(`Please enter the name of the service or the url to the service. E.g. clay download nicoslepicos/whois or clay download http://clay.run/services/nicoslepicos/whois`))
    print(chalk.white(`Error has occurred please contact support@clay.run`))
    process.exit();
  })

}

