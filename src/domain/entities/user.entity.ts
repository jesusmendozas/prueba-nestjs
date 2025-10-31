export class User {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: Date,
  ) {}

  public isPasswordValid(hashedPassword: string): boolean {
    return this.password === hashedPassword;
  }

  public toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

