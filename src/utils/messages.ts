import { config } from '..';

export const errorMessage = (typename: string) => config.get('errorMessage')(typename);

export const sizeErrorMessage = (size: string | number) => config.get('sizeErrorMessage')(size);
