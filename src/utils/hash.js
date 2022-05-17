/* eslint-disable import/prefer-default-export */
import bcrypt from 'bcryptjs';

/**
 * Create a hash from the informed value.
 *
 * @param {String} password Value to be hashed.
 */
export const hashPassword = async (password) => {
  let hasError = false;
  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    hasError = error;
    console.log(error);
  }

  return {
    hasError,
    hashedPassword,
  };
};
