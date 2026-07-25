import { dbRepository, calculateCosineSimilarity as calcSimilarity } from './repositories/database.repository';

export const db = dbRepository;
export const calculateCosineSimilarity = calcSimilarity;
