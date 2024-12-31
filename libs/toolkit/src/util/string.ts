export const strToPascalCase = (str: string) => {
  return str
    .split(/[-_ ]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

export const fromPascalToSnakeCase = (str: string) => {
  return str
    .split(/(?=[A-Z])/)
    .join("_")
    .toLowerCase();
};
