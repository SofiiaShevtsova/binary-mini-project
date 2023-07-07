class UserService {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async getUserById(id) {
    return await this._userRepository.getUserById(id);
  }

  async updateUser(id, data) {
    const usernameExists = await this._userRepository.getByUsername(
      data.username
    );
    if (usernameExists && usernameExists.id !== id) {
      throw new Error('This name exsist!');
    }
    return await this._userRepository.updateById(id, data);
  }
}

export { UserService };
