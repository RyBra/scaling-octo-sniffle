import { VolumeUnit, WorkTypeDto } from '@construction-journal/shared';
import { WorkTypeRecord } from '../domain/work-type.repository';

export function toWorkTypeDto(workType: WorkTypeRecord): WorkTypeDto {
  return {
    id: workType.id,
    name: workType.name,
    code: workType.code,
    defaultUnit: workType.defaultUnit as VolumeUnit | null,
    isActive: workType.isActive,
    createdAt: workType.createdAt.toISOString(),
    updatedAt: workType.updatedAt.toISOString(),
  };
}
