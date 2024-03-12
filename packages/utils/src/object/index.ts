/**
 * Extracts fields into new object
 * @param {string[]} fields - Fields to be extracted
 * @param {object} obj - Object to be extracted
 * @return object - New extracted object
 */
export function extract(fields: string[], obj: any): Record<string, any> {
  return fields.reduce((accu: any, field: string) => {
    if (typeof field === 'string') {
      return {
        ...accu,
        [field]: obj[field],
      };
    }
    return accu;
  }, {});
}

/**
 * Deletes fields from an object
 * @param {string[]} fields - Fields to be removed
 * @param {object} object
 * @return object - New object with removed fields
 */
export function removeFields(fields: string[], obj: any): Record<string, any> {
  const cloned = { ...obj };
  fields.forEach((field: string) => {
    delete cloned[field];
  });
  return cloned;
}
