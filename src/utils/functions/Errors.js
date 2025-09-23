const { colors } = require('../bases');

const Errors = (err, menu) => new Promise(async(res, rej) => {
  menu = menu.replace(process.cwd(), '').replace('\\src', '').replaceAll('\\', '/');

  if (err.error) {
    return rej({ error: err.error });
  } 

  else {
    console.log(err);
    console.log(`${colors.RED}[${menu} ERROR]=> ${colors.RESET}`);
    return rej({ error: 'Ocorreu algum ERRO inesperado em meu sistema! Reporte ao meu desenvolvedor...' });
  }
});

module.exports = Errors;