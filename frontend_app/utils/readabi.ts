// utils/readAbiFromFile.ts
import fs from 'fs';

const readAbiFromFile = (filePath: string): any | null => {
  try {
    const abiData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(abiData);
  } catch (error) {
    console.error('Error reading ABI from file:', error);
    return null;
  }
};

export default readAbiFromFile;
