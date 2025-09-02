export { default as difficulties } from './difficulties';

export const search = {
  min_query_length: 2,
  max_results: 50,
};

export const study = {
  defaultSessionSize: 10,
  defaultReviewSize: 20,
  minStudyTime: 20 * 1000,
  reviewThreshold: 24 * 60 * 60 * 1000,
}