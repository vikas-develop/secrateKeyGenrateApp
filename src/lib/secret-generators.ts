/**
 * Secret Generator Algorithms
 * Various algorithms for generating secure secrets
 */

// Character sets
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const ALPHANUMERIC = LOWERCASE + UPPERCASE + NUMBERS;
const HEXADECIMAL = '0123456789abcdef';
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Similar characters that can be confused
const SIMILAR_CHARACTERS = {
  '0': ['O', 'o', 'Q', 'D'],
  'O': ['0', 'o', 'Q', 'D'],
  'o': ['0', 'O', 'Q', 'D'],
  '1': ['l', 'I', '|', 'i'],
  'l': ['1', 'I', '|', 'i'],
  'I': ['1', 'l', '|', 'i'],
  'i': ['1', 'l', 'I', '|'],
  '|': ['1', 'l', 'I', 'i'],
  '5': ['S', 's'],
  'S': ['5', 's'],
  's': ['5', 'S'],
  '2': ['Z', 'z'],
  'Z': ['2', 'z'],
  'z': ['2', 'Z'],
};

/**
 * Remove similar/confusing characters from a character set
 */
export function excludeSimilarCharacters(charset: string): string {
  const similarChars = new Set<string>();
  
  // Collect all similar characters
  Object.values(SIMILAR_CHARACTERS).forEach(group => {
    group.forEach(char => similarChars.add(char));
  });
  
  // Remove similar characters from charset
  return charset
    .split('')
    .filter(char => !similarChars.has(char))
    .join('');
}

/**
 * Get all similar characters for a given character
 */
export function getSimilarCharacters(char: string): string[] {
  return SIMILAR_CHARACTERS[char as keyof typeof SIMILAR_CHARACTERS] || [];
}

/**
 * Generate a cryptographically secure random number
 */
function getRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

/**
 * Generate a random character from a character set
 */
function getRandomChar(charset: string): string {
  if (charset.length === 0) {
    throw new Error('Character set cannot be empty');
  }
  return charset[getRandomInt(charset.length)];
}

/**
 * Generate a secret using a custom character set
 */
export function generateWithCustomCharset(
  length: number,
  charset: string,
  excludeSimilar: boolean = false
): string {
  let finalCharset = charset;
  
  if (excludeSimilar) {
    finalCharset = excludeSimilarCharacters(charset);
  }
  
  if (finalCharset.length === 0) {
    throw new Error('Character set is empty after filtering. Please add more characters.');
  }
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += getRandomChar(finalCharset);
  }
  return result;
}

/**
 * Algorithm 1: Random Alphanumeric String
 * Generates a random string using letters and numbers
 */
export function generateAlphanumeric(length: number = 32): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += getRandomChar(ALPHANUMERIC);
  }
  return result;
}

/**
 * Algorithm 2: Random String with Symbols
 * Generates a random string with letters, numbers, and special characters
 */
export function generateWithSymbols(length: number = 32, includeSymbols: boolean = true): string {
  const charset = includeSymbols 
    ? ALPHANUMERIC + SYMBOLS 
    : ALPHANUMERIC;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += getRandomChar(charset);
  }
  return result;
}

/**
 * Algorithm 3: Hexadecimal Key
 * Generates a hexadecimal string (0-9, a-f)
 */
export function generateHexadecimal(length: number = 32): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += getRandomChar(HEXADECIMAL);
  }
  return result;
}

/**
 * Algorithm 4: Base64-like String
 * Generates a string using Base64 character set
 */
export function generateBase64(length: number = 32): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += getRandomChar(BASE64_CHARS);
  }
  return result;
}

/**
 * Algorithm 5: UUID v4
 * Generates a UUID version 4 (random)
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = getRandomInt(16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Algorithm 6: Cryptographically Secure Random Bytes (Base64 encoded)
 * Uses Web Crypto API for maximum security
 */
