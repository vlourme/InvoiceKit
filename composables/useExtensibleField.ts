import { ExtensibleModel } from '~/types/model'
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
 * Get formatted field
 * @param {Team} team
 * @param {Customer} customer
 * @param {string} extension
 * @returns {string}
 */
export const getFormattedField = <T extends ExtensibleModel>(
  team: Team,
  customer: T,
  extension: string
): string => {
  // Regex
  const regex = /%{(\w+)}%/gim

  // Replace
  const format = team.extensions[extension].formatting

  return format.replace(regex, (sub, arg) => {
    return customer[arg] ?? sub
  })
}

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
