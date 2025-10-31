export class Plan {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly durationInDays: number,
    public readonly features: string[],
    public readonly isActive: boolean,
    public readonly createdAt: Date,
  ) {}

  public isAvailable(): boolean {
    return this.isActive;
  }

  public calculateEndDate(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + this.durationInDays);
    return endDate;
  }
}

