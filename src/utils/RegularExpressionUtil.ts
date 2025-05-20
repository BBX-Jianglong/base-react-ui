/* eslint-disable no-bitwise */
// 入力可能な文字種
export const CHARACTER_TYPE = {
  ALL: 0x000003ff, // 全文字種
  HALF_WIDTH_NUMBERS: 0x00000001, // 半角数字、半角スペース
  HALF_WIDTH_ALPHABETS: 0x00000002, // 半角英字、半角スペース
  HALF_WIDTH_SYMBOLS: 0x00000004, // 半角記号、半角スペース
  HALF_WIDTH_KATAKANA: 0x00000008, // 半角カタカナ、半角スペース
  FULL_WIDTH_NUMBERS: 0x00000010, // 全角数字、全・半角スペース
  FULL_WIDTH_ALPHABETS: 0x00000020, // 全角英字、全・半角スペース
  FULL_WIDTH_SYMBOLS: 0x00000040, // 全角記号、全・半角スペース
  FULL_WIDTH_KATAKANA: 0x00000080, // 全角カタカナ、全・半角スペース
  FULL_WIDTH_HIRAGANA: 0x00000100, // 全角ひらがな、全・半角スペース
  FULL_WIDTH_KANJI: 0x00000200, // 全角漢字、全・半角スペース
  HALF_WIDTH_CHARACTERS: 0x0000000f, // 半角文字(半角数字・英字・記号・カタカナ)、半角スペース
  FULL_WIDTH_CHARACTERS: 0x000003f0, // 全角文字(全角数字・英字・記号・カタカナ・ひらがな・漢字)、全・半角スペース
  FULL_WIDTH_CHARACTERS_EXCEPT_SYMBOLS: 0x000003b0, // 全角記号以外の全角文字、全・半角スペース
  HALF_WIDTH_EXCEPT_SPACE: 0x40000000, // 半角スペース除外
  NEWLINE: 0x80000000, // 改行
} as const;

// 半角数字(0～9)
const HALF_WIDTH_NUMBERS = '\u0030-\u0039';
// 半角英字(a～z、A～Z)
const HALF_WIDTH_ALPHABETS = '\u0041-\u005A\u0061-\u007A';
// 半角記号
const HALF_WIDTH_SYMBOLS =
  '\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u00FE\uF8F0\uFF61-\uFF65';
// 半角カタカナ(ｱ～ﾝ)
const HALF_WIDTH_KATAKANA = '\uFF66-\uFF9F';
// 半角スペース
const HALF_WIDTH_SPACE = '\u0020';
// 全角数字(０～９)
const FULL_WIDTH_NUMBERS = '\uFF10-\uFF19';
// 全角英字(ａ～ｚ、Ａ～Ｚ)
const FULL_WIDTH_ALPHABETS = '\uFF21-\uFF3A\uFF41-\uFF5A';
// 全角ひらがな
const FULL_WIDTH_HIRAGANA = '\u3041-\u3096\u3099-\u309F';
// 全角カタカナ
const FULL_WIDTH_KATAKANA = '\u30A1-\u30FA\u30FC-\u30FF\u31F0-\u31FF';
// 全角漢字
const FULL_WIDTH_KANJI = '\u4E00-\uABFF\uE000-\uF800\uF900-\uFAFF';
// 全角スペース
const FULL_WIDTH_SPACE = '\u3000';
// 改行
const NEWLINE = '\r\n';
/**
 * 指定された文字種に対応する正規表現を作成する
 * @param {number} characterType 入力可能な文字種(CHARACTER_TYPEを論理和で指定して複数の組み合わせが設定可能)
 * @return {string} 正規表現
 */
const getRegularExpression = (characterType: number): string => {
  let regex = '';
  // 指定された文字種の正規表現を作成する
  if (characterType & CHARACTER_TYPE.HALF_WIDTH_NUMBERS) {
    regex += HALF_WIDTH_NUMBERS;
  }
  if (characterType & CHARACTER_TYPE.HALF_WIDTH_ALPHABETS) {
    regex += HALF_WIDTH_ALPHABETS;
  }
  if (characterType & CHARACTER_TYPE.HALF_WIDTH_SYMBOLS) {
    regex += HALF_WIDTH_SYMBOLS;
  }
  if (characterType & CHARACTER_TYPE.HALF_WIDTH_KATAKANA) {
    regex += HALF_WIDTH_KATAKANA;
  }
  if (characterType & CHARACTER_TYPE.FULL_WIDTH_NUMBERS) {
    regex += FULL_WIDTH_NUMBERS;
  }
  if (characterType & CHARACTER_TYPE.FULL_WIDTH_KANJI) {
    regex += FULL_WIDTH_KANJI;
  }
  if (characterType & CHARACTER_TYPE.FULL_WIDTH_ALPHABETS) {
    regex += FULL_WIDTH_ALPHABETS;
  }
  if (characterType & CHARACTER_TYPE.FULL_WIDTH_KATAKANA) {
    regex += FULL_WIDTH_KATAKANA;
  }
  if (characterType & CHARACTER_TYPE.FULL_WIDTH_HIRAGANA) {
    regex += FULL_WIDTH_HIRAGANA;
  }
  if (characterType & CHARACTER_TYPE.NEWLINE) {
    regex += NEWLINE;
  }
  if (characterType & CHARACTER_TYPE.FULL_WIDTH_SYMBOLS) {
    // 半角スペース除外が設定される場合は半角スペースを外す
    if (characterType & CHARACTER_TYPE.HALF_WIDTH_EXCEPT_SPACE) {
      regex += HALF_WIDTH_SPACE;
    }
  } else {
    // 全角のいずれかの文字種にヒットする場合は全角スペースを含める
    if (characterType & CHARACTER_TYPE.FULL_WIDTH_CHARACTERS) {
      regex += FULL_WIDTH_SPACE;
    }
    // 半角スペース除外が設定されていない場合は半角スペースを含める
    if (!(characterType & CHARACTER_TYPE.HALF_WIDTH_EXCEPT_SPACE)) {
      regex += HALF_WIDTH_SPACE;
    }
  }
  return regex;
};

/**
 * 指定された文字種で構成された文字列かどうかを判断するための正規表現を作成する
 * @param {number} characterType 入力可能な文字種(CHARACTER_TYPE)
 * @return {string} 正規表現
 */
export const getRegularExpressionMatched = (characterType: number): string => {
  let regex = '^[';
  regex += getRegularExpression(characterType);
  regex += ']*$';
  return regex;
};

/**
 * 指定された文字を削除・置換するための正規表現を作成する
 * @param {number} characterType 入力可能な文字種(CHARACTER_TYPE)
 * @return {string} 正規表現
 */
export const getRegularExpressionCharMatched = (characterType: number): string => {
  let regex = '[';
  regex += getRegularExpression(characterType);
  regex += ']';
  return regex;
};

/**
 * 指定された文字種ではない文字を抽出するための正規表現を作成する
 * @param {number} characterType 入力可能な文字種(CharacterTypeを論理和で指定して複数の組み合わせが設定可能)
 * @return {string} 正規表現
 */
export const getRegularExpressionNotMatched = (characterType: number): string => {
  let regex = '[^';
  regex += getRegularExpression(characterType);
  regex += ']';
  return regex;
};