export async function generateSecureRandom(length: number = 32): Promise<string> {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  // Convert to base64
  const binaryString = String.fromCharCode(...array);
  return btoa(binaryString).replace(/[+/=]/g, (m) => {
    if (m === '+') return '-';
    if (m === '/') return '_';
    return '';
  }).substring(0, length);
}

/**
 * Algorithm 7: API Key Format
 * Generates a key in format: xxxx-xxxx-xxxx-xxxx
 */
export function generateAPIKey(segments: number = 4, segmentLength: number = 4): string {
  const segmentsArray: string[] = [];
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += getRandomChar(ALPHANUMERIC);
    }
    segmentsArray.push(segment);
  }
  return segmentsArray.join('-');
}

/**
 * Algorithm 8: Numeric PIN
 * Generates a numeric PIN code
 */
export function generateNumericPIN(length: number = 6): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += getRandomChar(NUMBERS);
  }
  return result;
}

/**
 * Algorithm 9: Password with Requirements
 * Generates a password ensuring at least one character from each required set
 */
export function generatePassword(
  length: number = 16,
  options: {
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
  } = {}
): string {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = false,
  } = options;

  let charset = '';
  const requiredChars: string[] = [];

  if (includeLowercase) {
    charset += LOWERCASE;
    requiredChars.push(getRandomChar(LOWERCASE));
  }
  if (includeUppercase) {
    charset += UPPERCASE;
    requiredChars.push(getRandomChar(UPPERCASE));
  }
  if (includeNumbers) {
    charset += NUMBERS;
    requiredChars.push(getRandomChar(NUMBERS));
  }
  if (includeSymbols) {
    charset += SYMBOLS;
    requiredChars.push(getRandomChar(SYMBOLS));
  }

  if (charset.length === 0) {
    charset = ALPHANUMERIC;
    requiredChars.push(getRandomChar(ALPHANUMERIC));
  }

  // Start with required characters
  let password = requiredChars.join('');
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += getRandomChar(charset);
  }

  // Shuffle the password
  const passwordArray = password.split('');
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join('');
}

/**
 * Algorithm 10: Binary Key (displayed as hex)
 * Generates binary data and displays as hexadecimal
 */
export function generateBinaryKey(bytes: number = 16): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export type GeneratorAlgorithm =
  | 'alphanumeric'
  | 'with-symbols'
  | 'hexadecimal'
  | 'base64'
  | 'uuid'
  | 'secure-random'
  | 'api-key'
  | 'numeric-pin'
  | 'password'
  | 'binary-key';

export interface GeneratorConfig {
  algorithm: GeneratorAlgorithm;
  length?: number;
  includeSymbols?: boolean;
  segments?: number;
  segmentLength?: number;
  bytes?: number;
  passwordOptions?: {
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
  };
  customCharacterSet?: string;
  useCustomCharacterSet?: boolean;
  excludeSimilarCharacters?: boolean;
}

/**
 * Main generator function that routes to the appropriate algorithm
 */
export async function generateSecret(config: GeneratorConfig): Promise<string> {
  const { algorithm, length = 32 } = config;

  // Check if custom character set should be used
  if (config.useCustomCharacterSet && config.customCharacterSet) {
    return generateWithCustomCharset(
      length,
      config.customCharacterSet,
      config.excludeSimilarCharacters ?? false
    );
  }

  switch (algorithm) {
    case 'alphanumeric':
      return generateAlphanumeric(length);
    
    case 'with-symbols':
      return generateWithSymbols(length, config.includeSymbols ?? true);
    
    case 'hexadecimal':
      return generateHexadecimal(length);
    
    case 'base64':
      return generateBase64(length);
    
    case 'uuid':
      return generateUUID();
    
    case 'secure-random':
      return generateSecureRandom(length);
    
    case 'api-key':
      return generateAPIKey(config.segments ?? 4, config.segmentLength ?? 4);
    
    case 'numeric-pin':
      return generateNumericPIN(length);
    
    case 'password':
      return generatePassword(length, config.passwordOptions);
    
    case 'binary-key':
      return generateBinaryKey(config.bytes ?? 16);
    
    default:
      return generateAlphanumeric(length);
  }
}

