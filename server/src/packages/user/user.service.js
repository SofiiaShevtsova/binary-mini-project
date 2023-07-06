class UserService {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async getUserById(id) {
    return await this._userRepository.getUserById(id);
  }

  async updateUser(id, data) {
    return await this._userRepository.updateById(id, data);
  }
}

export { UserService };
