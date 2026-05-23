import { VOLUME_UNITS, VolumeUnit } from '@construction-journal/shared';

export interface JournalEntryProps {
  id: string;
  constructionSiteId: string;
  workDate: Date;
  workTypeId: string;
  workTypeName: string;
  employeeId: string;
  employeeName: string;
  volume: number;
  unit: VolumeUnit;
  createdAt: Date;
  updatedAt: Date;
}

export class JournalEntry {
  private constructor(private readonly props: JournalEntryProps) {}

  static create(
    props: Omit<JournalEntryProps, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
  ): JournalEntry {
    if (props.volume <= 0) {
      throw new Error('Объём должен быть больше нуля');
    }
    if (!VOLUME_UNITS.includes(props.unit)) {
      throw new Error('Недопустимая единица измерения');
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (props.workDate > today) {
      throw new Error('Дата выполнения не может быть в будущем');
    }

    return new JournalEntry({
      id: props.id ?? '',
      constructionSiteId: props.constructionSiteId,
      workDate: props.workDate,
      workTypeId: props.workTypeId,
      workTypeName: props.workTypeName,
      employeeId: props.employeeId,
      employeeName: props.employeeName,
      volume: props.volume,
      unit: props.unit,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: JournalEntryProps): JournalEntry {
    return new JournalEntry(props);
  }

  get id(): string {
    return this.props.id;
  }

  get constructionSiteId(): string {
    return this.props.constructionSiteId;
  }

  get workDate(): Date {
    return this.props.workDate;
  }

  get workTypeId(): string {
    return this.props.workTypeId;
  }

  get workTypeName(): string {
    return this.props.workTypeName;
  }

  get employeeId(): string {
    return this.props.employeeId;
  }

  get employeeName(): string {
    return this.props.employeeName;
  }

  get volume(): number {
    return this.props.volume;
  }

  get unit(): VolumeUnit {
    return this.props.unit;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
