const slugify = (input) => {
  let stringVal = input.trim().toLowerCase();
  const specialCharacters = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const normalCharacters = 'aaaaeeeeiiiioooouuuunc------';
  [...specialCharacters].forEach((character, index) => {
    stringVal = stringVal.replace(new RegExp(specialCharacters.charAt(index), 'g'), normalCharacters.charAt(index));
  });
  stringVal = stringVal.replace(/[^a-z0-9 -]/g, '').replace(/[\s-]+/g, '-');
  stringVal = (stringVal.endsWith('-')) ? stringVal.substring(0, stringVal.length - 1) : stringVal;
  return (stringVal.startsWith('-')) ? stringVal.substring(1, stringVal.length) : stringVal;
};

export default slugify;
