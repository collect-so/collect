/* eslint-disable perfectionist/sort-enums */
export enum OP {
  /** Comparison operators **/
  $ne = '$ne',

  $gt = '$gt',
  $gte = '$gte',
  $lt = '$lt',
  $lte = '$lte',

  $in = '$in',
  $nin = '$nin',

  $contains = '$contains',
  $endsWith = '$endsWith',
  $startsWith = '$startsWith',

  /** Logical operators **/
  $and = '$and',
  $or = '$or',
  $xor = '$xor',
  $not = '$not'
}
