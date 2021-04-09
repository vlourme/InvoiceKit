import { ExtensibleField, FieldType, Team } from '~/types/team'

/**
 * Get primary key
 * Note: This function is force-casted
 *
 * @param {Team} team
 * @param {string} extension
 * @returns {ExtensibleField}
 */
export const getPrimaryKey = (team: Team, extension: string): ExtensibleField =>
  team.extensions[extension].fields.find((value) => {
    return value.primary
  })!

/**
 * Get every values from extension
 * @param {Team} team
 * @param {string} extension
 * @returns {string[]}
 */
export const getValues = (team: Team, extension: string): string[] =>
  team.extensions[extension].fields.map((value) => value.value)

/**
 * Get featured fields
 * @param {Team} team
 * @param {string} extension
 * @returns {ExtensibleField[]}
 */
export const getFeaturedFields = (
  team: Team,
  extension: string
): ExtensibleField[] =>
  team.extensions[extension].fields.filter((value) => value.featured)

/**
 * Get input type correspond to an HTML Input
 * @param {FieldType} type
 * @returns {string}
 */
export const getInputType = (type: FieldType): string => {
  switch (type) {
    case FieldType.Number:
      return 'number'
    case FieldType.Email:
      return 'email'
    case FieldType.Date:
      return 'date'
    case FieldType.Text:
    default:
      return 'text'
  }
}
