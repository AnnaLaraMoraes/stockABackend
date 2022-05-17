export const isObject = (value) =>
  value && typeof value === 'object' && value.constructor === Object;

export const parseBool = (value) =>
  !(
    !value ||
    String(value).toLowerCase() === 'false' ||
    String(value).toLowerCase() === 'null'
  );

export const validateCnpj = (cnpj) => {
  if (!cnpj) return false;

  cnpj = cnpj.replace(/\D/g, '');

  if (cnpj.length !== 14) return false;

  if (
    cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999'
  )
    return false;

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let accumulator = 0;
  let pos = length - 7;

  const digits = cnpj.substring(length);

  for (let i = length; i >= 1; i -= 1) {
    accumulator += Number(numbers[length - i]) * pos;
    pos -= 1;

    if (pos < 2) pos = 9;
  }

  let result = accumulator % 11 < 2 ? 0 : 11 - (accumulator % 11);

  if (result !== Number(digits[0])) return false;

  length += 1;
  numbers = cnpj.substring(0, length);
  accumulator = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i -= 1) {
    accumulator += Number(numbers[length - i]) * pos;
    pos -= 1;

    if (pos < 2) pos = 9;
  }

  result = accumulator % 11 < 2 ? 0 : 11 - (accumulator % 11);

  if (result !== Number(digits[1])) return false;

  return true;
};

export const validateCpf = (cpf) => {
  if (!cpf) return false;

  cpf = cpf.replace(/\D/g, '');

  if (
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  )
    return false;

  let accumulator = 0;
  let rest;

  for (let i = 1; i <= 9; i += 1) {
    accumulator += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }

  rest = (accumulator * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10), 10)) return false;

  accumulator = 0;

  for (let i = 1; i <= 10; i += 1) {
    accumulator += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }

  rest = (accumulator * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11), 10)) return false;

  return true;
};

export const validateLicensePlate = (licensePlate) => {
  if (!licensePlate) return false;

  licensePlate = licensePlate.replace(/[^a-zA-Z0-9]/g, '');

  const regexLicensePlate = /^[a-zA-Z]{3}[0-9]{4}$/;
  const regexMercosulLicensePlate = /^[a-zA-Z]{3}[0-9]{1}[a-zA-Z]{1}[0-9]{2}$/;

  return (
    regexLicensePlate.test(licensePlate) ||
    regexMercosulLicensePlate.test(licensePlate)
  );
};
